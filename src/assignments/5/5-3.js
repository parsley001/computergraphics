let value = 0;
function setup() {
    createCanvas(300, 300);
}
function draw() {
    background(200);
    fill( value ); // 塗りつぶし色を設定
    rect(50, 50, 200);// 正方形を描画
}
// キャンバスをクリックしてキー押下の検出を開始
// ユーザーがキーを押したときに図形の色を切り替える
function keyPressed() {
    if (value === 0) {
        value = 255;
    } else {
        value = 0;
    }
}