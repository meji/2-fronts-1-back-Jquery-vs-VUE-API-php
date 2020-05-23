$(document).ready(function(){
    //Traemos los datos al cargar la página
    fetch_data();
    function fetch_data()
    {
        $.ajax({
            url:"../actions/fetch.php",
            success:function(data)
            {   let bodyTabla= "";

                JSON.parse(data).map((item) => {
                bodyTabla = bodyTabla +
                    `<tr>
                    <td>${item.nombre}</td>
                    <td>${item.apellidos}</td>
                    <td>${item.telefono}</td>
                    <td>${item.fecha}</td>
                    <td>${item.comensales}</td>
                    <td>${item.comentarios}</td>
                    <td><button type="button" name="edit" class="btn btn-warning btn-xs edit" id="${item.id}">Edit</button></td>
                    <td><button type="button" name="delete" class="btn btn-danger btn-xs delete" id="${item.id}">Delete</button></td>
                    </tr>`
            })
                $('tbody').html(bodyTabla); //Pintamos los datos
            }
        }).done(function() {
        });
    }
    //Meto funcionalidad para el datetimePicker


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
                $('#comentarios').val(data.comentarios);
                $('#action').val('update');
                $('#button_action').val('Actualizar');
                $('.modal-title').text('Editar Reserva');
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
