// グローバル変数の定義
let angle = 0; // 回転角(度)

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
    
    noFill();
    stroke(255, 255, 0);
    strokeWeight(1.5);
    
    push();
    rotateY(angle); // Y 軸周りの回転
    drawAxis(); // 座標軸の描画
    box(150); // 立方体
    pop();
}


// 座標軸を描画する関数
function drawAxis() {
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
}