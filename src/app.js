/**
 * p5.js Assignment Viewer
 * シンプルな課題ファイル表示システム
 * 
 * ファイル切り替え時はページリロードを行い、
 * WebGLコンテキストとグローバル状態を完全にリセットします。
 */

// 定数
const SELECTORS = {
  FILE_SELECTOR: 'fileSelector',
  ERROR_MESSAGE: 'error-message'
};

const API_ENDPOINTS = {
  ASSIGNMENTS: '/api/assignments'
};

// DOM要素取得
const DOM = {
  getFileSelector: () => document.getElementById(SELECTORS.FILE_SELECTOR),
  getErrorMessage: () => document.getElementById(SELECTORS.ERROR_MESSAGE)
};

// URL操作
const URLUtils = {
  getSelectedFile: () => new URLSearchParams(window.location.search).get('file'),
  
  buildURL: (fileName) => {
    const url = new URL(window.location.origin + window.location.pathname);
    if (fileName) {
      url.searchParams.set('file', fileName);
    }
    return url.toString();
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
        groups[directory].forEach(file => {
          DropdownManager.addOption(file.path, file.name);
        });
      } else {
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
      // p5.jsが自動初期化しない場合があるため、明示的に初期化
      // setup関数が定義されていてcanvasがない場合に初期化する
      setTimeout(() => {
        if (typeof window.setup === 'function' && !document.querySelector('canvas')) {
          new p5();
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
      this.navigateToFile(e.target.value);
    });
  }
  
  navigateToFile(filePath) {
    // ファイル切り替え時はページをリロードして確実に初期化
    // これによりWebGLコンテキストやグローバル状態が完全にリセットされる
    const newURL = URLUtils.buildURL(filePath);
    window.location.href = newURL;
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
