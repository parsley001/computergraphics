function setup() {
    createCanvas(400, 400);
}

function draw() {
    background(240);

    push();
        translate(200, 150);
        rotate(-PI/4);

        noStroke();
        fill(255, 0, 0);
        triangle(0,0, 50,100, -50,100);
    pop();
}