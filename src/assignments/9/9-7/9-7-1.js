let img = []; // 読み込む画像を保存する変数
function preload() {
    // 画像ファイルを読み込む
    for (let i = 0; i < 3; i++) {
        img[i] = loadImage(`src/assignments/9/9-7/meisai${i+1}.png`);
    }

}
function setup() {
    createCanvas(400, 400, WEBGL);
    textureMode(NORMAL); // テクスチャ座標を 0~1 の正規化モードに設定
    angleMode(DEGREES);
    noStroke();
}
function draw() {
    background(200);
    orbitControl(); 

    let pos = [
        [-150,0,0,0,0,0],
        [0,0,0,0,0,0],
        [150,0,0,0,0,0],
    ];
    for (let i = 0; i < 3; i++) {
        push();
        {
            translate(...pos[i].slice(0,3));
            rotateX(pos[i][3]);
            rotateY(pos[i][4]);
            rotateZ(pos[i][5]);
            
            texture(img[i]);
            box(100);
            
        }
        pop();
    }
}
