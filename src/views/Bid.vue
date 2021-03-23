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
     <div class="autospacing w-container p-2">
        
       <div class="w-row text-xs">
          <div class="text-lg font-bold"> Bid Information </div>
          <div>  bidder: <a  target="_blank" v-bind:href="web3Plug.getExplorerLinkForAddress(bidPacketData.bidderAddress)">  {{bidPacketData.bidderAddress}} </a> </div>
          <div> network: {{ bidPacketData.bidNetworkName }} </div>
          <div> nftType: <a  target="_blank" v-bind:href="web3Plug.getExplorerLinkForAddress(bidPacketData.nftContractAddress)">  {{bidPacketData.nftContractName}}  </a></div>
          <div> bid payment: {{bidPacketData.currencyTokenAmountFormatted}} <a  target="_blank" v-bind:href="web3Plug.getExplorerLinkForAddress(bidPacketData.currencyTokenAddress)"> {{bidPacketData.currencyTokenName}} </a> </div>
          
          <div v-if="bidPacketData.expirationFormatted != null"> expiration:  ~{{bidPacketData.expirationFormatted}} days </div>
          <div> status:  {{bidPacketData.status}}</div>
          <div> suspended:  {{bidPacketData.suspended}}</div>

           <div class="my-8">

        <div @click="cancelBid()" v-if="userIsOwnerOfBid()" class="select-none bg-teal-300 p-2 inline-block rounded border-black border-2 cursor-pointer"> Cancel bid </div>
           <a href='/sell' class="mx-2 select-none bg-teal-300 p-2 no-underline inline-block rounded border-black border-2 cursor-pointer text-black text-md"> Fulfill this bid </a>
         
        </div>

          <div class="my-4"></div>
          <div class="text-md font-bold"> Advanced Information </div>

          <div>  bidder: <a  target="_blank" v-bind:href="web3Plug.getExplorerLinkForAddress(bidPacketData.bidderAddress)">  {{bidPacketData.bidderAddress}} </a> </div>
          <div>  nftContractAddress: <a  target="_blank" v-bind:href="web3Plug.getExplorerLinkForAddress(bidPacketData.nftContractAddress)"> {{bidPacketData.nftContractAddress}} </a>  ( {{bidPacketData.nftContractName}} ) </div>
          <div> currencyTokenAddress: <a  target="_blank" v-bind:href="web3Plug.getExplorerLinkForAddress(bidPacketData.currencyTokenAddress)"> {{bidPacketData.currencyTokenAddress}} </a>  ( {{bidPacketData.currencyTokenName}} ) </div>
            <div> currencyTokenAmount: {{bidPacketData.currencyTokenAmount}}   ( {{bidPacketData.currencyTokenAmountFormatted}} ) </div>
            <div> expires:  {{bidPacketData.expires}} <span v-if="bidPacketData.expirationFormatted != null">( ~{{bidPacketData.expirationFormatted}} days )</span> </div>
             <div> hash:  {{bidPacketData.hash}}</div>

            <div> signature:  {{bidPacketData.signature.signature}}</div>
            <div> status:  {{bidPacketData.status}}</div>
             <div> suspended:  {{bidPacketData.suspended}}</div>


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

         this.fetchPacketData(this.$route.params.signature)
         
      }.bind(this));
   this.web3Plug.getPlugEventEmitter().on('error', function(errormessage) {
        console.error('error',errormessage);
         
        this.web3error = errormessage
        
      }.bind(this));
   
      this.fetchPacketData(this.$route.params.signature)
  }, 
  methods: {
     async fetchPacketData(signature){
       console.log('fetch',signature)

        var hostname = window.location.hostname; 

        let chainId = this.web3Plug.getActiveNetId()

        if(chainId==null){
          chainId = 1 
          console.log('no web3 connection')
        } 



        
         
        let serverURL = BuyTheFloorHelper.getSocketURL( chainId )  
        console.log('serverURL',serverURL)

        this.bidPacketData = await BidPacketHelper.findBidPacket(signature, serverURL)
        
        let bidChainId = this.bidPacketData.chainId
        this.bidPacketData.bidNetworkName = this.web3Plug.getWeb3NetworkName(bidChainId)

        if(bidChainId){
          chainId = bidChainId; //interim soln
        }

        let contractData = this.web3Plug.getContractDataForNetworkID(chainId)
        let bidTheFloorAddress = contractData['buythefloor'].address

        let typedData =  BidPacketUtils.getBidTypedDataFromParams( chainId , bidTheFloorAddress, this.bidPacketData.bidderAddress, this.bidPacketData.nftContractAddress, this.bidPacketData.currencyTokenAddress, this.bidPacketData.currencyTokenAmount, this.bidPacketData.expires   )
        
        if(chainId == parseInt(bidChainId)){
         this.bidPacketData.hash = BidPacketUtils.getBidTypedDataHash(typedData)
        }
       

        
        this.bidPacketData.nftContractName = BuyTheFloorHelper.getNameFromContractAddress(this.bidPacketData.nftContractAddress, chainId)
        this.bidPacketData.currencyTokenName = BuyTheFloorHelper.getNameFromContractAddress(this.bidPacketData.currencyTokenAddress, chainId)
         
 
        
        this.bidPacketData.currencyTokenAmountFormatted = BuyTheFloorHelper.getFormattedCurrencyAmount( this.bidPacketData.currencyTokenAmount, this.bidPacketData.currencyTokenAddress, chainId)
        

        if(this.web3Plug.connectedToWeb3()){
           
           let currentBlockNumber = await this.web3Plug.getBlockNumber()
           let blockDifference = (this.bidPacketData.expires - parseInt(currentBlockNumber))
           
            

           this.bidPacketData.expirationFormatted = BuyTheFloorHelper.getDaysFromBlocks(blockDifference)
        
        }
       
 

         console.log('fetched',this.bidPacketData)
     },

     async cancelBid(){
         let contractData = this.web3Plug.getContractDataForActiveNetwork()
        let bidTheFloorAddress = contractData['buythefloor'].address

        let btfContract = this.web3Plug.getCustomContract(BTFContractABI,bidTheFloorAddress )
         await btfContract.methods.cancelBid(this.bidPacketData.nftContractAddress, this.bidPacketData.bidderAddress,  this.bidPacketData.currencyTokenAddress, this.bidPacketData.currencyTokenAmount, this.bidPacketData.expires,this.bidPacketData.signature.signature ).send({from: this.web3Plug.getActiveAccountAddress()})
     } ,

     userIsOwnerOfBid(){
       return (this.bidPacketData.bidderAddress && this.bidPacketData.bidderAddress.toLowerCase() == this.web3Plug.getActiveAccountAddress())
     }
  }
}
</script>
