<?php
$API_KEY = trim(file_get_contents(__DIR__ . '/../API_KEY'));
$AP_URL = trim(file_get_contents(__DIR__ . '/../AP_URL'));

$response = file_get_contents(
    "{$AP_URL}/api/v1/auth",
    false,
    stream_context_create([
        "http" => [
            "header" => "api-key: {$API_KEY}\r\n",
            "method" => "GET",
        ],
    ])
);

if ($response === FALSE) {
    echo 'Error: Failed to fetch data';
} else {
    $response_data = json_decode($response, true);
    echo implode("", [
        "const token = '{$response_data['token']}';",
        "const url = '{$AP_URL}';",
    ]);
}
