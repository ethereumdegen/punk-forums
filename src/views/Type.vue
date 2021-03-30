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
     <div class="autospacing w-container" v-if="typeData">


         

        
          <div class="text-xl font-bold mb-8 capitalize"> {{typeData.label}} </div>


          <div class="flex flex-row">

            <div class="flex-grow  ">  

              <div>
              
                  <div> Contract Address: <a v-bind:href="web3Plug.getExplorerLinkForAddress(contractData.address)" target="_blank">  {{  contractData.address }} </a>  </div> 

                  <div class="  mt-12  ">
                         <a v-bind:href="'/newbid/'.concat(typeData.name)" class="select-none bg-teal-300 no-underline p-2   text-black rounded border-black border-2 cursor-pointer"> Place a bid for any {{typeData.label}} </a>
                    </div>


                    <div class=" mt-12  ">
                         <a v-bind:href="'/sell/'.concat(typeData.name)" class="select-none bg-teal-300 no-underline p-2   text-black rounded border-black border-2 cursor-pointer"> Sell your {{typeData.label}} </a>
                    </div>
              
              </div>
           </div>

             <div class=" ">

                  <img v-bind:src="typeData.imgurl" width="128" height="128" />

              </div>

          </div>


           

          <div  class=" "   >
             
             <div class="mb-4 text-xl">

               


            </div>

            
  

          </div>
 

             


        
     </div>

     <div class="autospacing w-container" v-if="!typeData">
       No results found.
      </div>
   </div>


    


    
  <Footer/>

</div>
</template>


<script>

import Vue from 'vue'

import Web3Plug from '../js/web3-plug.js' 


import Navbar from './components/Navbar.vue';
 
import Footer from './components/Footer.vue';

import GenericDropdown from './components/GenericDropdown.vue'

import BidPacketUtils from '../js/bidpacket-utils.js'

import BidPacketHelper from '../js/bidpacket-helper.js'

import BuyTheFloorHelper from '../js/buythefloor-helper.js'

 

var updateTimer;

export default {
  name: 'Search',
  props: [ ],
  components: {Navbar, Footer, GenericDropdown },
  data() {
    return {
      web3Plug: new Web3Plug() ,
      nftTypeName: null,
      contractData:null,
      typeData: null
      
 
    }
  },
  computed: {
     
   
  },
  created(){
this.web3Plug.getPlugEventEmitter().on('stateChanged', function(connectionState) {
        console.log('stateChanged',connectionState);
         
        //this.activeAccountAddress = connectionState.activeAccountAddress
        //this.activeNetworkId = connectionState.activeNetworkId
 
         
      }.bind(this));
   this.web3Plug.getPlugEventEmitter().on('error', function(errormessage) {
        console.error('error',errormessage);
         
        //this.web3error = errormessage
       
      }.bind(this));

      this.web3Plug.reconnectWeb()
    
 
    

  },
  mounted () {
    
     this.$nextTick(() => {
        this.populateInitialType()
    })
     
      
    
  }, 

  beforeDestroy(){
      
  },
  methods: {

    async populateInitialType(){

        let chainId = this.web3Plug.getActiveNetId()

        if(chainId==null){
          chainId = 1 
          console.log('no web3 connection')
        } 
 
        let nftTypesArray = BuyTheFloorHelper.getClientConfigForNetworkId(chainId).nftTypes
        let contractData = this.web3Plug.getContractDataForNetworkID(chainId)

        let nftTypes = {}

        for(let type of nftTypesArray){
          nftTypes[type.name] = type
        }

        if(this.$route.params.nft_type){
            this.nftTypeName = this.$route.params.nft_type.toLowerCase()
            this.contractData = contractData[this.nftTypeName]
            this.typeData = nftTypes[this.nftTypeName]
             
          }

    }  
    
        
          
 
  }
}
</script>
