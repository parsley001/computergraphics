import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';

/**
 * ファイル名をソートする関数（vite.config.js内で直接定義）
 */
function sortAssignmentFiles(a, b) {
    const aMatch = a.match(/(\d+)-(\d+)\.js/);
    const bMatch = b.match(/(\d+)-(\d+)\.js/);
    
    if (aMatch && bMatch) {
        const aChapter = parseInt(aMatch[1], 10);
        const aSection = parseInt(aMatch[2], 10);
        const bChapter = parseInt(bMatch[1], 10);
        const bSection = parseInt(bMatch[2], 10);
        
        if (aChapter !== bChapter) return aChapter - bChapter;
        return aSection - bSection;
    }
    
    return a.localeCompare(b);
}

/**
 * ディレクトリを再帰的に検索してJSファイルを取得する関数
 */
function getJSFilesRecursively(dir, basePath = '') {
    const files = [];
    
    try {
        const items = fs.readdirSync(dir);
        
        for (const item of items) {
            const fullPath = path.join(dir, item);
            const stat = fs.statSync(fullPath);
            
            if (stat.isDirectory()) {
                // サブディレクトリを再帰的に検索
                const subPath = basePath ? `${basePath}/${item}` : item;
                files.push(...getJSFilesRecursively(fullPath, subPath));
            } else if (item.endsWith('.js')) {
                // JSファイルを追加
                const relativePath = basePath ? `${basePath}/${item}` : item;
                files.push({
                    name: item,
                    path: relativePath,
                    basename: path.basename(item, '.js'),
                    directory: basePath || 'root'
                });
            }
        }
    } catch (error) {
        console.warn(`ディレクトリの読み込みに失敗: ${dir}`, error.message);
    }
    
    return files;
}

/**
 * Assignment Files API Plugin for Vite
 * 
 * assignmentsフォルダのファイル一覧を提供するViteプラグイン
 * 開発時にリアルタイムでファイルリストを取得するためのAPIエンドポイント `/api/assignments` を作成します。
 * 
 * 機能:
 * - assignmentsフォルダ内の.jsファイルを再帰的に自動検出
 * - サブディレクトリ構造をサポート
 * - ファイル名の自然順ソート（2-1.js < 2-2.js < 10-1.js）
 * - JSON形式でファイル情報を返却
 * 
 * @returns {Object} Viteプラグインオブジェクト
 */
function assignmentsPlugin() {
    return {
        name: 'assignments-plugin',
        configureServer(server) {
            server.middlewares.use('/api/assignments', (req, res, next) => {
                if (req.method === 'GET') {
                    try {
                        const assignmentsDir = path.join(process.cwd(), 'src', 'assignments');
                        
                        // ディレクトリ内の.jsファイルを再帰的に取得・整形・ソート
                        const files = getJSFilesRecursively(assignmentsDir)
                            .sort((a, b) => {
                                // ディレクトリ名でまずソート、その後ファイル名でソート
                                if (a.directory !== b.directory) {
                                    return a.directory.localeCompare(b.directory);
                                }
                                return sortAssignmentFiles(a.name, b.name);
                            });
                        
                        // JSON形式でレスポンス
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify(files));
                    } catch (error) {
                        // エラー時は500ステータスで詳細情報を返却
                        res.statusCode = 500;
                        res.end(JSON.stringify({ 
                            error: 'assignmentsディレクトリの読み込みに失敗しました',
                            message: error.message 
                        }));
                    }
                } else {
                    next();
                }
            });
        }
    };
}

export default defineConfig({
    server: {
        port: 3000,
        open: true
    },
    plugins: [assignmentsPlugin()]
});
