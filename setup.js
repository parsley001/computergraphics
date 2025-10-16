#!/usr/bin/env node

/**
 * p5.js Assignment Viewer セットアップスクリプト
 * 
 * このスクリプトは以下の処理を自動化します：
 * 1. publicディレクトリの作成
 * 2. p5.jsライブラリファイルのコピー
 * 3. 開発環境の準備
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 p5.js Assignment Viewer セットアップを開始します...\n');

// publicディレクトリを作成
const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
  console.log('✅ publicディレクトリを作成しました');
} else {
  console.log('📁 publicディレクトリは既に存在します');
}

// p5.jsファイルをコピー
const p5SourceDir = path.join(__dirname, 'node_modules', 'p5', 'lib');
const p5Files = ['p5.js', 'p5.min.js'];

let copiedFiles = 0;

p5Files.forEach(fileName => {
  const sourcePath = path.join(p5SourceDir, fileName);
  const destPath = path.join(publicDir, fileName);
  
  if (fs.existsSync(sourcePath)) {
    try {
      fs.copyFileSync(sourcePath, destPath);
      console.log(`✅ ${fileName} をコピーしました`);
      copiedFiles++;
    } catch (error) {
      console.error(`❌ ${fileName} のコピーに失敗しました:`, error.message);
    }
  } else {
    console.error(`❌ ${fileName} が見つかりません: ${sourcePath}`);
  }
});

// セットアップ完了メッセージ
console.log('\n🎉 セットアップが完了しました！\n');

if (copiedFiles > 0) {
  console.log('次のコマンドで開発サーバーを起動してください：');
  console.log('  npm run dev\n');
  console.log('ブラウザで http://localhost:3000 にアクセスしてください。');
} else {
  console.log('⚠️  p5.jsファイルのコピーに失敗しました。');
  console.log('以下のコマンドを手動で実行してください：');
  console.log('  cp node_modules/p5/lib/p5.min.js public/');
  console.log('  cp node_modules/p5/lib/p5.js public/');
}
