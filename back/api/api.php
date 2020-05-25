<?php
    class API{
	private $connect = '';
	function __construct()
	{
		$this->database_connection();
	}
	function database_connection()
	{
		$this->connect = new PDO("mysql:host=localhost:3307;dbname=restauranteuoc", "root", "root");
	}
	function fetch_all()
	{
		$query = "SELECT * FROM reservas ORDER BY id";
		$statement = $this->connect->prepare($query);
		if($statement->execute())
		{
			while($row = $statement->fetch(PDO::FETCH_ASSOC))
			{
				$data[] = $row;
			}
			return $data;
		}
	}
	function insert()
	{
		if(isset($_POST["nombre"]))
		{
			$form_data = array(
				':nombre'		=>	$_POST["nombre"],
				':apellidos'		=>	$_POST["apellidos"],
				':telefono'		=>	$_POST["telefono"],
				':fecha'		=>	$_POST["fecha"],
				':comensales'		=>	$_POST["comensales"],
				':comentarios'		=>	$_POST["comentarios"]
			);
			$query = "INSERT INTO reservas (nombre, apellidos, telefono, fecha, comensales, comentarios) VALUES (:nombre, :apellidos, :telefono, :fecha, :comensales, :comentarios)";
			$statement = $this->connect->prepare($query);
			if($statement->execute($form_data))
			{
				$data[] = array(
					'success'	=>	'1'
				);
			}
			else
			{
				$data[] = array(
					'success'	=>	'0'
				);
			}
		}
		else
		{
			$data[] = array(
				'success'	=>	'0',
				'err' => 'No hay nombre'
			);
		}
		return $data;
	}

	function fetch_single($id)
	{
		$query = "SELECT * FROM reservas WHERE id='".$id."'";
		$statement = $this->connect->prepare($query);
		if($statement->execute())
		{
			foreach($statement->fetchAll() as $row)
			{
				$data['nombre'] = $row['nombre'];
				$data['apellidos'] = $row['apellidos'];
				$data['telefono'] = $row['telefono'];
				$data['fecha'] = $row['fecha'];
				$data['comensales'] = $row['comensales'];
				$data['comentarios'] = $row['comentarios'];

			}
			return $data;
		}
	}

	function update()
	{
		if(isset($_POST["nombre"]))
		{
			$form_data = array(
				':nombre'	=>	$_POST['nombre'],
				':apellidos'	=>	$_POST['apellidos'],
				':id'	=>	$_POST['id'],
				':telefono'	=>	$_POST['telefono'],
				':fecha'	=>	$_POST['fecha'],
				':comensales'	=>	$_POST['comensales'],
				':comentarios'	=>	$_POST['comentarios']
			);
			$query = "
			UPDATE reservas
			SET nombre = :nombre, apellidos = :apellidos , telefono = :telefono, fecha = :fecha, comensales = :comensales, comentarios = :comentarios
			WHERE id = :id
			";
			$statement = $this->connect->prepare($query);
			if($statement->execute($form_data))
			{
				$data[] = array(
					'success'	=>	'1'
				);
			}
			else
			{
				$data[] = array(
					'success'	=>	'0'
				);
			}
		}
		else
		{
			$data[] = array(
				'success'	=>	'0'
			);
		}
		return $data;
	}
	function delete($id)
	{
		$query = "DELETE FROM reservas WHERE id = '".$id."'";
		$statement = $this->connect->prepare($query);
		if($statement->execute())
		{
			$data[] = array(
				'success'	=>	'1'
			);
		}
		else
		{
			$data[] = array(
				'success'	=>	'0'
			);
		}
		return $data;
	}
}

?>