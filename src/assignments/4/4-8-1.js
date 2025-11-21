function setup() {
    createCanvas(500, 500, WEBGL); // WEBGL モードで 3D 描画を有効化
    perspective(); // 透視投影:遠近感をつける
    camera(800, 0, 0, 0, 0, 0, 0, -1, 0); // カメラの設定
}

function draw() {
    background(0);
    orbitControl(); //マウスで視点操作

    // ワールド座標系を描画
    push();
    strokeWeight(2);
    stroke(255, 0, 0);
    line(0, 0, 0, 200, 0, 0); // X 軸
    stroke(0, 255, 0);
    line(0, 0, 0, 0, 200, 0); // Y 軸
    stroke(0, 0, 255);
    line(0, 0, 0, 0, 0, 200); // Z 軸
    pop();

    stroke(0, 0, 0);
    strokeWeight(2);
    
    const offset = 100;
    const boxsize = 50;
    push();
        fill(255, 0, 0);
        box(boxsize);
    pop();
    push();
        translate(offset, 0, 0);
        fill(0, 255, 0);
        box(boxsize);
    pop();
    push();
        translate(0, offset, 0);
        fill(255, 255, 0);
        box(boxsize);
    pop();
    push();
        translate(0, 0, offset);
        fill(0, 0, 255);
        box(boxsize);
    pop();
}
