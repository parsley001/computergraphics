function setup() {
    createCanvas(600, 400, WEBGL);
    noStroke();

    angleMode(DEGREES);
}

let pos = [0, 0, 0];
let theta = 0, phi=0; r = 180;
function draw() {
    background(20);
    
    noLights();           // ライトの初期化
    
    ambientLight(80); //デフォルトの明るさ
    ambientMaterial(0, 100, 255); //青くなる
    
    
    theta++;
    phi++;
    pos = [r*sin(theta)*cos(phi), r*sin(theta)*sin(phi), r*cos(theta)];
    
    pointLight(255,255,255, ...pos);
    sphere(120);
    
    push();
        translate(...pos);
        emissiveMaterial(255);
        sphere(5);
    pop();

    
    
}