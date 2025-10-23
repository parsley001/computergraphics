function setup() {
    let canvassize = 600;
    createCanvas(canvassize, canvassize);
    background(255,255,255);
    
    let origin = canvassize / 2;
    let pi = Math.PI;

    beginShape(LINES);
        stroke(0, 0, 0);
        strokeWeight(1);
        vertex(origin, 0);
        vertex(origin, canvassize);
        vertex(0, origin);
        vertex(canvassize, origin);
    endShape(CLOSE);

    let drowrethio = 80;

    //sin
    stroke(255, 0, 0);
    strokeWeight(2);
    noFill();
    beginShape();
        for(let theta = -pi; theta < pi; theta += 0.001) {
            point(origin+theta*drowrethio, origin+Math.sin(theta)*drowrethio);
        }
    endShape();

    //cos
    stroke(0, 255, 0);
    strokeWeight(2);
    noFill();
    beginShape();
        for(let theta = -pi; theta < pi; theta += 0.001) {
            point(origin+theta*drowrethio, origin+Math.cos(theta)*drowrethio);
        }
    endShape();

    //tan
    stroke(0, 0, 255);
    strokeWeight(2);
    noFill();
    let offset = 0.3;
    beginShape();
        for(let theta = -pi/2; theta < pi/2; theta += 0.001) {
            point(origin+(theta+offset)*drowrethio, origin+Math.tan(theta+offset)*drowrethio);
        }
    endShape();
}

function draw() {

}