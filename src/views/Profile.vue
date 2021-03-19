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
          <div class="text-lg font-bold"> Sell an NFT </div>
          
          <div  class=" " v-if="!connectedToWeb3">
              <NotConnectedToWeb3 />
          </div>

          <div  class=" " v-if=" connectedToWeb3">

            <div v-if="!selectedNFTContractAddress">

              <div class="text-xs  "> Select a type </div>


               <ArtTypeTile 
                v-bind:typeName="'artsale'"
                v-bind:imageURL="'/images/artblocks.jpg'" 
                v-bind:onClickCallback="onTileClicked"

              />


              <ArtTypeTile 
                v-bind:typeName="'wrappedmooncats'"
                v-bind:imageURL="'/images/mooncats.jpg'" 
                v-bind:onClickCallback="onTileClicked"

              />

              <ArtTypeTile 
                v-bind:typeName="'wrappedcryptopunks'"
                v-bind:imageURL="'/images/cryptopunks.jpg'" 
                v-bind:onClickCallback="onTileClicked"

              />

          </div>


          <div v-if="selectedNFTContractAddress">

            <div class="flex flex-row">
            
              <div @click="resetNFTType()" class="p-1 mx-4 rounded text-xs select-none cursor-pointer bg-purple-500 text-white"> Go Back </div>
                <div class="text-md  "> Selected Type: {{selectedNFTType}} </div>
            </div>

                 
               

               <NFTSellForm
                v-bind:nftContractAddress="selectedNFTContractAddress"
                  v-bind:web3Plug="web3Plug"

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


export default {
  name: 'Home',
  props: [],
  components: {Navbar, Footer,NotConnectedToWeb3, ArtTypeTile, NFTSellForm},
  data() {
    return {
      web3Plug: new Web3Plug() ,
      connectedToWeb3: false,
      selectedNFTType: null,
      selectedNFTContractAddress:null 
    }
  },
  created  () {
   
    this.web3Plug.getPlugEventEmitter().on('stateChanged', function(connectionState) {
        console.log('stateChanged',connectionState);
         
        this.activeAccountAddress = connectionState.activeAccountAddress
        this.activeNetworkId = connectionState.activeNetworkId
         
          this.connectedToWeb3 = this.web3Plug.connectedToWeb3()
        

      }.bind(this));
   this.web3Plug.getPlugEventEmitter().on('error', function(errormessage) {
        console.error('error',errormessage);
         
        this.web3error = errormessage
        
      }.bind(this));
    this.web3Plug.reconnectWeb()
    
  }, 
  methods: {
        onTileClicked(name){
          console.log('ontileclicked',name )

          let contractData = this.web3Plug.getContractDataForActiveNetwork()


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
