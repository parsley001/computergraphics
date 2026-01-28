/* 
玉転がしゲーム
* WASDでボールを操作
* スペースでジャンプ
* フィールド上の金のオブジェクトに触れると、新しい金のオブジェクトが出る
* 場外に出ると落下
* マウスで視点操作が可能
*/

// ボールの状態
let ball = {
    pos: null,
    vel: null,
    radius: 20,
    rotX: 0,  // X軸回転（前後移動）
    rotZ: 0   // Z軸回転（左右移動）
};

// 物理
const GRAVITY = 0.5;
const FRICTION = 0.98;
const ACCELERATION = 0.1;
const JUMP_FORCE = 10;

// カメラ
let camAngle = 0;
let camPitch = 0.5;
let camDist = 300;
let isDragging = false;
let lastMouseX = 0;
let lastMouseY = 0;

// 地面の高さ
const GROUND_Y = 0;

// ターゲットボール
let targetBall = {
    pos: null,
    radius: 15
};

// テクスチャ
let ballTexture;
let coinTexture;
let groundTexture;

function preload() {
    ballTexture = loadImage('src/assignments/10/ball.png');
    coinTexture = loadImage('src/assignments/10/coin.png');
    groundTexture = loadImage('src/assignments/10/zimen.png');
}

function setup() {
    createCanvas(800, 600, WEBGL);
    textureMode(NORMAL);
    ball.pos = createVector(0, -ball.radius, 0);
    ball.vel = createVector(0, 0, 0);
    
    // ターゲットボールをランダムな位置に配置
    spawnTargetBall();
}

// 床の範囲内（-200~200）でランダムな位置
function spawnTargetBall() {
    let x = random(-200, 200);
    let z = random(-200, 200);
    let y = GROUND_Y - targetBall.radius; // 床の上
    targetBall.pos = createVector(x, y, z);
}

function draw() {
    background(200);
    updatePhysics();
    updateCamera();
    
    // ボールとターゲットボールの衝突判定
    let distance = dist(ball.pos.x, ball.pos.y, ball.pos.z, 
                       targetBall.pos.x, targetBall.pos.y, targetBall.pos.z);
    if (distance < ball.radius + targetBall.radius) {
        // 接触したら新しい位置に再配置
        spawnTargetBall();
    }
    
    // 光の表現
    ambientLight(100);
    directionalLight(255, 255, 255, 0.5, 1, -0.5);
    
    //　床
    push();
    {
        translate(0, 10, 0);
        texture(groundTexture);
        box(500, 20, 500);
    }
    pop();
    
    // ボール
    push();
    {
        translate(ball.pos.x, ball.pos.y, ball.pos.z);
        // 回転を適用（X軸回転は前後の動き、Z軸回転は左右の動き）
        rotateX(ball.rotX);
        rotateZ(ball.rotZ);
        texture(ballTexture);
        noStroke();
        sphere(ball.radius);
    }
    pop();
    
    // ターゲットボール
    push();
    {
        translate(targetBall.pos.x, targetBall.pos.y, targetBall.pos.z);
        texture(coinTexture);
        noStroke();
        sphere(targetBall.radius);
    }
    pop();
}

// ユーザー入力
function updatePhysics() {
    let forward = createVector(sin(camAngle), 0, cos(camAngle));
    let right = createVector(cos(camAngle), 0, -sin(camAngle));
    
    if (keyIsDown(87)) { // W
        ball.vel.x -= forward.x * ACCELERATION;
        ball.vel.z -= forward.z * ACCELERATION;
    }
    if (keyIsDown(83)) { // S
        ball.vel.x += forward.x * ACCELERATION;
        ball.vel.z += forward.z * ACCELERATION;
    }
    if (keyIsDown(65)) { // A
        ball.vel.x -= right.x * ACCELERATION;
        ball.vel.z -= right.z * ACCELERATION;
    }
    if (keyIsDown(68)) { // D
        ball.vel.x += right.x * ACCELERATION;
        ball.vel.z += right.z * ACCELERATION;
    }
    if (keyIsDown(82)) { // R リセット
        ball.pos.x = 0;
        ball.pos.y = -50;
        ball.pos.z = 0;
        ball.vel.x = 0;
        ball.vel.y = 0;
        ball.vel.z = 0;
    }
    if (keyIsDown(32) && ball.onGround) { //スペース
        ball.vel.y = -JUMP_FORCE;
    }
    
    // 重力
    ball.vel.y += GRAVITY;
    
    // 摩擦
    ball.vel.x *= FRICTION;
    ball.vel.z *= FRICTION;
    
    // 位置更新
    ball.pos.add(ball.vel);
    
    // ボールの回転更新（速度に基づいて転がり回転）
    // 回転角度 = 移動距離 / 半径
    ball.rotX += ball.vel.z / ball.radius;
    ball.rotZ -= ball.vel.x / ball.radius;
    
    // 地面オブジェクトとの衝突判定
    // 地面: 位置(0, 10, 0)、サイズ(500, 20, 500)
    // 上面Y = 10 - 20/2 = 0, X範囲: -250~250, Z範囲: -250~250
    let groundTop = 0;
    let groundHalfW = 250;
    let groundHalfD = 250;
    
    ball.onGround = false;
    if (ball.pos.x >= -groundHalfW && ball.pos.x <= groundHalfW &&
        ball.pos.z >= -groundHalfD && ball.pos.z <= groundHalfD) {
        // ボールが地面の範囲内にいる場合
        let ballBottom = ball.pos.y + ball.radius;
        // 上から着地する場合のみ衝突（下向きの速度 かつ 地面を貫通している）
        if (ball.vel.y >= 0 && ballBottom > groundTop && ballBottom - ball.vel.y <= groundTop) {
            ball.pos.y = groundTop - ball.radius;
            ball.vel.y = 0;
            ball.onGround = true;
        }
    }
}

function updateCamera() {
    // マウスドラッグで視点操作
    if (isDragging) {
        camAngle -= (mouseX - lastMouseX) * 0.01;
        camPitch = constrain(camPitch + (mouseY - lastMouseY) * 0.01, 0.1, PI / 2 - 0.1);
        lastMouseX = mouseX;
        lastMouseY = mouseY;
    }
    
    // カメラ位置（ボール中心）
    let camX = ball.pos.x + camDist * sin(camAngle) * cos(camPitch);
    let camY = ball.pos.y - camDist * sin(camPitch);
    let camZ = ball.pos.z + camDist * cos(camAngle) * cos(camPitch);
    
    camera(camX, camY, camZ, ball.pos.x, ball.pos.y, ball.pos.z, 0, 1, 0);
}

// function keyPressed() {
//     // スペースキー
    
// }

function mousePressed() {
    isDragging = true;
    lastMouseX = mouseX;
    lastMouseY = mouseY;
}

function mouseReleased() {
    isDragging = false;
}
