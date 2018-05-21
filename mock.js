官网示例：http://mockjs.com/examples.html
官网文档：https://github.com/nuysoft/Mock/wiki


1.安装vue-cli全局脚手架

1
npm install --global vue-cli
2.创建vue项目

1
vue init webpack mockjs<br>cd mockjs<br>npm install axios --save
3.安装mockjs

1
npm install mockjs --save-dev
4.项目目录



axios/api    用来封装axios

Hello.vue     测试页面

router/index.js   路由

main.js      入口js

mock.js     mockjs文件

在来看下完成后的效果

5.在入口js（main.js）里引入mockjs
import Vue from 'vue'
import App from './App'
import router from './router'
import api from '@/api/api.js'  //这里封装了拦截api
Vue.config.productionTip = false
 
// 引入mockjs
require('./mock.js')
Vue.prototype.$api = api;
new Vue({
    el: '#app',
    router,
    template: '<App/>',
    components: {
        App
    }
})

6. 添加一个mock规则（mock.js）

// 引入mockjs
const Mock = require('mockjs');
// 获取 mock.Random 对象
const Random = Mock.Random;

// Mock.mock( url, post/get , 返回的数据)；
// Mock.mock( url, post/get , 返回的数据)；
Mock.mock('http://api.com/index', 'post', {
    "swiper|4":[
        {
          'imgPath':Random.image('800x400', '#04a1f7', '#FFF', 'png', ''),
          'id':'@id'
        }
      ]
}
7.在Hello.vue 中请求文档接口，并接收mock数据

<template>
  <div class="index">
    </div>
  </div>
</template>
 
<script>
import api from './../axios/api.js'

export default {
  name: 'index',
  data () {
    return {
      list: [],
    }
  },
  components: {
  },
  created() {
    this.init();
  },
  methods:{
    init: function() {
      this.$api({
        method: 'post',
        url: '/index'
        }).then((response) => {
            console.log(response);
        console.log(response.data);
        }).catch(function(error) {
        console.log(error);
      })
    },
  }
}
</script>

自己分封装的api.js如下
import axios from 'axios'
import store from '@/vuex/store.js'
import router from '../router'

const api = axios.create();
api.defaults.baseURL = 'http://api.com';
api.defaults.timeout = 5000;
api.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
api.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest'

// 请求拦截
api.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    return config;
  }, function (error) {
    // 对请求错误做些什么
    alert('网络错误,请稍后再试');
    return Promise.reject(error);
  });

// 添加响应拦截器
api.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    return response;
  }, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
  });
//
  function fetch(url,params){
      return new Promise((resolve,reject)=>{
          axios.post(url,params).then(response=>{
              resolve(response.data);
          })
      })
  }
  export default api
