<template>
    <div>
        <p>{{this.reservaDetailContent.nombre}}</p>
        <p>{{this.reservaDetailContent.apellidos}}</p>
        <p>{{this.reservaDetailContent.telefono}}</p>
        <!--        <td>${flatpickr.formatDate(new Date(item.fecha), "d-m-Y H:i")}</td>-->
        <p>{{this.reservaDetailContent.comensales}}</p>
        <p>{{this.reservaDetailContent.comentarios}}</p>
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
                reservaDetailContent: {}
            }
        },
        mounted (){
        axios.post(process.env.VUE_APP_API_URL + `api/test_api.php?action=fetch_single&id=${this.id}`)
            .then(response => {
                this.reservaDetailContent = ( response.data)
            })
            .catch(error => {
                console.log(error)
            })
        }
    }
</script>