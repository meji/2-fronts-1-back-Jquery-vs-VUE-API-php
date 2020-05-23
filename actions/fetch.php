<?php

//fetch.php
$prefix = $_SERVER['HTTPS'] ? 'https://' : 'http://';
$domain = $_SERVER['HTTP_HOST'];


$api_url = $prefix.$domain.'/restaurante/api/test_api.php?action=fetch_all';

$client = curl_init($api_url);

curl_setopt($client, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($client);

$result = json_decode($response);



if(count($response) > 0)

$output = $response;

else
$output = 'No hay datos';

echo $output;

?>