import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue';
import './assets/global.css'
import axios from "axios";
import VueRouter from "vue-router";
import router from './router'
import store from './store';

Vue.config.productionTip = false;
Vue.prototype.$axios = axios;
Vue.prototype.$httpUrl = 'http://localhost:8090'
//Vue.use(ElementUI);
Vue.use(ElementUI, {size: 'small'});
Vue.use(VueRouter);
new Vue({
    router,
    store,
    el: '#app',
    render: h => h(App)
});