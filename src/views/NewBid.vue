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
        
        
          <div class="text-xl font-bold mb-8"> Place a new bid </div>


          <div id="form  " class=" ">
            
            <div>
                <label   class="block text-md font-medium font-bold text-gray-800  ">Bid Currency Token</label>
                
                <GenericDropdown
                  v-bind:optionList="currencyTokensOptionsList" 
                  v-bind:onSelectCallback="onSelectCallback"
                />
            </div>
           
              
           <div>
              <label   class="block text-md font-medium font-bold text-gray-800  ">Bid Amount</label>
            
            
              <input type="text" name="price" v-model="formInputs.tokenBidAmount"  class="text-gray-900 font-bold px-4 text-xl focus:ring-indigo-500 focus:border-indigo-500 block w-full py-4 pl-7 pr-12   border-gray-300 rounded-md" placeholder="0.00">
            </div>



          </div>


            <div id="output">
            




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

import GenericDropdown from './components/GenericDropdown.vue'

const nftTokenContracts= ['cryptopunks','mooncats']

const currencyTokenContracts= ['0xbtc','weth']


export default {
  name: 'Home',
  props: [],
  components: {Navbar, Footer, GenericDropdown},
  data() {
    return {
      web3Plug: new Web3Plug(),
      formInputs: {
        
        tokenContractAddress: null,
        nftContractAddress: null,
        tokenBidAmount: 0,
        expiresAtBlock:0 


      },
      currencyTokensOptionsList:[{'name':'mooncats'}]
    }
  },
  mounted: function () {
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
   
    
  }, 
  methods: {
        onSelectCallback(optionData){
          console.log('callback2',optionData)
        }
  }
}
</script>
