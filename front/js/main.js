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
        $('.modal-title').text('Add Data');
        $('#datetimePicker').flatpickr({
            wrap: true,
            locale: "es",
            enableTime: true,
            minTime: "13:00",
            maxTime: "16:00"
        });
        $('#apicrudModal').modal('show');
    });

    $('#res_form').on('submit', function(event){
        event.preventDefault();
        if($('#nombre').val() == '')
        {
            alert("Escribe tu nombre");
        }
        else if($('#apellidos').val() == '')
        {
            alert("Escribe tus apellidos");
        }
        else if($('#telefono').val() == '')
        {
            alert("Escribe tu teléfono");
        }
        else if($('#comensales').val() == '')
        {
            alert("Introduce los comensales");
        }
        else if($('#fecha').val() == '')
        {
            alert("Introduce Fecha y Hora");
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
