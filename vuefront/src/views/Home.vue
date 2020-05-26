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
      <ReservaItem v-for="reservaItem in reservas" :key="reservaItem.id" :reserva="reservaItem"  @showDetail="showDetail" @deleteItem="deleteItem"/>
    </table>
    <ReservaDetail ref="modal" v-if="this.detailId" :id="this.detailId" :key="this.detailId + this.randomKey"></ReservaDetail>
  </main>
</template>

<script>
  import axios from "axios";
  import ReservaItem from "./ReservaItem";
  import ReservaDetail from "./ReservaDetail";

  export default {
  name: "Home",
  components: {ReservaDetail, ReservaItem},
  data () {
    return {
      reservas: null,
      detailId:null,
      randomKey: null
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
    }
  }
};


</script>
