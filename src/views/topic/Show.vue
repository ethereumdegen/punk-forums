<template>

<div>

   <div class="section bg-gray-200  border-b-2 border-black px-0 lg:px-1">

     <div class=" ">
        <Navbar 
        v-bind:web3Plug="web3Plug"
      
       />
     </div>


   </div>

    <Punksbar 
        ref="punksbar"
        v-bind:web3Plug="web3Plug"
        
       />



   <div class="section  bg-white border-b-2 border-black  ">
     <div class="autospacing w-container">
        
        
       <div class="w-column py-16">
          <div class="text-lg font-bold"> Topic  </div>
          
          <div  class=" " v-if="!connectedToWeb3">
              <NotConnectedToWeb3 />
          </div>





          <div  class=" " v-if=" connectedToWeb3">

              

          </div>


          
       </div>
     </div>
   </div>


    


    
  <Footer/>

</div>
</template>


<script>




import Web3Plug from '../../js/web3-plug.js' 
 

 

import Navbar from '../components/Navbar.vue';
 
import Footer from '../components/Footer.vue';
import TabsBar from '../components/TabsBar.vue';
import GenericTable from '../components/GenericTable.vue';
 import NotConnectedToWeb3 from '../components/NotConnectedToWeb3.vue'


import Punksbar from '../components/PunksBar.vue';

import FrontendHelper from '../../js/frontend-helper.js'

export default {
  name: 'Application',
  props: [],
  components: {Navbar, Footer, TabsBar, GenericTable, Punksbar, NotConnectedToWeb3},
  data() {
    return {
      web3Plug: new Web3Plug() , 
   

       
      connectedToWeb3: false 
    }
  },

  created(){

 
    this.web3Plug.getPlugEventEmitter().on('stateChanged', async function(connectionState) {
        console.log('stateChanged',connectionState);
         
        this.activeAccountAddress = connectionState.activeAccountAddress
        this.activeNetworkId = connectionState.activeNetworkId
        this.connectedToWeb3 = this.web3Plug.connectedToWeb3()
        this.currentBlockNumber = await this.web3Plug.getBlockNumber()

         
         
      }.bind(this));
   this.web3Plug.getPlugEventEmitter().on('error', function(errormessage) {
        console.error('error',errormessage);
         
        this.web3error = errormessage
       
      }.bind(this));

      this.web3Plug.reconnectWeb()
    
 

  },
  mounted: function () {
    
      this.accessPlug.reconnect()
   
  }, 
  methods: {
          
  }
}
</script>
