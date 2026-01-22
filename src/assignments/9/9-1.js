let img; // 読み込む画像を保存する変数
function preload() {
    // 画像ファイルを読み込む
    img = loadImage("./src/assignments/9/texture.png");
}
function setup() {
    createCanvas(400, 400, WEBGL);
    textureMode(NORMAL); // テクスチャ座標を 0~1 の正規化モードに設定
}
function draw() {
    background(200);
    rotateY(frameCount * 0.02); // Y 軸周りに回転
    texture(img); // テクスチャを設定
    plane(200); // 平面の描画(画像貼付)
}
