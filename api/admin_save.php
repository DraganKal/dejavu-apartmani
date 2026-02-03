<?php
require __DIR__ . '/db.php';
$cfg = require __DIR__ . '/../config.php';

// Very simple token auth
$token = $_POST['token'] ?? $_GET['token'] ?? '';
if (!$token || $token !== $cfg['admin_token']) {
    respond_json(['error' => 'Unauthorized'], 401);
}

$apartment = $_POST['apartment'] ?? '';
$action = $_POST['action'] ?? 'add'; // add | delete
$start = $_POST['start_date'] ?? '';
$end = $_POST['end_date'] ?? '';

if (!in_array($apartment, ['dejavu1','dejavu2'])) {
    respond_json(['error' => 'Invalid apartment'], 400);
}
if (!$start) respond_json(['error' => 'Missing start_date'], 400);
if (!$end) $end = $start;

$sTime = strtotime($start);
$eTime = strtotime($end);
if ($sTime === false || $eTime === false || $eTime < $sTime) {
    respond_json(['error' => 'Invalid date range'], 400);
}

$pdo = get_pdo();
$pdo->beginTransaction();
try {
    if ($action === 'delete') {
        $stmt = $pdo->prepare("DELETE FROM booked_dates WHERE apartment = :apt AND booked_date BETWEEN :s AND :e");
        $stmt->execute([':apt' => $apartment, ':s' => date('Y-m-d', $sTime), ':e' => date('Y-m-d', $eTime)]);
    } else {
        $stmt = $pdo->prepare("INSERT IGNORE INTO booked_dates (apartment, booked_date) VALUES (:apt, :d)");
        for ($t = $sTime; $t <= $eTime; $t = strtotime('+1 day', $t)) {
            $stmt->execute([':apt' => $apartment, ':d' => date('Y-m-d', $t)]);
        }
    }
    $pdo->commit();
} catch (Throwable $e) {
    $pdo->rollBack();
    respond_json(['error' => 'DB error'], 500);
}

respond_json(['status' => 'ok']);
*** End Patch

