<template>
  <main>
    <h1>Bienvenido al restaurante de la UOC</h1>
    <table>
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
      <ReservaItem v-for="reserva in reservas" :key="reserva.id" :reserva="reserva" @showDetail="showDetail"/>
    </table>
    <ReservaDetail v-if="id" :id="this.id" :key="this.id"></ReservaDetail>
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
      id:null,
      loading: true,
      errored: false,
    }
  },
  mounted () {
    axios(process.env.VUE_APP_API_URL+'actions/fetch.php')
            .then(response => {
              this.reservas = (response.data)
              console.log(response.data)
            })
            .catch(error => {
              console.log(error)
              this.errored = true
            })
            .finally(() => this.loading = false)
  },
  methods:{
    showDetail(id){
     this.id = id;
    }
  }
};


</script>
