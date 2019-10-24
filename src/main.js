import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
// import qs from 'qs'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Utils from './components/utiljs/util'

Vue.use(VueAxios,axios);
axios.defaults.headers.post['Content-Type'] = 'application/json';
// axios.defaults.baseURL= xxx;  xxx放你们的前缀相同的url
Vue.config.productionTip = false
Vue.use(ElementUI)

Vue.prototype.utils=Utils;


new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
