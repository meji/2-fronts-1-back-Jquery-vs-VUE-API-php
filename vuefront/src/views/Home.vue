<template>
  <main class="container">
    <h1 class="text-center">Bienvenidos al restaurante de la UOC</h1>
    <b-card>
      <b-tabs pills>
        <b-tab title="Ver todos" active="" @click="this.fetchData"></b-tab>
        <b-tab title="Filtrar las próximas 24h" v-if="this.next24Reservas" @click="this.order24"></b-tab>
        <b-tab title="Filtrar por nombre"></b-tab>
        <b-form-group
                label="Filtrar por lo que quieras"
                label-cols-sm="3"
                label-align-sm="right"
                label-size="sm"
                label-for="filterInput"
                class="mb-0"
        >
          <b-input-group size="sm">
            <b-form-input
                    v-model="filter"
                    type="search"
                    id="filterInput"
                    placeholder="Busca lo que quieras"
            ></b-form-input>
            <b-input-group-append>
              <b-button :disabled="!filter" @click="filter = ''">Limpiar</b-button>
            </b-input-group-append>
          </b-input-group>
        </b-form-group>
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
    <b-button id="new-book-btn" @click="this.newBooking">Nueva Reserva</b-button>
    <ReservaDetail v-if="this.detailId" :id="this.detailId" :key="this.detailId + this.randomKey"></ReservaDetail>
    <BookForm v-if="this.showForm" :key="this.randomFormKey" :modifyId="this.modifyId" @fetchData="fetchData"></BookForm>
  </main>
</template>

<script>
  import axios from "axios";
  // import ReservaItem from "../components/ReservaItem";
  import ReservaDetail from "../components/ReservaDetail";
  import BookForm from "../components/BookForm";

  export default {
  name: "Home",
  components: {BookForm, ReservaDetail},
  data () {
    return {
      reservas: null,
      detailId:null,
      randomKey: null,
      randomFormKey: null,
      reservaEditable: null,
      showForm: null,
      modifyId: null,
      next24Reservas: null,
      filter: null,
      fields:[
        {
          key: 'nombre',
          sortable: true,
          label: 'Nombre'
        },
        {
          key: 'apellidos',
          sortable: false,
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
          label: 'Comensales',
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
    this.fetchData()
  },
  methods:{
    fetchData(){
      axios(process.env.VUE_APP_API_URL+'actions/fetch.php')
        .then(response => {
          this.reservas = (response.data)
        })
        .catch(error => {
          console.log(error)
        }).finally(()=> {
          this.orderFuture();
          if (this.reservas.filter(reserva => (Math.round(new Date(reserva.fecha).getTime()) >= Math.round(new Date().getTime()) && Math.round(new Date(reserva.fecha).getTime()) <= Math.round(new Date().getTime() + (24 * 3600000))))) {
            this.next24Reservas = true;
            console.log('Hay reservas')
          }
        }
    )},
    showDetail(id){
     this.detailId = id;
     this.randomKey = Math.floor(Math.random()*1000)
    },
    deleteItem(id) {
      if(confirm("¿Estás seguro de que quieres eliminar esta reserva?")) {
          axios.post(process.env.VUE_APP_API_URL + `api/test_api.php?action=delete&id=${id}`).then(response => {
            console.log(response.data)
          })
          .catch(error => {
            console.log(error)
          })
          .finally(() =>{
              alert("Reserva eliminada");
              this.fetchData()
            }
          )
      }
    },
    modifyItem(id) {
      this.modifyId = id
      this.showForm = true;
      this.randomFormKey += 1
    },
    newBooking(){
      this.showForm = true;
      this.randomFormKey += 1
      this.modifyId = null;
    },
    orderFuture(){
      this.reservas = this.reservas.filter(reserva => (Math.round(new Date(reserva.fecha).getTime()) >= Math.round(new Date().getTime()))).sort(function(a,b){
        const dateA=new Date(a.fecha), dateB=new Date(b.fecha)
        return dateA-dateB //sort by date ascending
      })
    },
    order24(){
      this.reservas = this.reservas.filter(reserva => (Math.round(new Date(reserva.fecha).getTime()) >= Math.round(new Date().getTime()) && Math.round(new Date(reserva.fecha).getTime()) <= Math.round(new Date().getTime() + (24*3600000))))
    },
    filterByName(name){
      this.reservas = this.reservas.filter(reserva => reserva.name===name)
    }
  },
  computed: {
    sortOptions() {
      // Create an options list from our fields
      return this.fields
        .filter(f => f.sortable)
        .map(f => {
          return { text: f.label, value: f.key }
        })
    }
  }
}


</script>
