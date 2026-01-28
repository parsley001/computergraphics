// ============================================
// マインクラフト風 3D ブロックゲーム
// ============================================

// --- グローバル変数 ---
let blocks = []; // ブロックの位置を格納する配列
const BLOCK_SIZE = 50; // ブロックのサイズ
const WORLD_SIZE = 10; // ワールドの広さ（ブロック数）

// カメラ関連
let camX = 0, camY = -100, camZ = 200; // カメラ位置
let yaw = 0;   // 左右の回転角度（度）
let pitch = 0; // 上下の回転角度（度）

// 移動速度
const MOVE_SPEED = 5;
const MOUSE_SENSITIVITY = 0.3;

// キー入力状態
let keys = {};

// 選択中のブロック
let selectedBlock = null;
let selectedFace = null;

// マウスロック状態
let isMouseLocked = false;

function preload() {
    // 必要であればテクスチャをロード
}

function setup() {
    createCanvas(800, 600, WEBGL);
    angleMode(DEGREES);
    
    // 初期のワールドを生成（地面を作成）
    generateWorld();
    
    // マウスロックの説明
    console.log("クリックしてマウスをロック、ESCで解除");
}

// ワールドの初期生成
function generateWorld() {
    blocks = [];
    
    // 地面のブロックを配置
    for (let x = -WORLD_SIZE; x <= WORLD_SIZE; x++) {
        for (let z = -WORLD_SIZE; z <= WORLD_SIZE; z++) {
            blocks.push({
                x: x * BLOCK_SIZE,
                y: 0, // 地面はy=0
                z: z * BLOCK_SIZE,
                color: getBlockColor(x, z)
            });
        }
    }
    
    // いくつかの高さのあるブロックを追加
    for (let i = 0; i < 20; i++) {
        let rx = floor(random(-WORLD_SIZE, WORLD_SIZE + 1)) * BLOCK_SIZE;
        let rz = floor(random(-WORLD_SIZE, WORLD_SIZE + 1)) * BLOCK_SIZE;
        let height = floor(random(1, 4));
        for (let h = 1; h <= height; h++) {
            blocks.push({
                x: rx,
                y: -h * BLOCK_SIZE,
                z: rz,
                color: getBlockColor(rx / BLOCK_SIZE + h, rz / BLOCK_SIZE)
            });
        }
    }
}

// ブロックの色を決定
function getBlockColor(x, z) {
    let rand = noise(x * 0.1, z * 0.1);
    if (rand < 0.3) {
        return color(139, 69, 19); // 茶色（土）
    } else if (rand < 0.7) {
        return color(34, 139, 34); // 緑（草）
    } else {
        return color(128, 128, 128); // 灰色（石）
    }
}

function draw() {
    background(135, 206, 235); // 空色
    
    // キーボード入力による移動
    handleMovement();
    
    // レイキャストで視線の先のブロックを検出
    selectedBlock = null;
    selectedFace = null;
    raycastBlock();
    
    // カメラの向きを計算
    let lookX = camX + cos(yaw) * cos(pitch);
    let lookY = camY - sin(pitch);
    let lookZ = camZ + sin(yaw) * cos(pitch);
    
    // カメラを設定
    camera(
        camX, camY, camZ,  // カメラ位置
        lookX, lookY, lookZ,  // 注視点
        0, 1, 0  // 上方向ベクトル
    );
    
    // ライティング
    ambientLight(100);
    directionalLight(255, 255, 255, 0.5, 1, -0.5);
    
    // 全てのブロックを描画
    for (let block of blocks) {
        push();
        translate(block.x, block.y, block.z);
        
        // 選択中のブロックは明るく表示
        if (selectedBlock && 
            block.x === selectedBlock.x && 
            block.y === selectedBlock.y && 
            block.z === selectedBlock.z) {
            // ハイライト表示
            let c = block.color;
            let r = min(255, red(c) + 50);
            let g = min(255, green(c) + 50);
            let b = min(255, blue(c) + 50);
            fill(r, g, b);
            stroke(255, 255, 0);
            strokeWeight(2);
        } else {
            fill(block.color);
            stroke(0);
            strokeWeight(1);
        }
        
        box(BLOCK_SIZE);
        pop();
    }
    
    // 十字カーソルを描画（画面中央）
    drawCrosshair();
    
    // デバッグ情報
    drawDebugInfo();
}

