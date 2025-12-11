/**
 * p5.js Assignment Viewer
 * シンプルな課題ファイル表示システム
 */

// 定数
const SELECTORS = {
  FILE_SELECTOR: 'fileSelector',
  ERROR_MESSAGE: 'error-message'
};

const API_ENDPOINTS = {
  ASSIGNMENTS: '/api/assignments'
};

// p5.jsインスタンス管理
let currentP5Instance = null;

// DOM要素取得
const DOM = {
  getFileSelector: () => document.getElementById(SELECTORS.FILE_SELECTOR),
  getErrorMessage: () => document.getElementById(SELECTORS.ERROR_MESSAGE),
  getAllCanvases: () => document.querySelectorAll('canvas'),
  getDynamicScript: () => document.querySelector('script[data-dynamic]')
};

// URL操作
const URLUtils = {
  getSelectedFile: () => new URLSearchParams(window.location.search).get('file'),
  
  updateURL: (fileName) => {
    const url = new URL(window.location);
    if (fileName) {
      url.searchParams.set('file', fileName);
    } else {
      url.searchParams.delete('file');
    }
    window.history.replaceState({}, '', url.toString());
  }
};

// エラー表示
const ErrorManager = {
  show: (message) => {
    const errorDiv = DOM.getErrorMessage();
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
  },
  
  hide: () => {
    DOM.getErrorMessage().style.display = 'none';
  }
};

// コンテンツクリア
const ContentCleaner = {
  clearAll: () => {
    // p5.jsのループを停止（エラーを無視）
    try {
      if (typeof window.noLoop === 'function') {
        window.noLoop();
      }
    } catch (e) {
      console.warn('noLoop停止エラー:', e);
    }
    
    // p5インスタンスを適切に破棄
    if (currentP5Instance) {
      try {
        currentP5Instance.remove();
      } catch (e) {
        console.warn('p5インスタンス破棄エラー:', e);
      }
      currentP5Instance = null;
    }
    
    // 残っているcanvas要素をすべて削除
    // 注意: WebGL loseContextは呼び出さない（次のWebGL作成を妨げるため）
    DOM.getAllCanvases().forEach(canvas => {
      canvas.remove();
    });
    
    // スクリプト削除
    const script = DOM.getDynamicScript();
    if (script) script.remove();
    
    // p5.js関数クリア
    window.setup = undefined;
    window.draw = undefined;
    window.preload = undefined;
    window.mousePressed = undefined;
    window.mouseReleased = undefined;
    window.keyPressed = undefined;
    window.keyReleased = undefined;
    window.mouseDragged = undefined;
    window.mouseWheel = undefined;
    window.mouseMoved = undefined;
    window.mouseClicked = undefined;
    window.doubleClicked = undefined;
    window.windowResized = undefined;
    window.keyTyped = undefined;
    
    ErrorManager.hide();
  }
};

// ドロップダウン操作
const DropdownManager = {
  clearOptions: () => {
    const selector = DOM.getFileSelector();
    while (selector.children.length > 1) {
      selector.removeChild(selector.lastChild);
    }
  },
  
  addOption: (filePath, displayName) => {
    const selector = DOM.getFileSelector();
    const option = document.createElement('option');
    option.value = filePath;
    option.textContent = displayName || filePath;
    selector.appendChild(option);
  },
  
  setSelectedValue: (filePath) => {
    DOM.getFileSelector().value = filePath;
  }
};

// ファイル管理
const FileManager = {
  async loadFiles() {
    try {
      const response = await fetch(API_ENDPOINTS.ASSIGNMENTS);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('ファイル読み込み失敗:', error);
      ErrorManager.show('開発サーバーが起動していません。npm run dev を実行してください。');
      return [];
    }
  },
  
  populateDropdown(files) {
    DropdownManager.clearOptions();
    
    // ディレクトリ別にグループ化
    const groups = {};
    files.forEach(file => {
      const dir = file.directory;
      if (!groups[dir]) groups[dir] = [];
      groups[dir].push(file);
    });
    
    // ディレクトリ順に表示
    Object.keys(groups).sort().forEach(directory => {
      if (directory === 'root') {
        // ルートファイル
        groups[directory].forEach(file => {
          DropdownManager.addOption(file.path, file.name);
        });
      } else {
        // サブディレクトリ
        const optgroup = document.createElement('optgroup');
        optgroup.label = `📁 ${directory}`;
        DOM.getFileSelector().appendChild(optgroup);
        
        groups[directory].forEach(file => {
          const option = document.createElement('option');
          option.value = file.path;
          option.textContent = `  ${file.name}`;
          optgroup.appendChild(option);
        });
      }
    });
  },
  
  selectFileFromURL(files) {
    const selectedFile = URLUtils.getSelectedFile();
    if (!selectedFile) return;
    
    const fileExists = files.some(file => file.path === selectedFile);
    if (fileExists) {
      DropdownManager.setSelectedValue(selectedFile);
    } else {
      URLUtils.updateURL('');
      ErrorManager.show(`ファイル "${selectedFile}" が見つかりません。`);
    }
  }
};

