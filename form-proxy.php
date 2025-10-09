<?php
// form-proxy.php
// Прокси-ретранслятор на Web3Forms, чтобы обойти блокировки Wi-Fi / DNS / фильтры

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(204);
  exit;
}

// Антиспам (honeypot)
if (!empty($_POST['website'])) {
  echo json_encode(['success' => true, 'message' => 'OK']);
  exit;
}

$apiUrl = "https://api.web3forms.com/submit";

// Безопасно прокидываем только нужные поля (если хочешь — можно оставить $_POST как есть)
$postFields = $_POST;

// Гарантируем UTF-8
foreach ($postFields as $k => $v) {
  if (!mb_detect_encoding($v, 'UTF-8', true)) {
    $postFields[$k] = mb_convert_encoding($v, 'UTF-8');
  }
}

// cURL отправка
$ch = curl_init($apiUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $postFields);
curl_setopt($ch, CURLOPT_TIMEOUT, 15);
curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 8);

// В редких сетях может понадобиться ниже (обычно не нужно):
// curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 2);
// curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);

$response = curl_exec($ch);
$err      = curl_error($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

// Если Web3Forms ответил валидным JSON — отдаём как есть
if ($response && ($data = json_decode($response, true)) !== null) {
  http_response_code($httpCode ?: 200);
  echo json_encode($data, JSON_UNESCAPED_UNICODE);
  exit;
}

// Если что-то пошло не так — возвращаем дружелюбный ответ
http_response_code(200);
echo json_encode([
  'success' => false,
  'message' => $err ? ('Proxy error: ' . $err) : 'Unknown proxy error'
], JSON_UNESCAPED_UNICODE);
