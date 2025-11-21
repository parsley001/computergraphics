function setup() {
    createCanvas(500, 500, WEBGL); // WEBGL モードで 3D 描画を有効化
    perspective(); // 透視投影:遠近感をつける
    camera(800, 0, 0, 0, 0, 0, 0, -1, 0); // カメラの設定
}
function draw() {
    initialsetting();
    drawmeridianLines(100);
    drawparallelLines(100);
}

function initialsetting(){
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
}

function drawmeridianLines(r, seg=18){
    push();
        noFill();
        stroke("yellow");
        for(let i=0; i<seg; i++){
            beginShape();
                for (let j = 0; j < seg; j++) {
                    const theta = 2*PI * j / seg; // 角度計算
                    const x = r * cos(theta); // x 座標
                    const y = r * sin(theta); // y 座標
                    vertex(x, y, 0);
                }
            endShape(CLOSE);
            rotateY(2*PI / seg)
        }
    pop();
}

function drawparallelLines(r, seg=18) { // 引数 r は円の半径
    push();
        noFill();
        stroke("yellow");
        for(let i=-seg; i<seg; i++){
            const y = r*2 * i/ seg;
            const newr = sqrt(r*r - y*y);
            beginShape();
                for (let j = 0; j < seg; j++) {
                    const theta = 2*PI * j / seg; // 角度計算
                    const x = newr * cos(theta); // x 座標
                    const z = newr * sin(theta); // z 座標
                    vertex(x, y, z);
                }
            endShape(CLOSE);
        }
    pop();
}