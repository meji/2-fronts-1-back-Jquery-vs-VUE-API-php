$(document).ready(function(){
    //Traemos los datos al cargar la página
    fetch_data();
    function fetch_data()
    {
        $.ajax({
            url:"../actions/fetch.php",
            success:function(data)
            {
                $('tbody').html(data); //Pintamos los datos
            }
        }).done(function() {
        });
    }
    //Meto funcionalidad para el datetimePicker


    //Al hacer click en nueva reserva:
    $('#nueva_reserva').click(function(){
        $('#action').val('insert'); //Definimos la acción
        $('#button_action').val('Reservar');//Añadimos texto de Añadir reserva al botón del modal
        $('.modal-title').text('Nueva reserva');
        $('#datetimePicker').flatpickr({
            wrap: true,
            locale: "es",
            enableTime: true,
            minTime: "13:00",
            maxTime: "16:00"
        });
        $('#apicrudModal').modal('show');
    });
    //Hago una función para meter el texto de las validaciones
    function validate(target, text){
        target.parent('.form-group').append(`<p class="notice">${text}</p>`)
    }
    //Borro los mensajes de validación al hacer focus
    $('#res_form input').on('focus', function(){
        $(this).siblings('.notice').remove()
    })

    $('#res_form').on('submit', function(event){
        event.preventDefault();
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
        else if($('#comensales').val() == '')
        {
            validate($('#comensales'),"Introduce los comensales")
        }else if($('#comensales').val() > 10 || $('#comensales').val() <= 0){
            validate($('#comensales'),"Tienes que elegir de 1 a 10 comensales")
        }
        else if($('#fecha').val() == '')
        {
            validate($('#fecha'),"Introduce la fecha y la hora")
        }
        else
        {
            const form_data = $(this).serialize();
            $.ajax({
                url:"../actions/action.php",
                method:"POST",
                data:form_data,
                success:function(data)
                {
                    fetch_data();
                    $('#res_form')[0].reset();
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

    $(document).on('click', '.edit', function(){
        $('#datetimePicker').flatpickr({
            wrap: true,
            locale: "es",
            enableTime: true,
            minTime: "13:00",
            maxTime: "16:00"
        });
        const id = $(this).attr('id');
        const action = 'fetch_single';
        $.ajax({
            url:"../actions/action.php",
            method:"POST",
            data:{id:id, action:action},
            dataType:"json",
            success:function(data)
            {
                $('#hidden_id').val(id);
                $('#nombre').val(data.nombre);
                $('#apellidos').val(data.apellidos);
                $('#telefono').val(data.telefono);
                $('#fecha').val(data.fecha);
                $('#comensales').val(data.comensales);
                $('#comentarios').text(data.comentarios);
                $('#action').val('update');
                $('#button_action').val('Actualizar');
                $('.modal-title').text('Edit Data');
                $('#apicrudModal').modal('show');
            }
        })
    });

    $(document).on('click', '.delete', function(){
        const id = $(this).attr("id");
        const action = 'delete';
        if(confirm("¿Estás seguro de que quieres eliminar esta reserva?"))
        {
            $.ajax({
                url:"../actions/action.php",
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

});
