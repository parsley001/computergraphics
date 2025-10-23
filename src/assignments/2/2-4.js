function setup() {
    createCanvas(600, 600);
    background(255,255,255);

    beginShape();
        let offset = 300;
        let r = 50;
        let pi = Math.PI;
        for(let theta = 0; theta < 2*pi; theta += 0.01) {
            let x = r * Math.cos(theta);
            let y = r * Math.sin(theta);
            point(offset + x, offset + y);
        }
    endShape(CLOSE);


}

function draw() {

}