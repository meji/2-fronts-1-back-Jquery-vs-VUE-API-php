import Vue from "vue";
import AxiosPlugin from 'vue-axios-cors';
import App from "./App.vue";

Vue.config.productionTip = false;


Vue.use(AxiosPlugin)

new Vue({
  render: h => h(App)
}).$mount("#app");
