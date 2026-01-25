let img = []; // 読み込む画像を保存する変数
function preload() {
    // 画像ファイルを読み込む
    img.push(loadImage(`src/assignments/9/9-7/gun.png`));
    img.push(loadImage(`src/assignments/9/9-7/bullet.png`));
    img.push(loadImage(`src/assignments/9/9-7/target.png`));

}
function setup() {
    createCanvas(500, 500, WEBGL);
    textureMode(NORMAL); // テクスチャ座標を 0~1 の正規化モードに設定
    angleMode(DEGREES);
    noStroke();
}

let state = 1;
let bulletpos = -140;
let gunangle = 0;
let count = 0;
function draw() {
    background(200);
    orbitControl(); 


    let pos = [
        [-200,15,0,0,180,gunangle,1000],
        [bulletpos,0,0,0,180,90,100],
        [200,0,0,0,90,0,100],
    ];
    
    for (let i = 0; i < 3; i++) {
        push();
        {
            translate(...pos[i].slice(0,3));
            rotateX(pos[i][3]);
            rotateY(pos[i][4]);
            rotateZ(pos[i][5]);
            
            texture(img[i]);
            if(i==1){
                cone(10,50);
            }else{
                plane(100);
            }
            
        }
        pop();
    }

    bulletpos += 10;
    if(bulletpos > pos[2][0]+500){
        bulletpos = pos[0][0]+60;
        state = 1;
    }

    if(state==1){
        gunangle+=8;
        if(gunangle>=30){
            state = 2;
        }
    }else if(state==2){
        gunangle-=2;
        if(gunangle<=0){
            state = 3;
        }
    }
}
