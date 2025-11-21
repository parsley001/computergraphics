// グローバル変数の定義
let angle = 0; // 回転角(度)
let red,green,blue;

function setup() {
    createCanvas(500, 500, WEBGL);
    perspective();
    camera(800, 0, 0, 0, 0, 0, 0, -1, 0);

    angleMode(DEGREES); // 角度を度数法に変更
    
    red = 0;
    green = 0;
    blue = 255;
}


function draw() {
    background(50);
    orbitControl();
    
    // 回転角の更新
    angle += 1; // 1 フレームごとに 1 度加算
    if(angle>=360) angle=0; //360 度以上でリセット


    
    
    push();
        noFill();
        stroke(red, green, blue);
        strokeWeight(1.5);
        rotateY(angle); // Y 軸周りの回転
        rotateZ(angle); // Z 軸周りの回転
        box(150); // 立方体
        drawAxis(); // 座標軸の描画
    pop();
}

function keyPressed() {
    console.log("Key pressed:", key, "KeyCode:", keyCode); // デバッグ用
    
    if (key == 'r') {
        red = 255;
        green = 0;
        blue = 0;
        console.log("Red selected");
    } else if (key == 'g') {
        red = 0;
        green = 255;
        blue = 0;
        console.log("Green selected");
    } else if (key == 'b') {
        red = 0;
        green = 0;
        blue = 255;
        console.log("Blue selected");
    } else if (keyCode == 13) {
        red = random(255);
        green = random(255);
        blue = random(255);
        console.log("Random color:", red, green, blue);
    }
    return false;
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