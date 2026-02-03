<?php
require __DIR__ . '/db.php';

$apartment = $_GET['apartment'] ?? 'dejavu1';
$year = intval($_GET['year'] ?? date('Y'));
$month = intval($_GET['month'] ?? date('n'));
if ($month < 1 || $month > 12) $month = date('n');

$start = sprintf('%04d-%02d-01', $year, $month);
$end = date('Y-m-t', strtotime($start));

$pdo = get_pdo();
$stmt = $pdo->prepare("SELECT booked_date FROM booked_dates WHERE apartment = :apt AND booked_date BETWEEN :s AND :e ORDER BY booked_date ASC");
$stmt->execute([':apt' => $apartment, ':s' => $start, ':e' => $end]);
$dates = array_map(fn($r) => $r['booked_date'], $stmt->fetchAll());

respond_json(['apartment' => $apartment, 'year' => $year, 'month' => $month, 'bookedDates' => $dates]);
*** End Patch

