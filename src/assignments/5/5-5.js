// グローバル変数の定義
let angle = 0; // 回転角(度)
let offset = 0;


function setup() {
    createCanvas(500, 500, WEBGL);
    perspective();
    camera(800, 0, 0, 0, 0, 0, 0, -1, 0);

    angleMode(DEGREES); // 角度を度数法に変更
}


function draw() {
    background(50);
    orbitControl();
    
    // 回転角の更新
    angle += 1; // 1 フレームごとに 1 度加算
    if(angle>=360) angle=0; //360 度以上でリセット


    
    
    push();
        noFill();
        stroke("yellow");
        strokeWeight(1.5);
        rotateY(angle); // Y 軸周りの回転

        push();
            translate(0, 300, 0);
            cone(100, 200);
        pop();
        push();
            translate(0, 100, 0);
            cylinder(100, 200);
        pop();
        push();
            translate(0, -100+offset, 0);
            cylinder(100, 200);
        pop();
        drawwing();
        drawAxis(); // 座標軸の描画
    pop();
}
function drawwing() {
    push();
        for(let i = 0; i < 4; i++) {
            beginShape();
                vertex(100, -200+offset, 0);
                vertex(200, -200+offset, 0);
                vertex(100, 0+offset, 0);
            endShape(CLOSE);
            rotateY(90);
        }
    pop();
}
function keyPressed() {
    if (key == 'd') {
        offset--;
    }
}

// 座標軸を描画する関数
function drawAxis() {
    push();
        strokeWeight(2);
        // X 軸（赤）
        stroke(255, 0, 0);
        line(0, 0, 0, 200, 0, 0);
        // Y 軸（緑）
        stroke(0, 255, 0);
        line(0, 0, 0, 0, 200, 0);
        // Z 軸（青）
        stroke(0, 0, 255);
        line(0, 0, 0, 0, 0, 200);
    pop();
}