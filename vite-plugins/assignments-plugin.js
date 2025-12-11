import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';

/**
 * ファイル名をソートする関数
 * 数字パターン（章-節.js）を数値として正しくソート
 * @param {string} a - 比較するファイル名A
 * @param {string} b - 比較するファイル名B
 * @returns {number} ソート順序
 */
export function sortAssignmentFiles(a, b) {
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
 * ディレクトリを再帰的に検索してJSファイルを取得
 * @param {string} dir - 検索対象ディレクトリ
 * @param {string} basePath - ベースパス
 * @returns {Array} ファイル情報の配列
 */
export function getJSFilesRecursively(dir, basePath = '') {
    const files = [];
    
    try {
        const items = fs.readdirSync(dir);
        
        for (const item of items) {
            const fullPath = path.join(dir, item);
            const stat = fs.statSync(fullPath);
            
            if (stat.isDirectory()) {
                const subPath = basePath ? `${basePath}/${item}` : item;
                files.push(...getJSFilesRecursively(fullPath, subPath));
            } else if (item.endsWith('.js')) {
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
 * assignmentsフォルダのファイル一覧を提供するViteプラグイン
 * @returns {Object} Viteプラグインオブジェクト
 */
export function assignmentsPlugin() {
    return {
        name: 'assignments-plugin',
        configureServer(server) {
            server.middlewares.use('/api/assignments', (req, res, next) => {
                if (req.method === 'GET') {
                    try {
                        const assignmentsDir = path.join(process.cwd(), 'src', 'assignments');
                        
                        const files = getJSFilesRecursively(assignmentsDir)
                            .sort((a, b) => {
                                if (a.directory !== b.directory) {
                                    return a.directory.localeCompare(b.directory);
                                }
                                return sortAssignmentFiles(a.name, b.name);
                            });
                        
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify(files));
                    } catch (error) {
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
