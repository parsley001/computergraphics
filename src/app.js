/**
 * p5.js Assignment Viewer - メインアプリケーションファイル
 * assignmentsフォルダ内のp5.jsファイルを動的に読み込んで表示するWebアプリケーション
 */

// 定数定義
const SELECTORS = {
  FILE_SELECTOR: 'fileSelector',
  ERROR_MESSAGE: 'error-message'
};

const ATTRIBUTES = {
  DYNAMIC_SCRIPT: 'data-dynamic'
};

const API_ENDPOINTS = {
  ASSIGNMENTS: '/api/assignments'
};

const URL_PARAMS = {
  FILE: 'file'
};

/**
 * DOM要素取得のヘルパー関数
 */
const DOM = {
  getFileSelector: () => document.getElementById(SELECTORS.FILE_SELECTOR),
  getErrorMessage: () => document.getElementById(SELECTORS.ERROR_MESSAGE),
  getCanvas: () => document.querySelector('canvas'),
  getDynamicScript: () => document.querySelector(`script[${ATTRIBUTES.DYNAMIC_SCRIPT}]`)
};

/**
 * URLパラメータ操作のユーティリティ
 */
const URLUtils = {
  getSelectedFile: () => new URLSearchParams(window.location.search).get(URL_PARAMS.FILE),
  
  setSelectedFile: (fileName) => {
    const url = new URL(window.location);
    url.searchParams.set(URL_PARAMS.FILE, fileName);
    window.location.href = url.toString();
  },
  
  clearSelectedFile: () => {
    const url = new URL(window.location);
    url.searchParams.delete(URL_PARAMS.FILE);
    window.location.href = url.toString();
  },
  
  updateURLQuiet: (fileName) => {
    const url = new URL(window.location);
    url.searchParams.set(URL_PARAMS.FILE, fileName);
    window.history.replaceState({}, '', url.toString());
  },
  
  clearSelectedFileQuiet: () => {
    const url = new URL(window.location);
    url.searchParams.delete(URL_PARAMS.FILE);
    window.history.replaceState({}, '', url.toString());
  }
};

/**
 * エラーメッセージ管理
 */
const ErrorManager = {
  show: (message) => {
    const errorDiv = DOM.getErrorMessage();
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
  },
  
  hide: () => {
    const errorDiv = DOM.getErrorMessage();
    errorDiv.style.display = 'none';
  }
};

/**
 * コンテンツクリーンアップ
 */
const ContentCleaner = {
  clearAll: () => {
    ContentCleaner.clearCanvas();
    ContentCleaner.clearDynamicScript();
    ContentCleaner.clearP5Globals();
    ErrorManager.hide();
  },
  
  clearCanvas: () => {
    const canvas = DOM.getCanvas();
    if (canvas) canvas.remove();
  },
  
  clearDynamicScript: () => {
    const script = DOM.getDynamicScript();
    if (script) script.remove();
  },
  
  clearP5Globals: () => {
    // p5.jsのグローバル関数をクリア
    if (typeof window.setup === 'function') {
      window.setup = undefined;
    }
    if (typeof window.draw === 'function') {
      window.draw = undefined;
    }
    if (typeof window.preload === 'function') {
      window.preload = undefined;
    }
  }
};

/**
 * ドロップダウン管理
 */
const DropdownManager = {
  clearOptions: () => {
    const selector = DOM.getFileSelector();
    while (selector.children.length > 1) {
      selector.removeChild(selector.lastChild);
    }
  },
  
  addOption: (fileName) => {
    const selector = DOM.getFileSelector();
    const option = document.createElement('option');
    option.value = fileName;
    option.textContent = fileName;
    selector.appendChild(option);
  },
  
  setSelectedValue: (fileName) => {
    const selector = DOM.getFileSelector();
    selector.value = fileName;
  },
  
  clearSelection: () => {
    const selector = DOM.getFileSelector();
    selector.value = '';
  }
};

/**
 * ファイルリスト管理
 */
const FileListManager = {
  async load() {
    try {
      const response = await fetch(API_ENDPOINTS.ASSIGNMENTS);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.map(item => item.name);
    } catch (error) {
      console.error('ファイルリストの読み込みに失敗しました:', error);
      ErrorManager.show('Vite開発サーバーが起動していない可能性があります。npm run dev を実行してください。');
      return [];
    }
  },
  
  populateDropdown(files) {
    DropdownManager.clearOptions();
    files.forEach(fileName => DropdownManager.addOption(fileName));
  },
  
  handleSelectedFile(files) {
    const selectedFile = URLUtils.getSelectedFile();
    
    if (!selectedFile) return;
    
    if (files.includes(selectedFile)) {
      DropdownManager.setSelectedValue(selectedFile);
    } else {
      console.warn('指定されたファイルが存在しません:', selectedFile);
      URLUtils.clearSelectedFileQuiet();
      ErrorManager.show(`ファイル "${selectedFile}" は削除されたか、存在しません。`);
    }
  }
};

/**
 * スクリプトローダー
 */
const ScriptLoader = {
  load(fileName) {
    const script = document.createElement('script');
    script.src = `src/assignments/${fileName}`;
    script.setAttribute(ATTRIBUTES.DYNAMIC_SCRIPT, 'true');
    
    script.onerror = () => ScriptLoader.handleError(fileName);
    script.onload = () => {
      ErrorManager.hide();
      // p5.jsの初期化を確実にするため、少し遅延させてsetup()を呼び出し
      setTimeout(() => {
        if (typeof window.setup === 'function') {
          try {
            window.setup();
          } catch (error) {
            console.warn('setup()の実行中にエラーが発生しました:', error);
          }
        }
      }, 50);
    };
    
    document.body.appendChild(script);
  },
  
  handleError(fileName) {
    console.error('ファイルの読み込みに失敗しました:', fileName);
    ErrorManager.show(`エラー: ${fileName} を読み込めませんでした。ファイルが削除されたか、存在しない可能性があります。`);
    URLUtils.clearSelectedFileQuiet();
    DropdownManager.clearSelection();
  }
};

/**
 * メインアプリケーションクラス
 */
class AssignmentViewer {
  async initialize() {
    await this.loadFileList();
    this.setupEventListeners();
    this.loadSelectedFile();
  }
  
  async loadFileList() {
    const files = await FileListManager.load();
    FileListManager.populateDropdown(files);
    
    if (files.length > 0) {
      FileListManager.handleSelectedFile(files);
    }
  }
  
  setupEventListeners() {
    const selector = DOM.getFileSelector();
    selector.addEventListener('change', (e) => this.handleFileSelection(e.target.value));
  }
  
  handleFileSelection(fileName) {
    ContentCleaner.clearAll();
    
    if (fileName) {
      // ページ再読み込みではなく、その場でスクリプトを読み込み
      URLUtils.updateURLQuiet(fileName);
      ScriptLoader.load(fileName);
    } else {
      // ファイルが選択されていない場合はURLパラメータを削除
      URLUtils.clearSelectedFileQuiet();
    }
  }
  
  loadSelectedFile() {
    const selectedFile = URLUtils.getSelectedFile();
    if (selectedFile) {
      ScriptLoader.load(selectedFile);
    }
  }
}

// アプリケーション初期化
document.addEventListener('DOMContentLoaded', () => {
  const app = new AssignmentViewer();
  app.initialize();
});
