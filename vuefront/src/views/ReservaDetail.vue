<template>
    <b-modal id="detailModal" hide-footer>
        <template v-slot:modal-title :id="this.reservaDetailContent.id" >
            Detalle de la reserva número {{id}}
        </template>
        <div class="modal-body details">
            <ul class="list-group">
                <li class="list-group-item">Nombre: <strong id="detail_nombre">{{this.reservaDetailContent.nombre}}</strong></li>
                <li class="list-group-item">Apellidos:<strong id="detail_apellidos">{{this.reservaDetailContent.apellidos}}</strong></li>
                <li class="list-group-item">Teléfono: <strong id="detail_telefono">{{this.reservaDetailContent.telefono}}</strong></li>
<!--                        <li class="list-group-item">Fecha y hora: <strong id="detail_fecha">${flatpickr.formatDate(new Date(item.fecha), "d-m-Y H:i")}</strong></li>-->
                <li class="list-group-item">Comensales: <strong id="detail_comensales">{{this.reservaDetailContent.comensales}}</strong></li>
                <li class="list-group-item">Comentarios: <strong id="detail_comentarios">{{this.reservaDetailContent.comentarios}}</strong></li>
            </ul>
        </div>

    </b-modal>
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
            });
            this.$bvModal.show('detailModal')
        }

    }
</script>