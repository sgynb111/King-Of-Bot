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
},
setup() {


// $.ajax({
//   url: "http://127.0.0.1:3000/user/account/register/",
//   type: "post",
//   data: {
//     username: "sgy2",
//     password: "123",
//     confirmedPassword: "123",
//   },
//   success(resp) {
//     console.log(resp);
//   },
//   error(resp) {
//     console.log(resp);
//   }
// })
}

}
</script>


<style>
  body {
    background: url("~@/assets/images/background.png");
    background-size:cover;
}
</style>
