let mode = 1;

function setup() {
    createCanvas(600, 400, WEBGL);
    noStroke();
}

function draw() {
    background(20);
    
    noLights();           // ライトの初期化
    shininess(1);         // 初期値に戻す
    specularMaterial(0);  // 初期値に戻す

    // --- 環境光のみ ---  
    if (mode == 1) {
        ambientLight(80);
        ambientMaterial(0, 100, 255);
    }
    // --- 拡散反射を近似 ---  
    if (mode == 2) {
        ambientLight(80);
        directionalLight(255, 255, 255, -1, -1, -1);
        ambientMaterial(0, 100, 255);
    }
    // --- 鏡面反射を近似 ---  
    if (mode == 3) {
        ambientLight(80);
        directionalLight(255, 255, 255, -1, -1, -1);
        specularMaterial(0, 100, 255);
        shininess(200);
    }
    sphere(120);
}

function keyPressed() {
    if (key === '1') mode = 1;
    if (key === '2') mode = 2;
    if (key === '3') mode = 3;
}