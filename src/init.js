/**
 * p5.js Assignment Viewer 初期化モジュール
 * p5.jsの読み込みとアプリケーション初期化を管理
 */

/**
 * p5.jsライブラリを読み込む
 * @returns {Promise} 読み込み完了時に解決するPromise
 */
function loadP5() {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = '/p5.min.js';
        
        script.onload = () => {
            // p5.jsの読み込み完了
            // 注意: new p5() は呼び出さない
            // グローバルモードでは、setup/draw関数が定義された後に自動的に初期化される
            resolve();
        };
        
        script.onerror = () => reject(new Error('p5.js読み込み失敗'));
        document.head.appendChild(script);
    });
}

/**
 * アプリケーションスクリプトを読み込む
 * @returns {Promise} 読み込み完了時に解決するPromise
 */
function loadApp() {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = '/src/app.js';
        script.onload = resolve;
        script.onerror = () => reject(new Error('app.js読み込み失敗'));
        document.head.appendChild(script);
    });
}

/**
 * エラーメッセージを表示する
 * @param {string} message - 表示するエラーメッセージ
 */
function showError(message) {
    const errorDiv = document.getElementById('error-message');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
    }
}

/**
 * アプリケーション初期化
 */
async function init() {
    try {
        await loadP5();
        await loadApp();
    } catch (error) {
        console.error('初期化エラー:', error);
        showError('初期化に失敗しました。ページを再読み込みしてください。');
    }
}

// 初期化実行
init();
