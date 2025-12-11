function setup() {
    createCanvas(600, 400, WEBGL);
    camera(800, 300, 0, 0, 0, 0, 0, -1, 0);  
    angleMode(DEGREES);
    noStroke();
}

function draw() {
    background(30);

    // ワールド座標軸
    push();
        strokeWeight(2);
        stroke(255, 0, 0); line(0, 0, 0, 100, 0, 0);   // X軸（赤）
        stroke(0, 255, 0); line(0, 0, 0, 0, 100, 0);   // Y軸（緑）
        stroke(0, 0, 255); line(0, 0, 0, 0, 0, 100);   // Z軸（青）
    pop();

    // ほんのり全体を明るく
    ambientLight(40);

    // -----------------------------------
    // スポットライト位置（マウス操作）
    // -----------------------------------
    let lz = mouseX - width / 2;   // 左右方向（Z）
    let lx = mouseY - height / 2;  // 奥行方向（X）
    let ly = 200;                  // 上空（+Y 側）の高さ（固定）

    // スポットライト
    spotLight(
        255, 255, 255,  // 光の色
        lx,  ly,  lz,   // 光源位置
        0,  -1,  0,     // 照射の向き
        50,             // 照射角
        1               // 集中度
    );

    // 床
    push();
        rotateX(90);    //XZ平面が床になるように回転
        specularMaterial(200);
        plane(600, 600);      
    pop();
}