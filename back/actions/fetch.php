<?php

//fetch.php
$prefix = $_SERVER['HTTPS'] ? 'https://' : 'http://';
$domain = $_SERVER['HTTP_HOST'];
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept' );
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');


$api_url = $prefix.$domain.'/restaurante/back/api/test_api.php?action=fetch_all';

$client = curl_init($api_url);

curl_setopt($client, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($client);

$result = json_decode($response);



if(count($response) > 0)

    $output = $response;

else
    $output = 'empty';

echo $response;

?>