<?php

//action.php
$prefix = $_SERVER['HTTPS'] ? 'https://' : 'http://';
$domain = $_SERVER['HTTP_HOST'];

if(isset($_POST["action"]))
{
	if($_POST["action"] == 'insert')
	{
		$form_data = array(
			'nombre'	=>	$_POST['nombre'],
			'apellidos'		=>	$_POST['apellidos'],
			'telefono'		=>	$_POST['telefono'],
			'fecha'		=>	date('Y-m-d\TH:i', strtotime($_POST['fecha'])),
			'comensales'		=>	$_POST['comensales'],
			'comentarios'		=>	$_POST['comentarios']
		);
		$api_url = $prefix.$domain."/restaurante/api/test_api.php?action=insert";
		$client = curl_init($api_url);
		curl_setopt($client, CURLOPT_POST, true);
		curl_setopt($client, CURLOPT_POSTFIELDS, $form_data);
		curl_setopt($client, CURLOPT_RETURNTRANSFER, true);
		$response = curl_exec($client);
		curl_close($client);
		$result = json_decode($response, true);
		foreach($result as $keys => $values)
		{
			if($result[$keys]['success'] == '1')
			{
				echo 'insert';
			}
			else
			{
				echo 'error';
			}
		}
	}

	if($_POST["action"] == 'fetch_single')
	{
		$id = $_POST["id"];
		$api_url = $prefix.$domain."/restaurante/api/test_api.php?action=fetch_single&id=".$id."";
		$client = curl_init($api_url);
		curl_setopt($client, CURLOPT_RETURNTRANSFER, true);
		$response = curl_exec($client);
		echo $response;
	}
	if($_POST["action"] == 'update')
	{
		$form_data = array(
			'nombre'	=>	$_POST['nombre'],
			'apellidos'		=>	$_POST['apellidos'],
			'telefono'		=>	$_POST['telefono'],
			'fecha'		=>	date('Y-m-d\TH:i', strtotime($_POST['fecha'])),
			'comensales'		=>	$_POST['comensales'],
			'comentarios'		=>	$_POST['comentarios'],
			'id'			=>	$_POST['hidden_id']
		);

		$api_url = $prefix.$domain."/restaurante/api/test_api.php?action=update";  //change this url as per your folder path for api folder
		$client = curl_init($api_url);
		curl_setopt($client, CURLOPT_POST, true);
		curl_setopt($client, CURLOPT_POSTFIELDS, $form_data);
		curl_setopt($client, CURLOPT_RETURNTRANSFER, true);
		$response = curl_exec($client);
		curl_close($client);
		$result = json_decode($response, true);
		foreach($result as $keys => $values)
		{
			if($result[$keys]['success'] == '1')
			{
				echo 'update';
			}
			else
			{
				echo 'error';
			}
		}
	}
	if($_POST["action"] == 'delete')
	{
		$id = $_POST['id'];
		$api_url = $prefix.$domain."/restaurante/api/test_api.php?action=delete&id=".$id."";
		$client = curl_init($api_url);
		curl_setopt($client, CURLOPT_RETURNTRANSFER, true);
		$response = curl_exec($client);
		echo $response;
	}
}


?>