// キーボード入力による移動処理
function handleMovement() {
    // 前方向ベクトル（水平面のみ）
    let forwardX = cos(yaw);
    let forwardZ = sin(yaw);
    
    // 右方向ベクトル
    let rightX = cos(yaw + 90);
    let rightZ = sin(yaw + 90);
    
    // W: 前進
    if (keys['w'] || keys['W']) {
        camX += forwardX * MOVE_SPEED;
        camZ += forwardZ * MOVE_SPEED;
    }
    // S: 後退
    if (keys['s'] || keys['S']) {
        camX -= forwardX * MOVE_SPEED;
        camZ -= forwardZ * MOVE_SPEED;
    }
    // A: 左移動
    if (keys['a'] || keys['A']) {
        camX -= rightX * MOVE_SPEED;
        camZ -= rightZ * MOVE_SPEED;
    }
    // D: 右移動
    if (keys['d'] || keys['D']) {
        camX += rightX * MOVE_SPEED;
        camZ += rightZ * MOVE_SPEED;
    }
    // スペース: 上昇
    if (keys[' ']) {
        camY -= MOVE_SPEED;
    }
    // Shift: 下降
    if (keyIsDown(SHIFT)) {
        camY += MOVE_SPEED;
    }
}

// レイキャストでブロックを検出
function raycastBlock() {
    // 視線方向
    let dirX = cos(yaw) * cos(pitch);
    let dirY = sin(pitch);
    let dirZ = sin(yaw) * cos(pitch);
    
    let minDist = Infinity;
    
    for (let block of blocks) {
        // カメラからブロック中心へのベクトル
        let dx = block.x - camX;
        let dy = block.y - camY;
        let dz = block.z - camZ;
        
        // ブロックとの交差判定（AABB）
        let halfSize = BLOCK_SIZE / 2;
        let result = rayBoxIntersection(
            camX, camY, camZ,
            dirX, dirY, dirZ,
            block.x - halfSize, block.y - halfSize, block.z - halfSize,
            block.x + halfSize, block.y + halfSize, block.z + halfSize
        );
        
        if (result.hit && result.t > 0 && result.t < minDist && result.t < 500) {
            minDist = result.t;
            selectedBlock = block;
            selectedFace = result.face;
        }
    }
}

// レイとAABB（軸並行境界ボックス）の交差判定
function rayBoxIntersection(ox, oy, oz, dx, dy, dz, minX, minY, minZ, maxX, maxY, maxZ) {
    let tmin = -Infinity;
    let tmax = Infinity;
    let face = null;
    
    // X軸
    if (abs(dx) > 0.0001) {
        let t1 = (minX - ox) / dx;
        let t2 = (maxX - ox) / dx;
        if (t1 > t2) [t1, t2] = [t2, t1];
        if (t1 > tmin) { tmin = t1; face = dx > 0 ? 'x-' : 'x+'; }
        if (t2 < tmax) tmax = t2;
    } else if (ox < minX || ox > maxX) {
        return { hit: false };
    }
    
    // Y軸
    if (abs(dy) > 0.0001) {
        let t1 = (minY - oy) / dy;
        let t2 = (maxY - oy) / dy;
        if (t1 > t2) [t1, t2] = [t2, t1];
        if (t1 > tmin) { tmin = t1; face = dy > 0 ? 'y-' : 'y+'; }
        if (t2 < tmax) tmax = t2;
    } else if (oy < minY || oy > maxY) {
        return { hit: false };
    }
    
    // Z軸
    if (abs(dz) > 0.0001) {
        let t1 = (minZ - oz) / dz;
        let t2 = (maxZ - oz) / dz;
        if (t1 > t2) [t1, t2] = [t2, t1];
        if (t1 > tmin) { tmin = t1; face = dz > 0 ? 'z-' : 'z+'; }
        if (t2 < tmax) tmax = t2;
    } else if (oz < minZ || oz > maxZ) {
        return { hit: false };
    }
    
    if (tmin > tmax || tmax < 0) {
        return { hit: false };
    }
    
    return { hit: true, t: tmin, face: face };
}

// 十字カーソルを描画
function drawCrosshair() {
    // カメラの前方に十字カーソルを配置
    let distance = 80; // カメラからの距離
    
    // 視線方向ベクトル
    let forwardX = cos(yaw) * cos(pitch);
    let forwardY = -sin(pitch);
    let forwardZ = sin(yaw) * cos(pitch);
    
    // 十字カーソルの中心位置
    let centerX = camX + forwardX * distance;
    let centerY = camY + forwardY * distance;
    let centerZ = camZ + forwardZ * distance;
    
    // 上方向ベクトル（カメラの上方向）
    let upX = -cos(yaw) * sin(pitch);
    let upY = -cos(pitch);
    let upZ = -sin(yaw) * sin(pitch);
    
    // 右方向ベクトル（外積で計算）
    let rightX = cos(yaw + 90);
    let rightY = 0;
    let rightZ = sin(yaw + 90);
    
    // 十字のサイズ
    let size = 2;
    
    push();
    stroke(255);
    strokeWeight(0.3);
    
    // 横線
    line(
        centerX + rightX * size, centerY + rightY * size, centerZ + rightZ * size,
        centerX - rightX * size, centerY - rightY * size, centerZ - rightZ * size
    );
    
    // 縦線
    line(
        centerX + upX * size, centerY + upY * size, centerZ + upZ * size,
        centerX - upX * size, centerY - upY * size, centerZ - upZ * size
    );

    
    pop();
}

