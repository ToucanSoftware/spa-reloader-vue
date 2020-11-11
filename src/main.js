import Vue from 'vue'
import App from './App.vue'
import SpaReloaderPlugin from './plugin/spa-reloader-plugin'
import SockJS from 'sockjs-client';
import Stomp from 'webstomp-client';

Vue.config.productionTip = false
Vue.use(SpaReloaderPlugin, {SockJS, Stomp, initHash: '246810'})


new Vue({
  render: h => h(App),
}).$mount('#app')

