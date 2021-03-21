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
             <div> hash:  {{bidPacketData.hash}}</div>

            <div> signature:  {{bidPacketData.signature.signature}}</div>
          <div> status:  {{bidPacketData.status}}</div>
           <div> suspended:  {{bidPacketData.suspended}}</div>


       </div>

        <div @click="cancelBid()" class="select-none bg-teal-300 p-2 inline-block rounded border-black border-2 cursor-pointer"> Cancel bid </div>
         


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

import BidPacketUtils from '../js/bidpacket-utils.js'


import BuyTheFloorHelper from '../js/buythefloor-helper.js'

var BTFContractABI = require('../contracts/BuyTheFloorABI.json')


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

         
        let serverURL = BuyTheFloorHelper.getSocketURL()  
        console.log('serverURL',serverURL)

        this.bidPacketData = await BidPacketHelper.findBidPacket(signature, serverURL)

        let contractData = this.web3Plug.getContractDataForActiveNetwork()
        let bidTheFloorAddress = contractData['buythefloor'].address

        let typedData =  BidPacketUtils.getBidTypedDataFromParams(this.web3Plug.getActiveNetId( ), bidTheFloorAddress, this.bidPacketData.bidderAddress, this.bidPacketData.nftContractAddress, this.bidPacketData.currencyTokenAddress, this.bidPacketData.currencyTokenAmount, this.bidPacketData.expires   )
        this.bidPacketData.hash = BidPacketUtils.getBidTypedDataHash(typedData)

        
         console.log('fetched',this.bidPacketData)
     },

     async cancelBid(){
         let contractData = this.web3Plug.getContractDataForActiveNetwork()
        let bidTheFloorAddress = contractData['buythefloor'].address

        let btfContract = this.web3Plug.getCustomContract(BTFContractABI,bidTheFloorAddress )
         await btfContract.methods.cancelBid(this.bidPacketData.nftContractAddress, this.bidPacketData.bidderAddress,  this.bidPacketData.currencyTokenAddress, this.bidPacketData.currencyTokenAmount, this.bidPacketData.expires,this.bidPacketData.signature.signature ).send({from: this.web3Plug.getActiveAccountAddress()})
     }
  }
}
</script>
