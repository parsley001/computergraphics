let img = []; // 読み込む画像を保存する変数
function preload() {
    // 画像ファイルを読み込む
    for (let i = 0; i < 6; i++) {
        img[i] = loadImage(`./src/assignments/9/9-6/dice/${i+1}.png`);
    }

}
function setup() {
    createCanvas(400, 400, WEBGL);
    textureMode(NORMAL); // テクスチャ座標を 0~1 の正規化モードに設定
    angleMode(DEGREES) 
}
function draw() {
    background(200);
    orbitControl(); 

    rotateX(frameCount*0.5); // X 軸周りに回転
    rotateY(frameCount); // Y 軸周りに回転

    let pos = [
        [0,0,50,0,0,0],
        [50,0,0,0,90,0],
        [0,-50,0,90,0,0],
        [0,50,0,90,0,0],
        [-50,0,0,0,90,0],
        [0,0,-50,0,0,0],
    ];
    for (let i = 0; i < 6; i++) {
        push();
        {
            translate(...pos[i].slice(0,3));
            rotateX(pos[i][3]);
            rotateY(pos[i][4]);
            rotateZ(pos[i][5]);
            
            texture(img[i]);
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
}
