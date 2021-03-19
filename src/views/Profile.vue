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
        
       <div class="w-row">
          <div> Profile </div>

          <div  class=" " v-if="!connectedToWeb3">
              <NotConnectedToWeb3 />
          </div>

          <div  class=" " v-if=" connectedToWeb3">

            <div v-if="!selectedNFTContractAddress">
             
              <ArtTypeTile 
                v-bind:imageURL="",
                v-bind:onClickCallback="onTileClicked('mooncats')"

              />

              <ArtTypeTile 
                v-bind:imageURL="",
                v-bind:onClickCallback="onTileClicked('punks')"

              />

          </div>


          <div v-if="selectedNFTContractAddress">

              <NFTGallery
                  v-bind:nftContractAddress="selectedNFTContractAddress"
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


import NotConnectedToWeb3 from './components/NotConnectedToWeb3.vue'


export default {
  name: 'Home',
  props: [],
  components: {Navbar, Footer,NotConnectedToWeb3},
  data() {
    return {
      web3Plug: new Web3Plug() ,
      connectedToWeb3: false,
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
          console.log('ontielclicked',name )

          this.$router.push({ path: `/bid/${row.signature}` })
        }
  }
}
</script>
