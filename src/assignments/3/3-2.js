function setup() {
    createCanvas(400, 400);
}

function draw() {
    background(240);

    push();
        translate(200, 200);
        stroke(0);
        line(0,-200, 0,200);
        line(-200,0, 200,0);

        push();
            translate(20, 15);
            rotate(-PI/4);

            noStroke();
            fill(255, 0, 0);
            triangle(0,0, 50,100, -50,100);
        pop();
    pop();
}