// デバッグ情報の表示
function drawDebugInfo() {
    push();
    resetMatrix();
    ortho();
    
    fill(255);
    noStroke();
    textSize(14);
    textAlign(LEFT, TOP);
    
    let info = `位置: (${camX.toFixed(0)}, ${camY.toFixed(0)}, ${camZ.toFixed(0)})`;
    info += `\n角度: yaw=${yaw.toFixed(0)}, pitch=${pitch.toFixed(0)}`;
    info += `\nブロック数: ${blocks.length}`;
    if (selectedBlock) {
        info += `\n選択中: (${selectedBlock.x}, ${selectedBlock.y}, ${selectedBlock.z})`;
        info += `\n面: ${selectedFace}`;
    }
    info += `\n\n操作方法:`;
    info += `\nWASD: 移動`;
    info += `\nマウス: 視点`;
    info += `\n左クリック: ブロック破壊`;
    info += `\n右クリック: ブロック設置`;
    info += `\nスペース/Shift: 上昇/下降`;
    info += `\nクリックでマウスロック`;
    
    text(info, -width/2 + 10, -height/2 + 10);
    pop();
}

// マウスの移動で視点を動かす
function mouseMoved() {
    if (isMouseLocked) {
        yaw += movedX * MOUSE_SENSITIVITY;
        pitch -= movedY * MOUSE_SENSITIVITY;
        
        // ピッチ角の制限（真上・真下を見すぎないように）
        pitch = constrain(pitch, -89, 89);
    }
}

function mouseDragged() {
    if (isMouseLocked) {
        yaw += movedX * MOUSE_SENSITIVITY;
        pitch -= movedY * MOUSE_SENSITIVITY;
        pitch = constrain(pitch, -89, 89);
    }
}

// マウスクリック
function mousePressed() {
    // マウスロックを開始
    if (!isMouseLocked) {
        isMouseLocked = true;
        requestPointerLock();
        return;
    }
    
    if (selectedBlock) {
        if (mouseButton === LEFT) {
            // 左クリック: ブロックを破壊
            destroyBlock(selectedBlock);
        } else if (mouseButton === RIGHT) {
            // 右クリック: ブロックを設置
            placeBlock(selectedBlock, selectedFace);
        }
    }
}

// ブロックを破壊
function destroyBlock(block) {
    let index = blocks.findIndex(b => 
        b.x === block.x && 
        b.y === block.y && 
        b.z === block.z
    );
    if (index !== -1) {
        blocks.splice(index, 1);
    }
}

// ブロックを設置
function placeBlock(block, face) {
    let newX = block.x;
    let newY = block.y;
    let newZ = block.z;
    
    // 面に応じて新しいブロックの位置を決定
    switch(face) {
        case 'x+': newX += BLOCK_SIZE; break;
        case 'x-': newX -= BLOCK_SIZE; break;
        case 'y+': newY += BLOCK_SIZE; break;
        case 'y-': newY -= BLOCK_SIZE; break;
        case 'z+': newZ += BLOCK_SIZE; break;
        case 'z-': newZ -= BLOCK_SIZE; break;
    }
    
    // 同じ位置にブロックがないか確認
    let exists = blocks.some(b => 
        b.x === newX && 
        b.y === newY && 
        b.z === newZ
    );
    
    // カメラ位置と重ならないか確認
    let halfSize = BLOCK_SIZE / 2;
    let cameraCollision = (
        camX > newX - halfSize && camX < newX + halfSize &&
        camY > newY - halfSize && camY < newY + halfSize &&
        camZ > newZ - halfSize && camZ < newZ + halfSize
    );
    
    if (!exists && !cameraCollision) {
        blocks.push({
            x: newX,
            y: newY,
            z: newZ,
            color: getBlockColor(newX / BLOCK_SIZE, newZ / BLOCK_SIZE)
        });
    }
}

// キーボード入力
function keyPressed() {
    keys[key] = true;
    
    // ESCでマウスロック解除
    if (keyCode === ESCAPE) {
        isMouseLocked = false;
        exitPointerLock();
    }
}

function keyReleased() {
    keys[key] = false;
}

// 右クリックメニューを無効化
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});
