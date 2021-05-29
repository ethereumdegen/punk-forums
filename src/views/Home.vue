<template>

<div>

   <div class="section  bg-gray-200  border-b-4 border-black px-0 lg:px-1">

     <div class=" ">
        <Navbar 
        v-bind:web3Plug="web3Plug"
        
       />

      
     </div>


   </div>


      <Punksbar 
        v-bind:web3Plug="web3Plug"
        
       />


   <div class="section  border-b-2 border-black" style="background:#eee;">
     <div class=" w-container py-8">

       <div class="my-4"> 
         Categories

       </div>



       <div > 
         <TopicsList 
         
         /> 

       </div>
        
     </div>
   </div>


    



    
  <Footer/>

</div>
</template>


<script>



import Web3Plug from '../js/web3-plug.js' 
import AccessPlug from '../js/access-plug.js' 

  
 
import Navbar from './components/Navbar.vue';
import Punksbar from './components/PunksBar.vue';
 
import Footer from './components/Footer.vue';
import TabsBar from './components/TabsBar.vue';

import TopicsList from './components/forum/TopicsList.vue';
  
import StarflaskAPIHelper from '../js/starflask-api-helper.js';
import FrontendHelper from '../js/frontend-helper.js';


export default {
  name: 'Home',
  props: [],
  components: {Navbar, Punksbar, Footer, TopicsList   },
  data() {
    return {
      web3Plug: new Web3Plug()  

      
    }
  },

  created(){

 
    this.web3Plug.getPlugEventEmitter().on('stateChanged', function(connectionState) {
        console.log('stateChanged',connectionState);
         
        this.activeAccountAddress = connectionState.activeAccountAddress
        this.activeNetworkId = connectionState.activeNetworkId 
         
      }.bind(this));
   this.web3Plug.getPlugEventEmitter().on('error', function(errormessage) {
        console.error('error',errormessage);
         
        this.web3error = errormessage
       
      }.bind(this));

      this.web3Plug.reconnectWeb()
   
       

  },
  mounted: async function () {
        

  }, 
  methods: {
           
          getRouteTo(dest){
            return FrontendHelper.getRouteTo(dest)
          }

       
 

  }
}
</script>
