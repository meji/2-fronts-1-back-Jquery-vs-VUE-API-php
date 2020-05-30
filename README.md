# Memoria
## Memoria online
Se puede ver una versión online en 
* **Vue:** http://meland.es/restaurante/vuefront/
* **jQuery**: http://meland.es/restaurante/front/
* **BackAPI:** http://meland.es/restaurante/back/API/api_test.php

Se puede ver el proyecto y descargar de:

* Se puede descargar todo el proyecto con carpeta dist y con carpeta node módules aquí:
https://drive.google.com/drive/folders/1MxxACGfOf3dPtVqAcUrzSCAV2HmUOUl9?usp=sharing

* Se puede ver en Git aquí:
https://github.com/meji/2-fronts-1-back-Jquery-vs-VUE-API-php.git


Está hecho con Vue cli, hacer npm i para instalar paquetes de node en la carpeta vuefront. 

En el archivo vue.config.js está puesto el publicpath (url publica), si se quiere ver en otro equipo crear un servidor online, y dentro de restaurante, en la carpeta vuefront meter el contenido de dist una vez hecho npm run build.

El back está referenciado en el .env ahora está ligado a la copia online http://meland.es/restaurante/back/ en el .env, es una copia del back de esta carpeta, si se quiere cambiar el back, para poner el de localhost, poner otra url volver a hacer el build o el npm run serve

Si se quiere cambiar la base de datos cambiar en el back

Para ver proyecto se puede hacer npm run serve, para construir build cambiando el path nom run build

## Back API CRUD
He usado el mismo back que en la practica anterior, de hecho se puede acceder al front anterior cambiando el directorio por front en vez de vuefront, para ver que comparten back y base de datos. Está en la carpeta back, pero este front tira de la url del back online.

## Librerías usadas:
* Axios y AxiosCors para las peticiones fetch
* FlatPickr para los calendarios, como la otra práctica pero para VUE
* Bootstrap Vue para la maquetación y la tabla
* He evitado usar jQuery para demostrar una forma nueva y más moderna de hacerlo, para ver la versión jQuery ver el front de la práctica anterior tabién incluido. Era más fácil reutirlizalo, pero he preferido aumentar mis conocimientos con librerías enfocadas a frameworks modernos como Axios

## Componentes
He hecho un componente padre home en views, y componentes hijos Form, y ReservaDetail, para los modales del Form y del Detalle

## Objetivos nuevos cumplidos:
Además de todo lo anterior de la otra práctica, de pintar tabla, crear reserva, ver 24h, eliminar reserva, o modificar,  se pide objetivos nuevos
 * Filtrar por las próximas 24 h si hay reservas en esas 24h con filtro en VUE
 * Filtrar por campo según escribes (De hecho este filtro vale para filtrar por lo que quieras, es una funcionalidad extra que he añadido)
 * Filtrar por nombre y apellidos según escribes
 * Filtrar por fecha: Filtra por un rango de fechas
 * Ordenación de columnas, si pulsas en cualquiera se puede ordenar
 * Ver detalle a través de Vue
 
## Objetivos cumplidos por puntos:
* Modificaremos la carga de los datos y construcción de la tabla. (1 punto)
* Incluir un campo para filtrar la tabla por nombre y apellidos. (1 punto)
* Incluir selectores para filtrar por fecha (1 punto)
* Ordenación de las columnas (1 punto)
* Modificación del link de las reservas en las próximas 24 horas (0,5 punto)
* Modificaremos las validaciones de los campos (1 punto)
* Modificaremos la carga de los datos y construcción de la tabla 24h. (1 punto)
* Incluir un campo para filtrar la tabla por nombre y apellidos. (1 punto)
* Incluir selectores para filtrar por fecha (1 punto) (aunque esta petición no tiene ningún sentido se ha hecho)
* Ordenación de las columnas (1 punto)