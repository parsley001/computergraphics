function setup() {
    createCanvas(600, 400, WEBGL);
    camera(-1000, -500, -1000, 0, 0, 0, 0, 1, 0);
    noStroke();
}

// スポットライトの配列
let spotlights = [
    { r: 255, g: 0, b: 0, x: 0, y: 100, z: 0, c: 255 },       // 赤
    { r: 0, g: 255, b: 0, x: 150, y: 100, z: 0, c: 100 },     // 緑
    { r: 0, g: 0, b: 255, x: 0, y: 100, z: 150, c: 100 },     // 青
];
let selected = 0;

function draw() {
    background(80);
    orbitControl();
    ambientLight(20);

    // スポットライトを描画
    for (let i = 0; i < spotlights.length; i++) {
        let sl = spotlights[i];
        spotLight(
            sl.r, sl.g, sl.b,
            sl.x, -sl.y, sl.z,
            0, 1, 0
        );
        push();
            translate(sl.x, -sl.y, sl.z);
            ambientLight(sl.c);
            ambientMaterial(sl.r, sl.g, sl.b);
            sphere(10);
        pop();
    }

    push(); // トーラス
        translate(0, -30, 0);
        rotateX(PI / 2);
        ambientLight(24);
        specularMaterial(255, 255, 255);
        torus(50, 20);
    pop();

    push(); // ボックス
        translate(0, -41, 150);
        rotateX(PI / 2);
        ambientLight(24);
        specularMaterial(255, 255, 255);
        box(80);
    pop();

    push(); // コーン
        translate(150, -30, 0);
        rotateX(PI);
        ambientLight(24);
        specularMaterial(255, 255, 255);
        cone(50, 50);
    pop();

    push(); // 床
        rotateX(PI / 2);
        plane(5000);
    pop();
}

function keyPressed() {
    if (key === 'r') {
        camera(1000, 0, 0, 0, 0, 0, 0, 1, 0);
    }
    if (key === 'w') {
        spotlights[selected].x += 5;
    }
    if (key === 's') {
        spotlights[selected].x -= 5;
    }
    if (key === 'a') {
        spotlights[selected].z -= 5;
    }
    if (key === 'd') {
        spotlights[selected].z += 5;
    }
    if (key === ' ') {
        spotlights[selected].c = 100;
        selected = (selected + 1) % spotlights.length;
        spotlights[selected].c = 255;
    }
    if (keyCode === ENTER) {
        if (spotlights.length > 0) {
            spotlights[selected].c = 100;
        }
        selected = spotlights.length;
        // デフォルトで黄色のスポットライトを追加
        spotlights.push({ r: 255, g: 255, b: 0, x: 0, y: 100, z: 0, c: 255 });
    }
    if (keyCode === DELETE) {
        spotlights.splice(selected, 1);
        if (spotlights.length > 0) {
            selected = selected % spotlights.length;
            spotlights[selected].c = 255;
        }
    }
}
