<?php
require __DIR__ . '/db.php';
$pdo = get_pdo();
$rows = $pdo->query("SELECT apartment, price_eur, price_rsd FROM prices")->fetchAll();
$out = [];
foreach ($rows as $r) {
    $out[$r['apartment']] = [
        'eur' => isset($r['price_eur']) ? (float)$r['price_eur'] : 0,
        'rsd' => isset($r['price_rsd']) ? (float)$r['price_rsd'] : 0,
    ];
}
respond_json(['prices' => $out]);


