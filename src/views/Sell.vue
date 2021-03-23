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
        
       <div class="w-column">


         <div v-if="selectedNFTContractAddress" @click="resetNFTType()" class="p-2  rounded text-xs select-none inline-block cursor-pointer bg-purple-500 text-white"> < Go Back </div>


          <div class="text-lg font-bold"> Sell an NFT </div>
          
         
          <div  class=" "  >


             

            <div v-if="!selectedNFTContractAddress">

              <div class="text-xs  "> Select a type </div>


               <ArtTypeTile v-for="type of nftTypes"
                v-bind:type="type"
                v-bind:imageURL="type.imgurl" 
                v-bind:onClickCallback="onTileClicked"

              />

 

          </div>


          <div v-if="selectedNFTContractAddress">





            <div class="flex flex-row">
            
             
                <div class="text-md  "> Selected Type: {{selectedNFTType}} </div>
            </div>

                 
               

               <NFTSellForm
                v-bind:nftContractAddress="selectedNFTContractAddress"
                  v-bind:web3Plug="web3Plug"
                  v-bind:connectedToWeb3="connectedToWeb3"

                />

             


          </div>




          </div>


          
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

import ArtTypeTile from './components/ArtTypeTile.vue'
import NFTSellForm from './components/NFTSellForm.vue'

import NotConnectedToWeb3 from './components/NotConnectedToWeb3.vue'

import BuyTheFloorHelper from '../js/buythefloor-helper.js'

export default {
  name: 'Home',
  props: [],
  components: {Navbar, Footer,NotConnectedToWeb3, ArtTypeTile, NFTSellForm},
  data() {
    return {
      web3Plug: new Web3Plug() ,
      nftTypes:  [],
      connectedToWeb3: false,
      selectedNFTType: null,
      selectedNFTContractAddress:null 
    }
  },
  async created  () {
   
    this.web3Plug.getPlugEventEmitter().on('stateChanged', function(connectionState) {
        console.log('stateChanged',connectionState);
         
        this.activeAccountAddress = connectionState.activeAccountAddress
        this.activeNetworkId = connectionState.activeNetworkId
         
        this.connectedToWeb3 = this.web3Plug.connectedToWeb3()
        this.nftTypes = BuyTheFloorHelper.getClientConfigForNetworkId(this.web3Plug.getActiveNetId()).nftTypes
    

      }.bind(this));
   this.web3Plug.getPlugEventEmitter().on('error', function(errormessage) {
        console.error('error',errormessage);
         
        this.web3error = errormessage
        
      }.bind(this));


    await this.web3Plug.reconnectWeb()


    let chainId = this.web3Plug.getActiveNetId()
    if(!chainId){
      chainId = 1
    }

    this.nftTypes = BuyTheFloorHelper.getClientConfigForNetworkId(chainId).nftTypes
    
  }, 
  methods: {
        onTileClicked(name){
          console.log('ontileclicked',name )

           let chainId = this.web3Plug.getActiveNetId()
            if(!chainId){
              chainId = 1
            }

          let contractData = this.web3Plug.getContractDataForNetworkID(chainId)


          this.selectedNFTType = name 
          this.selectedNFTContractAddress = contractData[name].address
         
        },
        resetNFTType(){

          this.selectedNFTType = null 
          this.selectedNFTContractAddress = null
        }
  }
}
</script>
