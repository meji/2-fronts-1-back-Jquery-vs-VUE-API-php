<template>
    <div :key="this.id">
        Puton
        <p>{{this.reserva.nombre}}</p>
        <p>{{this.reserva.apellidos}}</p>
        <p>{{this.reserva.telefono}}</p>
        <!--        <td>${flatpickr.formatDate(new Date(item.fecha), "d-m-Y H:i")}</td>-->
        <p>{{this.reserva.comensales}}</p>
        <p>{{this.reserva.comentarios}}</p>
    </div>
</template>
<script>
    import axios from "axios";
    export default {
        name: 'ReservaDetail',
        props: {
            id: null
        },
        data () {
            return {
                reserva: {}
            }
        },
        mounted (){
        axios.post(process.env.VUE_APP_API_URL + `api/test_api.php?action=fetch_single&id=${this.id}`)
            .then(response => {
                this.reserva = ( response.data)
            })
            .catch(error => {
                console.log(error)
                this.errored = true
            })
            .finally(() => this.loading = false)
        }
    }
</script>