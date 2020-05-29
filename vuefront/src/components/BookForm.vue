<template>
    <b-modal id="formModal" @hide="resetForm" hide-footer>
        <template v-slot:modal-title>
            Rellenar reserva
        </template>
        <form method="post" id="res_form" @submit.prevent="onSubmit">
            <p class="help-block">La fecha y la hora de reserva ha de ser 24h posterior a la fecha y hora actual</p>
            <div class="form-group">
                <input v-model="nombre"  type="text" name="nombre" id="nombre" class="form-control" placeholder ="nombre" required/>
            </div>
            <div class="form-group">
                <input v-model="apellidos" type="text" name="apellidos" id="apellidos" class="form-control"  placeholder ="apellidos" required/>
            </div>
            <div class="form-group">
                <input type="tel" v-model="telefono" name="telefono" id="telefono" pattern='^((\\+34[\\s])|(\\(\\+34\\)|\\+34|0034[\\s]?))?[9|8|7|6][0-9]{2}([0-9]{6}|([\\s][0-9]{3}){2}|([\\s][0-9]{2}){3})$' class="form-control" placeholder="Teléfono" required/>
            </div>
            <div class="form-group">
                <label>Select a date</label>
                <div :class="[{'has-error':this.dateError},'input-group']">
                    <flat-pickr
                            v-model="fecha"
                            :config="config"
                            class="form-control"
                            placeholder="Seleccionar Fecha y Hora"
                            name="date"
                    >
                    </flat-pickr>
                    <div class="input-group-addon" data-toggle="">
                        <b-button>
                            <b-icon-calendar3/>
                        </b-button>
                    </div>
                    <div class="input-group-btn">
                        <button class="btn btn-default" type="button" title="Clear" data-clear>
                            <i class="fa fa-times">
                                <span aria-hidden="true" class="sr-only">Clear</span>
                            </i>
                        </button>
                    </div>
                </div>
                <p class="notice" v-if="this.dateError">La fecha y la hora ha de ser 24 horas posterior a la fecha y hora actual</p>
            </div>
            <div class="form-group">
                <input type="number" v-model="comensales" name="comensales" id="comensales" class="form-control" placeholder="Comensales" max="10" min="1" required/>
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
    import {BIconCalendar3} from 'bootstrap-vue'
    import {Spanish} from 'flatpickr/dist/l10n/es.js';
    const qs = require('querystring')

    export default {
        name: "BookForm",
        components: {flatPickr, BIconCalendar3},
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
                dateError: null,//Para mensaje error fecha y validar el form
                config: { //configurador del datepicker
                    wrap: true,
                    locale: Spanish,
                    enableTime: true,
                    minTime: "13:00",
                    maxTime: "23:30",
                    minDate: new Date().fp_incr(1),
                    time_24hr: true,
                    altInput: true,
                    altFormat: "D d-m-Y H:i",
                    dateFormat: "Y-m-d H:i:S"
                },
            }
        },
        methods:{
            onSubmit(){
                //Validamos la fecha, el resto se valida con el propio html del form
                if(this.validateDate()){
                    this.dateError= true;
                }else {
                    //Cuando validamos el form
                    const requestBody = { //Lo que va en la petición
                        nombre: this.nombre,
                        apellidos: this.apellidos,
                        telefono: this.telefono,
                        fecha: flatpickr.formatDate(flatpickr.parseDate(this.fecha, 'Y-m-d H:i:S'), "Y-m-d H:i:S"),
                        comensales: this.comensales,
                        comentarios: this.comentarios,
                        id: this.modifyId
                    }
                    axios.post(process.env.VUE_APP_API_URL + `api/test_api.php?action=${this.modifyId ? 'update' : 'insert'}`, qs.stringify(requestBody), {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    })
                        .then()
                        .catch((err) =>
                            console.log(err))
                        .finally(() => {
                            alert(this.modifyId ? 'Reseva modificada' : 'Reserva creada')
                            this.resetForm(); //Limpiamos el form
                            this.$emit('fetchData') //Recargamos el listado
                        })
                }
            },
            resetForm(){ //Resetea el formulario
                this.nombre= null,
                this.apellidos= null,
                this.telefono= null,
                this.fecha= null,
                this.comensales= null,
                this.comentarios= null,
                this.$bvModal.hide('formModal')
            },
            validateDate(){
                if(Math.round(new Date(this.fecha)) <= (Math.round((new Date().getTime()) + (24 * 3600000)))){
                    return true
                }return false
            }
        },
        mounted (){
            if(this.modifyId){ // si hay una id para modificar una reserva, se muestran sus datos al cargar componente, traemos los datos de la bbdd
                axios.post(process.env.VUE_APP_API_URL + `api/test_api.php?action=fetch_single&id=${this.modifyId}`)
                    .then(response => {
                        const reserva = ( response.data)
                        this.nombre = reserva.nombre
                        this.apellidos = reserva.apellidos
                        this.telefono = reserva.telefono
                        this.fecha = flatpickr.formatDate(new Date(reserva.fecha), "Y-m-d H:i:S")
                        this.comensales = reserva.comensales
                        this.comentarios = reserva.comentarios
                    })
                    .catch(error => {
                        console.log(error)
                    })
            }else{
               this.resetForm() //Sino reseteamos el form al cargar el componente
            }
            this.$bvModal.show('formModal') //mostramos el modal
        }
    }
</script>

<style>
    .notice{color: #ff0000; font-size: 0.8rem; }
    .has-error input, .has-error .form-control{border-color: red}
</style>