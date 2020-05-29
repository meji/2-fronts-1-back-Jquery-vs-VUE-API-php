<template>
  <main class="container">
    <h1 class="text-center">Bienvenidos al restaurante de la UOC</h1>
    <!-- Tabs, hay tabs que muestran filtros -->
    <b-card>
      <b-tabs pills>
        <b-tab title="Ver todos" active="" @click="this.viewAll"></b-tab>
        <b-tab title="Filtrar las próximas 24h" v-if="this.next24Reservas" @click="this.order24"></b-tab>
        <b-tab title="Filtrar por cualquier campo" @click="this.viewAll" >
          <div>
            <b-form-group
                label="Filtrar por lo que quieras"
                label-cols-sm="3"
                label-align-sm="right"
                label-size="sm"
                label-for="filterInput"
                class="mt-3"
        >
          <b-input-group size="md">
            <b-form-input
                    v-model="filter"
                    type="search"
                    id="filterInput"
                    placeholder="Busca por cualquier campo"
            ></b-form-input>
            <b-input-group-append>
              <b-button :disabled="!filter" @click="filter = ''">Limpiar</b-button>
            </b-input-group-append>
          </b-input-group>
        </b-form-group>
          </div>
        </b-tab>
        <b-tab title="Filtrar por nombre y apellidos solo">
          <b-form-group
                  label="Filtrar por nombre y apellidos"
                  label-cols-sm="3"
                  label-align-sm="right"
                  label-size="sm"
                  label-for="filterInput"
                  class="mt-3"
          >
            <b-input-group size="md">
              <b-form-input
                      v-model.lazy="queryString"
                      type="search"
                      id="filterInput"
                      placeholder="Busca por nombre y apellidos"
                      @keyup="filterByNameSecondName"
              ></b-form-input>
              <b-input-group-append>
                <b-button :disabled="!queryString" @click="queryString = ''" @>Limpiar</b-button>
              </b-input-group-append>
            </b-input-group>
          </b-form-group>
        </b-tab>
        <b-tab title="Filtrar por fecha" @click="this.viewAll" >
          <b-form-group>
            <label>Selecciona una fecha</label>
            <div class="input-group">
              <flat-pickr
                      :key="this.randomKey"
                      v-model="filterByDate"
                      :config="config"
                      class="form-control"
                      placeholder="Elige un rango de fechas"
                      name="filter"
                      mode="range"
              >
              </flat-pickr>
              <div class="input-group-addon" data-toggle="">
                <b-button>
                  <b-icon-calendar3/>
                </b-button>
              </div>
              <b-button @click="fetchData">Filtrar</b-button>
            </div>
          </b-form-group>
        </b-tab>
      </b-tabs>
    </b-card>
    <b-table striped hover
             :items="this.reservas"
             :fields="this.fields"
             sort-icon-left
             responsive="sm"
             :filter="filter"
    >
      <template v-slot:cell(borrar)="row">
        <b-button size="sm" @click="deleteItem(row.item.id)" variant="danger">
          Borrar
        </b-button>
      </template>
      <template v-slot:cell(fecha)="row">
        {{formatDate(row.item.fecha)}}
      </template>
      <template v-slot:cell(modificar)="row">
        <b-button size="sm" @click="modifyItem(row.item.id)" variant="warning">
          Modificar
        </b-button>
      </template>

      <template v-slot:cell(detalle)="row">
        <b-button size="sm" @click="showDetail(row.item.id)" variant="primary">
          Detalle
        </b-button>
      </template>
    </b-table>
    <!-- Boton nueva reserva-->
    <b-button id="new-book-btn" variant="success" @click="this.newBooking">Nueva Reserva</b-button>
    <!-- Componente de detalle en modal-->
    <ReservaDetail v-if="this.detailId" :id="this.detailId" :key="this.detailId + this.randomKey"></ReservaDetail>
    <!-- Componente de form en modal-->
    <BookForm v-if="this.showForm" :key="this.randomFormKey" :modifyId="this.modifyId" @fetchData="fetchData"></BookForm>
  </main>
</template>

