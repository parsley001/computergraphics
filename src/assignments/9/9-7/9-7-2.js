let img = []; // 読み込む画像を保存する変数
function preload() {
    // 画像ファイルを読み込む

    img.push(loadImage(`src/assignments/9/9-7/tsuchi.png`));
    img.push(loadImage(`src/assignments/9/9-7/wind.png`));
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

    push();
    {
        rotateX(90);
        texture(img[0]);
        plane(400);
    }
    pop();

    let pos = [[0, -50, 0, 0, 0, 0]];
    for (let i = 0; i < 1; i++) {
        push();
        {
            translate(...pos[i].slice(0, 3));
            rotateX(pos[i][3]);
            rotateY(pos[i][4]);
            rotateZ(pos[i][5]);

            texture(img[1]);
            box(100);
        }
        pop();
    }
}
