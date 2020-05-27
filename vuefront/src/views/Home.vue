<template>
  <main class="container">
    <h1 class="text-center">Bienvenidos al restaurante de la UOC</h1>
    <p class="text-center">
      <button class="notice24"></button>
    </p>
    <table class="table table-bordered table-striped" >
      <tr>
        <th>Nombre</th>
        <th>Apellidos</th>
        <th>Teléfono</th>
        <th>Fecha</th>
        <th>Comensales</th>
        <th>Comentarios</th>
        <th>Borrar</th>
        <th>Modificar</th>
      </tr>
      <ReservaItem v-for="reservaItem in reservas" :key="reservaItem.id" :reserva="reservaItem"  @showDetail="showDetail" @deleteItem="deleteItem" @modifyItem="modifyItem"/>
    </table>
    <b-button id="new-book-btn" @click="this.newBooking">Nueva Reserva</b-button>
    <ReservaDetail v-if="this.detailId" :id="this.detailId" :key="this.detailId + this.randomKey"></ReservaDetail>
    <BookForm v-if="this.showForm" :key="this.randomFormKey" :modifyId="this.modifyId" @fetchData="fetchData"></BookForm>
  </main>
</template>

<script>
  import axios from "axios";
  import ReservaItem from "../components/ReservaItem";
  import ReservaDetail from "../components/ReservaDetail";
  import BookForm from "../components/BookForm";

  export default {
  name: "Home",
  components: {BookForm, ReservaDetail, ReservaItem},
  data () {
    return {
      reservas: null,
      detailId:null,
      randomKey: null,
      randomFormKey: null,
      reservaEditable: null,
      showForm: null,
      modifyId: null
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
              })
              .finally(() => this.loading = false)
    },
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
    }
  }
};


</script>
