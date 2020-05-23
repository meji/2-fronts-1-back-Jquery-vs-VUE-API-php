<?php

//fetch.php
$prefix = $_SERVER['HTTPS'] ? 'https://' : 'http://';
$domain = $_SERVER['HTTP_HOST'];


$api_url = $prefix.$domain.'/restaurante/api/test_api.php?action=fetch_all';

$client = curl_init($api_url);

curl_setopt($client, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($client);

$result = json_decode($response);

$output = '';

if(count($result) > 0)
{
	foreach($result as $row)
	{
		$output .= '
		<tr>
			<td>'.$row->nombre.'</td>
			<td>'.$row->apellidos.'</td>
			<td>'.$row->telefono.'</td>
			<td>'.$row->fecha.'</td>
			<td>'.$row->comensales.'</td>
			<td>'.$row->comentarios.'</td>
			<td><button type="button" name="edit" class="btn btn-warning btn-xs edit" id="'.$row->id.'">Edit</button></td>
			<td><button type="button" name="delete" class="btn btn-danger btn-xs delete" id="'.$row->id.'">Delete</button></td>
		</tr>
		';
	}
}
else
{
	$output .= '
	<tr>
		<td colspan="4" align="center">No Data Found</td>
	</tr>
	';
}

echo $output;

?>