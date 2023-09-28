<template>
  <NavBar/>
  <router-view></router-view>
</template>

<script>
import NavBar from './components/NavBar.vue'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap"
import { RouterView } from 'vue-router';

export default {
  components:{
    NavBar,
    RouterView
}
}
</script>


<style>
  body {
    background: url("~@/assets/images/background.png");
    background-size:cover;
}
</style>
