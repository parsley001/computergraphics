function setup() {
    createCanvas(400, 400);
    background(240);

    push();
        //座標軸の描画
        translate(200, 200);
        stroke(0);
        line(0,-200, 0,200); // x 軸(横軸)
        line(-200,0, 200,0); // y 軸(縦軸)

        //三角形の描画
        push();
            noStroke();
            fill(255, 0, 0);
            triangle(-140,50, 60,0, 60,100);
        pop();
    pop();
}

function draw() {
}