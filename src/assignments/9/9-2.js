let img; // 読み込む画像を保存する変数
function preload() {
    // 画像ファイルを読み込む
    img = loadImage("./src/assignments/9/texture.png");
}
function setup() {
    createCanvas(400, 400, WEBGL);
}
function draw() {
    push(); // 左側: IMAGE モード
    {
        translate(-80, 0, 0);
        textureMode(IMAGE);
        texture(img);
        beginShape();
        {
            vertex(-50, -50, 0, 0, 0); // 左上
            vertex(50, -50, 0, 200, 0); // 右上
            vertex(50, 50, 0, 200, 200); // 右下
            vertex(-50, 50, 0, 0, 200); // 左下
        }
        endShape(CLOSE);
    }
    pop();
    push(); // 右側: NORMAL モード
    {
        translate(80, 0, 0);
        textureMode(NORMAL);
        texture(img);
        beginShape();
        {
            vertex(-50, -50, 0, 0, 0); // 左上
            vertex(50, -50, 0, 1, 0); // 右上
            vertex(50, 50, 0, 1, 1); // 右下
            vertex(-50, 50, 0, 0, 1); // 左下
        }
        endShape(CLOSE);
    }
    pop();
}
