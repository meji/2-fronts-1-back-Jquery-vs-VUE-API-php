<template>
    <tr v-if="reserva.id">
        <td>{{reserva.nombre}}</td>
        <td>{{reserva.apellidos}}</td>
        <td>{{reserva.telefono}}</td>
        <!--        <td>${flatpickr.formatDate(new Date(item.fecha), "d-m-Y H:i")}</td>-->
        <td>{{reserva.comensales}}</td>
        <td>{{reserva.comentarios}}</td>
        <td>
            <button type="button" name="edit" class="btn btn-warning btn-xs edit">Modificar</button>
        </td>
        <td>
            <button type="button" name="delete" class="btn btn-danger btn-xs delete" @click="$emit('deleteItem', reserva.id)">Borrar</button>
        </td>
        <td>
            <button type="button" name="ver" class="btn btn-xs btn-primary view" @click="$emit('showDetail' , reserva.id)">Ver Detalle
            </button>
        </td>
    </tr>
</template>
<script>
    export default {
        name: 'ReservaItem',
        props: {
            reserva: {}
        }
    }
</script>