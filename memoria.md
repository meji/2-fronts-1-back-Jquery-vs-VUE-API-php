#Memoria
Se puede consultar la versión online de este proyecto [aquí](http://meland.es/restaurante/front/)

Importante: Para que funcione correctamente el directorio se tiene que llamar "restaurante" por la url de la api

La parte de back está en la carpeta BACK, dividido en la API, donde está el test para ver si está la base de datos, la api, y las acciones en test_api
La parte de front tiene el index, donde se llaman a las librerías usadas, y el js, donde está todo el ajax y las acciones, y el css. 
Uso [Bootstrap 3](https://getbootstrap.com/docs/3.4/) y [flatpicker](https://flatpickr.js.org/)

Para hacer la web más amigable, las modificaciones de las reservas, las nuevas reservas y los detalles se hacen en el popup desde la misma página, el filtro de las proximas 24 horas también. 
Lleva un poco más de trabajo pero gana mucho en usabilidad e interacción 

Se han conseguido los objetivos pedidos:
* Listado de todas las **reservas futuras** , con acción en cada una para:
    * Ver detalle
    * Modificar reserva
    * Eliminar Reserva
* Botón de añadir reserva
* Si hay reservas en las próximas 24 horas sale una nota encima de las reservas y podemos filtrar y ver esas reservas.
* Crear o modifcar reserva tiene las siguientes restricciones:
    * Que la reserva sea 24 horas más adelante de la fecha ºen la que se está haciendo
    * Que los comensales sean menos de 10
    * **Extra**: Además que los campos menos mensaje estén todos rellenos
* Cada minuto se comprueba si hay nuevas reservas

