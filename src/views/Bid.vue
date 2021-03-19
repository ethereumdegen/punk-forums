<template>

<div>

   <div class="section  bg-white border-b-2 border-black px-0 lg:px-1">

     <div class=" ">
        <Navbar 
        v-bind:web3Plug="web3Plug"
       />
     </div>


   </div>

  

   <div class="section  bg-white border-b-2 border-black">
     <div class="autospacing w-container">
        
       <div class="w-row text-xs">
          <div class="text-lg font-bold"> Bid Information </div>

          <div>  bidder: {{bidPacketData.bidderAddress}}</div>
          <div>  nftContractAddress: {{bidPacketData.nftContractAddress}}</div>
          <div> currencyTokenAddress: {{bidPacketData.currencyTokenAddress}}</div>
            <div> currencyTokenAmount: {{bidPacketData.currencyTokenAmount}}</div>
            <div> expires:  {{bidPacketData.expires}}</div>

            <div> signature:  {{bidPacketData.signature.signature}}</div>



       </div>
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
  name: 'Home',
  props: [],
  components: {Navbar, Footer},
  data() {
    return {
      web3Plug: new Web3Plug() ,
      bidPacketData: {} 
    }
  },
  created: function () {
    this.web3Plug.reconnectWeb()
    this.web3Plug.getPlugEventEmitter().on('stateChanged', function(connectionState) {
        console.log('stateChanged',connectionState);
         
        this.activeAccountAddress = connectionState.activeAccountAddress
        this.activeNetworkId = connectionState.activeNetworkId
         
      }.bind(this));
   this.web3Plug.getPlugEventEmitter().on('error', function(errormessage) {
        console.error('error',errormessage);
         
        this.web3error = errormessage
        // END CUSTOM CODE
      }.bind(this));
   
      this.fetchPacketData(this.$route.params.signature)
  }, 
  methods: {
     async fetchPacketData(signature){
       console.log('fetch',signature)

        var hostname = window.location.hostname; 

        //'ws://localhost:8443'
        let serverURL = 'ws://'+hostname+':8443'
        console.log('serverURL',serverURL)

        this.bidPacketData = await BidPacketHelper.findBidPacket(signature, serverURL)

         console.log('fetched',this.bidPacketData)
     }
  }
}
</script>
