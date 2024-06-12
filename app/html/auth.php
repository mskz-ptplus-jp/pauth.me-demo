<?php
$API_KEY = file_get_contents(__DIR__ . '/../API_KEY');
$AP_URL = file_get_contents(__DIR__ . '/../AP_URL');

// cURL
$ch = curl_init("{$AP_URL}/api/v1/auth");
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "api_key" => $API_KEY,
]));

// Request
$response = curl_exec($ch);

if (curl_errno($ch)) {
    echo 'Error:' . curl_error($ch);
} else {
    // 応答を JSON としてデコードして表示
    $response_data = json_decode($response, true);
    echo implode("", [
        "const token = '{$response_data['token']}';",
        "const url = '{$AP_URL}';",
    ]);
}

curl_close($ch);
