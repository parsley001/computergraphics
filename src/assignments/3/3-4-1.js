function setup() {
    createCanvas(400, 400);
}

function draw() {
    background(240);
    push();
        //座標軸の描画
        translate(200, 200);
        stroke(0);
        line(0,-200, 0,200); // x 軸
        line(-200,0, 200,0); // y 軸

        //変換後の四角形
        push();
            scale(2);
            noStroke();
            fill(255, 0, 0);
            rect( 0, 0, 100, 100 );
        pop();

        //変換前の四角形
        push();
            stroke(0);
            noFill();
            rect( 0, 0, 100, 100 );
        pop();
    pop();
}