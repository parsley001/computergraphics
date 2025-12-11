// 3D→3D切り替えテスト用ファイル
function setup() {
    createCanvas(400, 400, WEBGL);
}

function draw() {
    background(50);
    orbitControl();
    
    // 赤い回転する球体
    push();
    rotateY(frameCount * 0.01);
    fill(255, 0, 0);
    noStroke();
    sphere(100);
    pop();
}
