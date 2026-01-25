let img = []; // 読み込む画像を保存する変数
function preload() {
    // 画像ファイルを読み込む
    img.push(loadImage(`src/assignments/9/9-7/hoshizora.png`));
    img.push(loadImage(`src/assignments/9/9-7/earth_trim.png`));
    img.push(loadImage(`src/assignments/9/9-7/moon_trim.png`));

}
function setup() {
    createCanvas(400, 400, WEBGL);
    textureMode(NORMAL); // テクスチャ座標を 0~1 の正規化モードに設定
    angleMode(DEGREES);
    noStroke();

    // 画像を横に2つ並べる
    for (let i = 1; i < 3; i++) {
        let tmp = createGraphics(img[i].width * 2, img[i].height);
        tmp.image(img[i], 0, 0);
        tmp.image(img[i], img[i].width, 0);
        img[i] = tmp;
    }
}

let angle = 0;
function draw() {
    background(200);
    orbitControl(); 


    let pos = [
        [0,0,0,0,0,0,1000],
        [0,0,0,0,angle,0,100],
        [200,0,0,0,-angle/2,0,30],
    ];
    
    for (let i = 0; i < 3; i++) {
        push();
        {
            rotateX(pos[i][3]);
            rotateY(pos[i][4]);
            rotateZ(pos[i][5]);
            translate(...pos[i].slice(0,3));
            
            texture(img[i]);
            sphere(pos[i][6], 128,128);
            
        }
        pop();
    }

    angle += 3;
}
