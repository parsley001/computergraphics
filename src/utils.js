/**
 * Assignment Files Utility Functions
 * p5.js課題ファイル管理用のユーティリティ関数集
 */

/**
 * 課題ファイル名をソートするユーティリティ関数
 * 
 * 数字パターン（例：2-1.js, 2-2.js, 10-1.js）を数値として正しくソートし、
 * その他のファイルはアルファベット順にソートします。
 * 
 * 例:
 * - 2-1.js < 2-2.js < 2-10.js < 10-1.js
 * - assignment.js < test.js < utils.js
 * 
 * @param {string} a - 比較するファイル名A
 * @param {string} b - 比較するファイル名B
 * @returns {number} ソート順序（-1: a < b, 0: a = b, 1: a > b）
 */
function sortAssignmentFiles(a, b) {
    // 数字パターン（章-節.js）の正規表現マッチ
    const aMatch = a.match(/(\d+)-(\d+)\.js/);
    const bMatch = b.match(/(\d+)-(\d+)\.js/);
    
    // 両方が数字パターンの場合は数値比較
    if (aMatch && bMatch) {
        const aChapter = parseInt(aMatch[1], 10);
        const aSection = parseInt(aMatch[2], 10);
        const bChapter = parseInt(bMatch[1], 10);
        const bSection = parseInt(bMatch[2], 10);
        
        // 章番号が異なる場合は章番号で比較
        if (aChapter !== bChapter) {
            return aChapter - bChapter;
        }
        
        // 章番号が同じ場合は節番号で比較
        return aSection - bSection;
    }
    
    // 数字パターンでない場合はアルファベット順
    return a.localeCompare(b);
}

// ES Modules環境での export
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = { sortAssignmentFiles };
} else if (typeof exports !== 'undefined') {
    exports.sortAssignmentFiles = sortAssignmentFiles;
}

// ブラウザ環境でのグローバル関数として公開
if (typeof window !== 'undefined') {
    window.sortAssignmentFiles = sortAssignmentFiles;
}
