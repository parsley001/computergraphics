// グローバル変数の定義
let scaleVal = 1.0; //スケール係数
let angley = 0;
let anglez = 0;
function setup() {
createCanvas(500, 500, WEBGL);
perspective();
camera(800, 400, 700, 0, 0, 0, 0, -1, 0);
angleMode(DEGREES); // 角度を度数法に変更
}
function draw() {
    background(50);
    if (keyIsPressed == true) { // キーが押されたときの処理
        if (key == 'z') {
            scaleVal += 0.01;
        } else if (key == 'x') {
            scaleVal -= 0.01;
        }else if (keyCode == 38) {
            angley += 1;
        }else if (keyCode == 40) {
            angley -= 1;
        }else if (keyCode == 37) {
            anglez += 1;
        }else if (keyCode == 39) {
            anglez -= 1;
        }
    }
    noFill();
    stroke(255, 255, 0);
    strokeWeight(1.5);

    push();
        scale(scaleVal);
        rotateY(angley);
        rotateZ(anglez);
        box(150); // 立方体の描画
    pop();
}
function keyPressed() { // リセット(R キーもしくはエンターキー)
    if (key == 'r' || keyCode == ENTER) {
        scaleVal = 1.0;
    }
}