<script>
  import axios from "axios"; //Para hacer las peticiones fetch
  import flatPickr from 'vue-flatpickr-component'; //Para el componente fecha hora
  import flatpickr from "flatpickr"; //Para los métodos parseData y formatData
  import {Spanish} from 'flatpickr/dist/l10n/es.js'; //Leguaje del date picker
  import {BIconCalendar3} from 'bootstrap-vue'
  import 'flatpickr/dist/flatpickr.css'; // Css de date picker
  import ReservaDetail from "../components/ReservaDetail"; //Componente de Detalle de reserva
  import BookForm from "../components/BookForm"; //Componente de Formulario

  export default {
  name: "Home",
  components: {BookForm, ReservaDetail, flatPickr, BIconCalendar3},
  data () {
    return {
      reservas: null, //reservas
      detailId:null, //Id para el detalle
      randomKey: null, //Generador de Key para refrescar componente detalle
      randomFormKey: null, //Generador de Key para refrescar componente form
      showForm: null, //Para mostrar o no el form
      modifyId: null, //Id de reserva a modificar
      next24Reservas: null, //para mostrar el boton de 24 h.
      filter: null, // v-model filter
      filterByDate:null, //Para el filter by date, en el fetch si tiene valor tras el fetch filtra por las fechas elegidas
      queryString: null, // Paa buscar por Nombre y Apellidos solo
      config: {
        wrap: true,
        locale: Spanish,
        minDate: 'today',
        dateFormat: "d-m-Y",
        mode:"range"
      },
      fields:[ //Configuramos la cabecera de la tabla para decir si son ordenables
        {
          key: 'nombre',
          sortable: true,
          label: 'Nombre'
        },
        {
          key: 'apellidos',
          sortable: true,
          label: 'Apellidos'
        },
        {
          key: 'telefono',
          sortable: true,
          label: 'Teléfono'
        },
        {
          key: 'fecha',
          sortable: true,
          label: 'Fecha y Hora'
        },
        {
          key: 'comensales',
          sortable: true,
          label: "Comensales"
        },
        {
          key: 'comentarios',
          sortable: true,
          label: 'Comentarios',
        },
        {
          key: 'modificar',
          label:'Modificar',
          sortable: false
        },
        {
          key: 'borrar',
          label:'Borrar',
          sortable: false
        },
        {
          key: 'detalle',
          label:'Ver detalle',
          sortable: false
        }
      ]
    }
  },
  mounted () {
    this.fetchData() //cargamos los datos
  },
    watch:{
      queryString : function(val){
        val? this.filterByNameSecondName(val) : this.fetchData()
      }
    },
  methods:{
    fetchData(){ //cargamos los datos
      this.filter = null; //reseteamos los filtros
      axios(process.env.VUE_APP_API_URL+'actions/fetch.php') //traemos los datos
        .then(response => {
          this.reservas = (response.data)
        })
        .catch(error => {
          console.log(error)
        }).finally(()=> {
          this.orderFuture(); //Ordenamos solo de hoy en adelante
          if ((this.reservas.filter(reserva => (Math.round(new Date(reserva.fecha).getTime()) >= Math.round(new Date().getTime()) && Math.round(new Date(reserva.fecha).getTime()) <= Math.round(new Date().getTime() + (24*3600000))))).length>0) {
            this.next24Reservas = true; //Activamos botón de 24 horas si hay reservas en 24h
            this.next24Reservas = true; //Activamos botón de 24 horas si hay reservas en 24h
          }
          if(this.filterByDate){
            const filterByDateInit = this.filterByDate.split(' a ')[0]
            const filterByDateEnd= this.filterByDate.split(' a ')[1]
            this.reservas = this.reservas.filter(reserva => (flatpickr.formatDate(flatpickr.parseDate(reserva.fecha), 'd-m-Y') >= filterByDateInit)&&(flatpickr.formatDate(flatpickr.parseDate(reserva.fecha), 'd-m-Y') <= filterByDateEnd))
          }
        }
    )},
    showDetail(id){ //Pasamos el id a detailId para mostrar el detalle y reseteamos el componente con un nuevo key
     this.detailId = id;
     this.randomKey = Math.floor(Math.random()*1000)
    },
    deleteItem(id) {
      if(confirm("¿Estás seguro de que quieres eliminar esta reserva?")) { //alert para confirmar borrar
          axios.post(process.env.VUE_APP_API_URL + `api/test_api.php?action=delete&id=${id}`).then(response => { //petición para borrar
            console.log(response.data)
          })
          .catch(error => {
            console.log(error)
          })
          .finally(() =>{
              alert("Reserva eliminada");
              this.fetchData() // Volvemos a pintar todo
            }
          )
      }
    },
    modifyItem(id) {
      this.modifyId = id // Pasamos el id para modificar
      this.showForm = true; // mostramos el form
      this.randomFormKey += 1 //reseteamos el kwy del componente
    },
    newBooking(){ //para hacer nueva reserva
      this.showForm = true; //mostramos el form
      this.randomFormKey += 1 // asignamos nueva key
      this.modifyId = null; //reseteamos el modify por si habia uno antes
    },
    orderFuture(){ //Ordenamos las reservas futuras por fecha desde hoy
      this.reservas = this.reservas.filter(reserva => (Math.round(new Date(reserva.fecha).getTime()) >= Math.round(new Date().getTime()))).sort(function(a,b){
        const dateA=new Date(a.fecha), dateB=new Date(b.fecha)
        return dateA-dateB //sort by date ascending
      })
    },
    order24(){ //Filtramos las reservas en 24h.
      this.reservas = this.reservas.filter(reserva => (Math.round(new Date(reserva.fecha).getTime()) >= Math.round(new Date().getTime()) && Math.round(new Date(reserva.fecha).getTime()) <= Math.round(new Date().getTime() + (24*3600000))))
    },
    viewAll(){ //Para resetear toda la table
      this.filter=null;
      this.filterByDate= null;
      this.fetchData();
    },
    formatDate(date){ //Método para formatear la fecha que se pinta en la tabla, es indispensable para los filtros y demás.
      return flatpickr.formatDate(new Date(date), "d-m-Y H:i")
    },
    filterByNameSecondName(e){
      if (e.key === "Delete" || e.key === "Backspace"){ //Si borramos texto vuelve a cargar los datos
        this.fetchData()
      }else{
        this.reservas = this.reservas.filter(reserva=> { //Filtramos los datos con Nombre y apellidos
          const string = reserva.nombre + ' ' + reserva.apellidos
          if (string.includes(this.queryString)) {
            return true
          }
        })
      }
    }
  }
}


</script>
