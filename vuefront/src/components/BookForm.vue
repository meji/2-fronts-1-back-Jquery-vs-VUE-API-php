<template>
    <b-modal id="formModal" @hide="resetForm" hide-footer>
        <template v-slot:modal-title>
            Rellenar reserva
        </template>
        <form method="post" id="res_form" @submit.prevent="onSubmit">
            <p class="help-block">La fecha y la hora de reserva ha de ser 24h posterior a la fecha y hora actual</p>
            <div class="form-group">
                <input v-model="nombre"  type="text" name="nombre" id="nombre" class="form-control" placeholder ="nombre"/>
            </div>
            <div class="form-group">
                <input v-model="apellidos" type="text" name="apellidos" id="apellidos" class="form-control"  placeholder ="apellidos"/>
            </div>
            <div class="form-group">
                <input type="tel" v-model="telefono" name="telefono" id="telefono" class="form-control" placeholder="Teléfono"/>
            </div>
            <div class="form-group">
                <label>Select a date</label>
                <div class="input-group">
                    <flat-pickr
                            v-model="fecha"
                            :config="config"
                            class="form-control"
                            placeholder="Seleccionar Fecha y Hora"
                            name="date">
                    </flat-pickr>
                    <div class="input-group-btn">
                        <button class="btn btn-default" type="button" title="Toggle" data-toggle>
                            <i class="fa fa-calendar">
                                <span aria-hidden="true" class="sr-only">Toggle</span>
                            </i>
                        </button>
                        <button class="btn btn-default" type="button" title="Clear" data-clear>
                            <i class="fa fa-times">
                                <span aria-hidden="true" class="sr-only">Clear</span>
                            </i>
                        </button>
                    </div>
                </div>
            </div>
            <div class="form-group">
                <input type="number" v-model="comensales" name="comensales" id="comensales" class="form-control" placeholder="Comensales" max="10"/>
                <span class="notice"></span>
            </div>
            <div class="form-group">
                <textarea id="comentarios" v-model="comentarios" class="form-control" name="comentarios" placeholder="mensaje"></textarea>
            </div>
            <input type="hidden" name="action" id="action" value="insert" />
            <input type="submit" name="button_action" id="button_action" class="btn btn-info" value="Enviar" />
        </form>
    </b-modal>
</template>

<script>
    import axios from "axios";
    import flatPickr from 'vue-flatpickr-component';
    import flatpickr from "flatpickr";
    import 'flatpickr/dist/flatpickr.css';
    import {Spanish} from 'flatpickr/dist/l10n/es.js';
    const qs = require('querystring')

    export default {
        name: "BookForm",
        components: {flatPickr},
        props: {
            modifyId:null
        },
        data () {
            return {
                nombre: null,
                apellidos: null,
                telefono: null,
                fecha: null,
                comensales: null,
                comentarios: null,
                date: new Date(),
                config: {
                    wrap: true,
                    locale: Spanish,
                    enableTime: true,
                    minTime: "13:00",
                    maxTime: "16:00",
                    minDate: new Date().fp_incr(1),
                    time_24hr: true,
                    altInput: true,
                    altFormat: "D d-m-Y H:i",
                    dateFormat: "d-m-Y H:i"
                },
            }
        },
        methods:{
            onSubmit(){
                const requestBody = {
                    nombre: this.nombre,
                    apellidos:this.apellidos,
                    telefono:this.telefono,
                    fecha: flatpickr.formatDate(flatpickr.parseDate(this.fecha), "Y-m-d H:i:S"),
                    comensales:this.comensales,
                    comentarios:this.comentarios,
                    id: this.modifyId
                }
                console.log(this.fecha, flatpickr.formatDate(flatpickr.parseDate(this.fecha), "Y-m-d H:i:S"))
                axios.post(process.env.VUE_APP_API_URL + `api/test_api.php?action=${this.modifyId ? 'update' : 'insert'}`, qs.stringify(requestBody), {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                })
                    .then(response =>
                        console.log(response))
                    .catch((err)=>
                        console.log(err))
                    .finally(()=>{
                        alert(this.modifyId ? 'Reseva modificada' : 'Reserva creada')
                        this.resetForm();
                        this.$emit('fetchData')
                    })
            },
            resetForm(){
                this.nombre= null,
                this.apellidos= null,
                this.telefono= null,
                this.fecha= null,
                this.comensales= null,
                this.comentarios= null,
                this.$bvModal.hide('formModal')
            }
        },
        mounted (){
            if(this.modifyId){
                axios.post(process.env.VUE_APP_API_URL + `api/test_api.php?action=fetch_single&id=${this.modifyId}`)
                    .then(response => {
                        const reserva = ( response.data)
                        this.nombre = reserva.nombre
                        this.apellidos = reserva.apellidos
                        this.telefono = reserva.telefono
                        this.fecha = reserva.fecha
                        this.comensales = reserva.comensales
                        this.comentarios = reserva.comentarios
                    })
                    .catch(error => {
                        console.log(error)
                    })
            }else{
               this.resetForm()
            }
            this.$bvModal.show('formModal')
        }
    }
</script>

<style scoped>

</style>