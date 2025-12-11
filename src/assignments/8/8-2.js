let mode = 0;  // 0?2で光源切り替え

function setup() {
    createCanvas(500, 400, WEBGL);
    noStroke();
    angleMode(DEGREES);
}

function draw() {
    background(220);

    // ワールド座標系の描画
    push();
        strokeWeight(2);
        stroke(255, 0, 0); line(0, 0, 0, 200, 0, 0);   // X軸（赤）
        stroke(0, 255, 0); line(0, 0, 0, 0, 200, 0);   // Y軸（緑）
        stroke(0, 0, 255); line(0, 0, 0, 0, 0, 200);   // Z軸（青）
    pop();

    // 立方体の姿勢変更
    rotateY(55);  rotateX(-30);

    // ----------------------------
    // 光源設定（modeによって変更）
    // ----------------------------

    // （0）光源なし
    if (mode === 0) {
        ambientLight(0, 100, 0);  
    }

    // （1）平行光源
    else if (mode === 1) {
        ambientLight(60);
        directionalLight(255, 255, 0, 1, 1, 1);
    }

    // （2）点光源（マウスで移動）
    else if (mode === 2) {
        ambientLight(60);

        // マウス座標をWEBGL空間へ変換（中心を0,0に）
        let lx = mouseX - width / 2;
        let ly = mouseY - height / 2;
        let lz = 200;   // 手前から照らす固定値

        pointLight(0, 0, 255, lx, ly, lz);
    }

    // 共通の物体（BOX）
    box(180);

}

function keyPressed() {
    if (key === '0') mode = 0;
    if (key === '1') mode = 1;
    if (key === '2') mode = 2;
}