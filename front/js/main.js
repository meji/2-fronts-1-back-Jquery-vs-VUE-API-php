$(document).ready(function(){
    //Traemos los datos al cargar la página
    fetch_data();

    let filterSwitch = false; //inicializamos esta varible que se le pasa al fetch para filtrar solo las próximas 24h.
    $('.notice24').on('click', function(){
        filterSwitch = !filterSwitch;
        fetch_data(filterSwitch);
    })
    function fetch_data(filter = false)
    {
        $.ajax({
            url:"../back/actions/fetch.php",
            success:function(data)
            {
                let reservas = [];
                //Comprobamos las reservas en las proximas 24h.
                const reservas24 = JSON.parse(data).filter(reserva => (Math.round(new Date(reserva.fecha).getTime()) >= Math.round(new Date().getTime()) && Math.round(new Date(reserva.fecha).getTime()) <= Math.round(new Date().getTime()+ (24 * 3600000))));
                //Si hay reservas en las próximas 24h pintamos el link de reservas en las próximas 24h.
                if (reservas24.length > 0 && filter === false){
                    $('.notice24').show().text('Hay reservas las próximas 24 horas. Filtrar')
                }else if(reservas24.length > 0 && filter === true){
                    $('.notice24').show().text('Ver todas las reservas')
                }
                //Si estamos viendo todas las reservas:
                if(filter === false) {
                    reservas = JSON.parse(data).filter(reserva => Math.round(new Date(reserva.fecha).getTime()) >= Math.round(new Date().getTime()))
                }else if (filter === true){ //Si estamos viendo solo las de 24 horas
                    reservas = reservas24;
                }
                let bodyTabla= ""; //Iniciamos variable para contenido de la tabla
                //Si no hay reservas futuras lo decimos
                if (reservas.length === 0){
                    bodyTabla = bodyTabla + "<tr><td colspan='9'>No hay Reservas futuras</td></tr>"
                }else {
                    //Las ordenamos por fecha
                    reservas.sort(function(a,b){
                        const dateA=new Date(a.fecha), dateB=new Date(b.fecha)
                        return dateA-dateB //sort by date ascending
                    })
                    //Si filtramos las próximas reservas en 24h mostramos solo las de 24h
                    //Pintamos las reservas en la tabla
                    reservas.map((item) => {
                        bodyTabla = bodyTabla +
                            `<tr>
                        <td>${item.nombre}</td>
                        <td>${item.apellidos}</td>
                        <td>${item.telefono}</td>
                        <td>${flatpickr.formatDate(new Date(item.fecha), "d-m-Y H:i")}</td>
                        <td>${item.comensales}</td>
                        <td>${item.comentarios}</td>
                        <td><button type="button" name="edit" class="btn btn-warning btn-xs edit" id="${item.id}">Modificar</button></td>
                        <td><button type="button" name="delete" class="btn btn-danger btn-xs delete" id="${item.id}">Borrar</button></td>
                        <td><button type="button" name="delete" class="btn btn-xs btn-primary view" id="${item.id}">Ver Detalle</button></td>
                    </tr>`
                    })
                }
                $('tbody').html(bodyTabla); //Pintamos las reservas en el cuerpo de la tabla
            }
        }).done(function() {
        });
    }

    //Al hacer click en nueva reserva:
    $('#nueva_reserva').click(function(){
        $('#res_form').trigger("reset");
        $('#action').val('insert'); //Definimos la acción
        $('#button_action').val('Reservar');//Añadimos texto de Añadir reserva al botón del modal
        $('.modal-title').text('Nueva reserva');
        $('#datetimePicker').flatpickr({
            wrap: true,
            locale: "es",
            enableTime: true,
            minTime: "13:00",
            maxTime: "16:00",
            minDate: new Date().fp_incr(1),
            time_24hr: true,
            altInput: true,
            altFormat: "D d-m-Y H:i",
            dateFormat: "d-m-Y H:i"
        });
        $('#apicrudModal').modal('show');
    });
    //Hago una función para meter el texto de las validaciones
    function validate(target, text){
        target.parent('.form-group').addClass('has-error').append(`<p class="notice">${text}</p>`)
    }
    //Borro los mensajes de validación al hacer focus
    $('#res_form input').on('focus', function(){
        $(this).siblings('.notice').remove();
        $(this).parent('.form-group').removeClass('has-error');
    })
    //También para el datepicker al activarse
    $('#res_form #datetimePicker').on('mousedown', function(){
        $(this).siblings('.notice').remove();
        $(this).parent('.form-group').removeClass('has-error');
    })
    //Recogemos el submit del form
    $('#res_form').on('submit', function(event){
        event.preventDefault();
        //Validamos los campos
        if($('#nombre').val() == '')
        {
            validate($('#nombre'), "Escribe tu nombre");
        }
        else if($('#apellidos').val() == '')
        {
            validate($('#apellidos'),"Escribe tus apellidos");
        }
        else if($('#telefono').val() == '')
        {
            validate($('#telefono'),"Escribe tu teléfono");
        }
        else if($('#fecha').val() == '')
        {
            validate($('#datetimePicker'),"Introduce la fecha y la hora")
        } else if(Math.round(new Date($('#fecha').val())) <= (Math.round((new Date().getTime()) + (24 * 3600000))))
        {
            validate($('#datetimePicker'),"La fecha y la hora de reserva tienen que ser 24h. posteriores a la fecha y hora actual")
        }else if($('#comensales').val() == '')
        {
            validate($('#comensales'),"Introduce los comensales")
        }else if($('#comensales').val() > 10 || $('#comensales').val() <= 0){
            validate($('#comensales'),"Tienes que elegir de 1 a 10 comensales")
        }
        else
        {
            const form_data = $(this).serialize();
            $.ajax({
                url:"../back/actions/action.php",
                method:"POST",
                data:form_data,
                success:function(data)
                {
                    fetch_data();
                    $('#res_form').trigger("reset");
                    $('#apicrudModal').modal('hide');
                    if(data == 'insert')
                    {
                        alert("Has añadido tu reserva");
                    }
                    if(data == 'update')
                    {
                        alert("Has modificado tu reserva");
                    }
                }
            });
        }
    });
    //Editar reserva
    $(document).on('click', '.edit', function(){
        const id = $(this).attr('id');
        const action = 'fetch_single';
        $.ajax({
            url:"../back/actions/action.php",
            method:"POST",
            data:{id:id, action:action},
            dataType:"json",
            success:function(data)
            {
                $('#datetimePicker').flatpickr({
                    wrap: true,
                    locale: "es",
                    enableTime: true,
                    minTime: "13:00",
                    maxTime: "16:00",
                    minDate: new Date().fp_incr(1),
                    time_24hr: true,
                    dateFormat: "d-m-Y H:i",
                    defaultDate: flatpickr.formatDate(new Date(data.fecha), "d-m-Y H:i")
                });
                $('#hidden_id').val(id);
                $('#nombre').val(data.nombre);
                $('#apellidos').val(data.apellidos);
                $('#telefono').val(data.telefono);
                $('#fecha').val(flatpickr.formatDate(new Date(data.fecha), "d-m-Y H:i"));
                $('#comensales').val(data.comensales);
                $('#comentarios').val(data.comentarios);
                $('#action').val('update');
                $('#button_action').val('Actualizar');
                $('.modal-title').text('Editar Reserva');
                $('#apicrudModal').modal('show');
            }
        })
    });
    //Borrar reserva
    $(document).on('click', '.delete', function(){
        const id = $(this).attr("id");
        const action = 'delete';
        if(confirm("¿Estás seguro de que quieres eliminar esta reserva?"))
        {
            $.ajax({
                url:"../back/actions/action.php",
                method:"POST",
                data:{id:id, action:action},
                success:function(data)
                {
                    fetch_data();
                    alert("Reserva eliminada");
                }
            });
        }
    });
    //Ver detalle
    $(document).on('click', '.view', function(){
        const id = $(this).attr("id");
        const action = 'fetch_single';
        $.ajax({
            url:"../back/actions/action.php",
            method:"POST",
            data:{id:id, action:action},
            dataType:"json",
            success:function(data)
            {   $('#detail_numero').text(id);
                $('.modal-title').text(`Ver Reserva ${id}`);
                $('#detail_nombre').text(data.nombre);
                $('#detail_apellidos').text(data.apellidos);
                $('#detail_telefono').text(data.telefono);
                $('#detail_fecha').text(flatpickr.formatDate(new Date(data.fecha), "d-m-Y H:i"));
                $('#detail_comensales').text(data.comensales);
                $('#detail_comentarios').text(data.comentarios);
                $('#detailModal').modal('show');
            }
        })
    });
    //Comprobamos cada minutos que no hay nuevas reservas y también al hacerse el fetch si hay en las próximas 24h.
    setTimeout(function(){
        fetch_data();
    }, 60000);
});
