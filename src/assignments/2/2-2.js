function setup() {
    createCanvas(600, 600);
    background(255, 255, 255);
    fill(0, 0, 0);
    for (let i = 0; i < 3; i++) {
        for(let j = 0; j < 3; j++) {
            circle(100+i*60, 100+j*60, 10);
        }
    }
}

function draw() {

}