// スクリプト読み込み
const ScriptLoader = {
  load(filePath) {
    const script = document.createElement('script');
    script.src = `/src/assignments/${filePath}`;
    script.setAttribute('data-dynamic', 'true');
    
    script.onload = () => {
      ErrorManager.hide();
      
      // スクリプト読み込み完了後、p5.jsインスタンスを作成
      setTimeout(() => {
        if (typeof window.setup === 'function') {
          try {
            // グローバル関数をキャプチャ
            const userSetup = window.setup;
            const userDraw = window.draw;
            const userPreload = window.preload;
            const userMousePressed = window.mousePressed;
            const userMouseReleased = window.mouseReleased;
            const userMouseDragged = window.mouseDragged;
            const userMouseMoved = window.mouseMoved;
            const userMouseClicked = window.mouseClicked;
            const userMouseWheel = window.mouseWheel;
            const userDoubleClicked = window.doubleClicked;
            const userKeyPressed = window.keyPressed;
            const userKeyReleased = window.keyReleased;
            const userKeyTyped = window.keyTyped;
            const userWindowResized = window.windowResized;
            
            // p5.jsインスタンスモードで作成
            currentP5Instance = new p5((p) => {
              // preload（必要な場合）
              if (userPreload) {
                p.preload = function() {
                  // グローバル関数をp5インスタンスのメソッドとして実行
                  userPreload.call(p);
                };
              }
              
              // setup
              p.setup = function() {
                userSetup.call(p);
              };
              
              // draw
              if (userDraw) {
                p.draw = function() {
                  userDraw.call(p);
                };
              }
              
              // マウスイベント
              if (userMousePressed) p.mousePressed = function() { userMousePressed.call(p); };
              if (userMouseReleased) p.mouseReleased = function() { userMouseReleased.call(p); };
              if (userMouseDragged) p.mouseDragged = function() { userMouseDragged.call(p); };
              if (userMouseMoved) p.mouseMoved = function() { userMouseMoved.call(p); };
              if (userMouseClicked) p.mouseClicked = function() { userMouseClicked.call(p); };
              if (userMouseWheel) p.mouseWheel = function(e) { userMouseWheel.call(p, e); };
              if (userDoubleClicked) p.doubleClicked = function() { userDoubleClicked.call(p); };
              
              // キーボードイベント
              if (userKeyPressed) p.keyPressed = function() { userKeyPressed.call(p); };
              if (userKeyReleased) p.keyReleased = function() { userKeyReleased.call(p); };
              if (userKeyTyped) p.keyTyped = function() { userKeyTyped.call(p); };
              
              // ウィンドウイベント
              if (userWindowResized) p.windowResized = function() { userWindowResized.call(p); };
            });
          } catch (error) {
            console.error('p5初期化エラー:', error);
            ErrorManager.show(`${filePath} の実行中にエラーが発生しました: ${error.message}`);
          }
        }
      }, 50);
    };
    
    script.onerror = () => {
      console.error('スクリプト読み込み失敗:', filePath);
      ErrorManager.show(`${filePath} の読み込みに失敗しました。`);
    };
    
    document.body.appendChild(script);
  }
};

// メインアプリケーション
class App {
  async init() {
    const files = await FileManager.loadFiles();
    FileManager.populateDropdown(files);
    
    if (files.length > 0) {
      FileManager.selectFileFromURL(files);
    }
    
    this.setupEvents();
    this.loadSelectedFile();
  }
  
  setupEvents() {
    DOM.getFileSelector().addEventListener('change', (e) => {
      this.selectFile(e.target.value);
    });
  }
  
  selectFile(filePath) {
    ContentCleaner.clearAll();
    URLUtils.updateURL(filePath);
    
    if (filePath) {
      ScriptLoader.load(filePath);
    }
  }
  
  loadSelectedFile() {
    const selectedFile = URLUtils.getSelectedFile();
    if (selectedFile) {
      ScriptLoader.load(selectedFile);
    }
  }
}

// 初期化
function init() {
  const app = new App();
  app.init();
}

// DOM準備完了時に実行
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
