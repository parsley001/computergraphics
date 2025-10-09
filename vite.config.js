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
 * Assignment Files API Plugin for Vite
 * 
 * assignmentsフォルダのファイル一覧を提供するViteプラグイン
 * 開発時にリアルタイムでファイルリストを取得するためのAPIエンドポイント `/api/assignments` を作成します。
 * 
 * 機能:
 * - assignmentsフォルダ内の.jsファイルを自動検出
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
                        
                        // ディレクトリ内の.jsファイルを取得・整形・ソート
                        const files = fs.readdirSync(assignmentsDir)
                            .filter(file => file.endsWith('.js'))
                            .map(file => ({
                                name: file,
                                basename: path.basename(file, '.js')
                            }))
                            .sort((a, b) => sortAssignmentFiles(a.name, b.name));
                        
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
