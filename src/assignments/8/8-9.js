function setup() {
    createCanvas(600, 400, WEBGL);
    noStroke();
    angleMode(DEGREES);
    
    camera(
        0, 1000, 1600,  // カメラの位置 (x, y, z)
        0, 0, 0,       // 見ている点 (x, y, z)
        0, 0, 1       // 上方向ベクトル
    );
}


function draw() {
    background(20);
    orbitControl(); 
    
    // noLights();           // ライトの初期化
    
    ambientLight(40); //デフォルトの明るさ

    let lighthight = 300;
    
    // スポットライト
    let pos1 = [500,lighthight,0];
    let pos2 = [0,lighthight,0];
    let pos3 = [-500,lighthight,0];
    
    spotLight(255, 0, 0, ...pos1, 0, -1, 0, 30, 2);
    spotLight(0, 255, 0, ...pos2, 0, -1, 0, 30, 2);
    spotLight(0, 0, 255, ...pos3, 0, -1, 0, 30, 2);

    push(); // 赤ライト球
        emissiveMaterial(255, 0, 0);
        translate(...pos1);
        sphere(10);
    pop();
    
    push(); // 緑ライト球
        emissiveMaterial(0, 255, 0);
        translate(...pos2);
        sphere(10);
    pop();
    
    push(); // 青ライト球
        emissiveMaterial(0, 0, 255);
        translate(...pos3);
        sphere(10);
    pop();

    push(); // 立方体
        let boxsize = 100;
        specularMaterial(200); // 8-3.jsと同じパターン
        translate(pos1[0], boxsize/2, pos1[2]);
        box(boxsize);
    pop();

    push(); // 球
        let spheresize = 100;
        specularMaterial(200);
        translate(pos2[0], spheresize, pos2[2]);
        sphere(spheresize);
    pop();
    
    push(); // 円錐
        let conesize = 200;
        specularMaterial(200);
        translate(pos3[0], conesize/2, pos3[2]);
        cone(conesize/2, conesize);
    pop();

    push();
        specularMaterial(200); // 8-3.jsと同じ
        rotateX(-90);
        plane(2000, 2000);
    pop();
    
}
