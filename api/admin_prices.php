<?php
require __DIR__ . '/db.php';
$cfg = require __DIR__ . '/../config.php';

$token = $_POST['token'] ?? $_GET['token'] ?? '';
if (!$token || $token !== $cfg['admin_token']) {
  respond_json(['error' => 'Unauthorized'], 401);
}
$apartment = $_POST['apartment'] ?? '';
$price_eur = $_POST['price_eur'] ?? null;
$price_rsd = $_POST['price_rsd'] ?? null;
if (!in_array($apartment, ['dejavu1', 'dejavu2'])) {
  respond_json(['error' => 'Invalid apartment'], 400);
}
if (($price_eur !== null && (!is_numeric($price_eur) || $price_eur < 0)) ||
  ($price_rsd !== null && (!is_numeric($price_rsd) || $price_rsd < 0))
) {
  respond_json(['error' => 'Invalid price value'], 400);
}
$pdo = get_pdo();
$params = [':a' => $apartment, ':pe' => $price_eur, ':pr' => $price_rsd];
$stmt = $pdo->prepare("
  INSERT INTO prices (apartment, price_eur, price_rsd)
  VALUES (:a, COALESCE(:pe,0), COALESCE(:pr,0))
  ON DUPLICATE KEY UPDATE
    price_eur = COALESCE(:pe, price_eur),
    price_rsd = COALESCE(:pr, price_rsd)
");
$stmt->execute($params);
respond_json(['status' => 'ok']);
