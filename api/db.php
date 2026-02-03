<?php
function get_pdo(): PDO {
    static $pdo = null;
    if ($pdo) return $pdo;
    $cfg = require __DIR__ . '/../config.php';
    $dsn = sprintf('mysql:host=%s;dbname=%s;charset=%s',
        $cfg['db']['host'], $cfg['db']['name'], $cfg['db']['charset']);
    $pdo = new PDO($dsn, $cfg['db']['user'], $cfg['db']['pass'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
    ensure_schema($pdo);
    return $pdo;
}

function ensure_schema(PDO $pdo): void {
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS booked_dates (
            id INT AUTO_INCREMENT PRIMARY KEY,
            apartment VARCHAR(32) NOT NULL,
            booked_date DATE NOT NULL,
            UNIQUE KEY uniq_apartment_date (apartment, booked_date)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS prices (
            apartment VARCHAR(32) PRIMARY KEY,
            price_eur DECIMAL(10,2) NOT NULL DEFAULT 0,
            price_rsd DECIMAL(10,2) NOT NULL DEFAULT 0
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");
    // in case an older schema exists with single price column, add new columns
    try {
        $pdo->exec("ALTER TABLE prices ADD COLUMN IF NOT EXISTS price_eur DECIMAL(10,2) NOT NULL DEFAULT 0");
        $pdo->exec("ALTER TABLE prices ADD COLUMN IF NOT EXISTS price_rsd DECIMAL(10,2) NOT NULL DEFAULT 0");
    } catch (Throwable $e) { /* ignore */ }
    // seed defaults if missing
    $stmt = $pdo->prepare("INSERT IGNORE INTO prices (apartment, price_eur, price_rsd) VALUES (:a, :pe, :pr)");
    $stmt->execute([':a'=>'dejavu1', ':pe'=>0, ':pr'=>0]);
    $stmt->execute([':a'=>'dejavu2', ':pe'=>0, ':pr'=>0]);
}

function respond_json($data, int $code = 200): void {
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data);
    exit;
}
*** End Patch

