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

    push();
        const fieldsize = 1000
        noStroke();
        fill(0, 128, 0);
        beginShape();
            vertex(-fieldsize/2, 0, -fieldsize/2);
            vertex(fieldsize/2, 0, -fieldsize/2);
            vertex(fieldsize/2, 0, fieldsize/2);
            vertex(-fieldsize/2, 0, fieldsize/2);
        endShape(CLOSE);
    pop();

    push();
        const cylinderoffset = 50;
        const cylinderheight = 300;
        translate(cylinderoffset, cylinderheight/2, cylinderoffset);
        noStroke();
        fill(128, 128, 128);
        cylinder(10,300);
    pop();

    push();
        const roofheight = 200;
        const househeight = roofheight + 100;
        const housewidth = 300;
        push();
            fill(128, 128, 0);
            stroke(0, 0, 0);
            strokeWeight(2);
            translate(0, roofheight/2, 0);
            box(200, roofheight, 200);
        pop()

        push();
            fill(128, 0, 0);
            stroke(0, 0, 0);
            strokeWeight(2);
            beginShape(TRIANGLE_FAN);
                vertex(0, househeight, 0);
                vertex(housewidth/2, roofheight, housewidth/2);
                vertex(housewidth/2, roofheight, -housewidth/2);
                vertex(-housewidth/2, roofheight, -housewidth/2);
                vertex(-housewidth/2, roofheight, housewidth/2);
                vertex(housewidth/2, roofheight, housewidth/2);
            endShape(CLOSE);
    
        pop();
    pop();
}
