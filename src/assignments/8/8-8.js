function setup() {
    createCanvas(600, 400, WEBGL);
    noStroke();

    angleMode(DEGREES);
}

let pos1 = [0, 0, 0];
let pos2 = [0, 0, 0];
let pos3 = [0, 0, 0];
let theta = 0, phi=0; r = 180;
function draw() {
    background(20);
    
    noLights();           // ライトの初期化
    
    ambientLight(80); //デフォルトの明るさ
    ambientMaterial(255, 255, 255); //白くなる
    
    
    theta++;
    phi++;
    pos1 = [r*sin(theta)*cos(phi), r*sin(theta)*sin(phi), r*cos(theta)];
    let theta2 = theta*2;
    let phi2 = phi*5;
    pos2 = [r*sin(theta2)*cos(phi2), r*sin(theta2)*sin(phi2), r*cos(theta2)];
    let theta3 = theta*3;
    let phi3 = phi*10;
    pos3 = [r*sin(theta3)*cos(phi3), r*sin(theta3)*sin(phi3), r*cos(theta3)];
    
    pointLight(255,0,0, ...pos1);
    push();
        translate(...pos1);
        emissiveMaterial(255, 0, 0);
        sphere(5);
    pop();
    
    pointLight(0,255,0, ...pos2);
    push();
        translate(...pos2);
        emissiveMaterial(0, 255, 0);
        sphere(5);
    pop();
    
    pointLight(0,0,255, ...pos3);
    push();
        translate(...pos3);
        emissiveMaterial(0, 0, 255);
        sphere(5);
    pop();

    sphere(120);

    
    
}