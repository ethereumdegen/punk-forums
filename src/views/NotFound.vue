<template>

<div>

   <div class="section  bg-white border-b-2 border-black px-0 lg:px-1">

     <div class=" ">
        <Navbar 
        v-bind:web3Plug="web3Plug"
       />
     </div>


   </div>

   


      <div class=" section  mb-4">
        <div class="autospacing w-container">
          <div> File not found! </div>
          <router-link to="/"> -> Go Home</router-link>

          </div>
      </div>

  <Footer/>

    

 

</div>
</template>


<script>



import Web3Plug from '../js/web3-plug.js' 


import Navbar from './components/Navbar.vue';
 
import Footer from './components/Footer.vue';

import BidPacketHelper from '../js/bidpacket-helper.js'





export default {
  name: 'NotFound',
  props: [],
  components: {Navbar, Footer},
  data() {
    return {
       
    }
  },
  created: function () {
    
    
  }, 
  methods: {
      
  }
}
</script>
