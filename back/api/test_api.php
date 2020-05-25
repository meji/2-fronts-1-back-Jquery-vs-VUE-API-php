<?php
    include('api.php');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept' );
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
    $api_object = new API();
    if($_GET["action"] == 'fetch_all')
    {
        $data = $api_object->fetch_all();
    }
    if($_GET["action"] == 'insert')
    {
        $data = $api_object->insert();
    }
    if($_GET["action"] == 'fetch_single')
    {
        $data = $api_object->fetch_single($_GET["id"]);
    }
    if($_GET["action"] == 'update')
    {
        $data = $api_object->update();
    }
    if($_GET["action"] == 'delete')
    {
        $data = $api_object->delete($_GET["id"]);
    }
    echo json_encode($data);
?>