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
    // ローカル座標系で立方体を描画
    push();
        noFill();
        stroke("yellow");
        beginShape(QUAD_STRIP);
            vertex(0.0, 0.0, 0.0); // p0
            vertex(0.0, 100.0, 0.0); // p1
            vertex(100.0, 0.0, 0.0); // p2
            vertex(100.0, 100.0, 0.0); // p3
            vertex(100.0, 0.0, 100.0); // p4
            vertex(100.0, 100.0, 100.0); // p5
            vertex(0.0, 0.0, 100.0); // p6
            vertex(0.0, 100.0, 100.0); // p7
            vertex(0.0, 0.0, 0.0); // p0
            vertex(0.0, 100.0, 0.0); // p1
        endShape();
    pop();
}
