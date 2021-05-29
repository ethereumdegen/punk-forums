<template>
  <div v-if="connectedToWeb3 " class="   " style="background:#333">
      
     

  <div class="w-container">
    
    <div v-for="tokenId of ownedTokenIdsArray" class="m-1 p-2 inline-block border-2 border-black hover:bg-gray-200 cursor-pointer">
        
         

        <PunkIcon
          v-bind:iconId='tokenId'
          v-bind:renderSize=24
        />

        
    </div>

    <div v-if="ownedTokenIdsArray.length ==0" class="p-2 text-white">
      No punks found.
    </div>
    
  </div>
       
  </div>
</template>


<script>

import StarflaskAPIHelper from '../../js/starflask-api-helper.js';
import FrontendHelper from '../../js/frontend-helper.js';

import PunkIcon from './PunkIcon.vue'

 
export default {
  name: 'PunksBar',
  props: [  'web3Plug'],
  components: {PunkIcon},
  data() {
    return {
      nftType: null,
      connectedToWeb3: false,
      ownedTokenIdsArray: [] 
    }
  },
   
  created(){
      

    
      this.web3Plug.getPlugEventEmitter().on('stateChanged', (state) => {
         
        this.connectedToWeb3 = this.web3Plug.connectedToWeb3()
        
        this.fetchOwnedTokenIds()

      })

      this.connectedToWeb3 = this.web3Plug.connectedToWeb3()
      this.fetchOwnedTokenIds()

      this.web3Plug.getPlugEventEmitter().off('stateChanged', (state) => {} );



  },
    beforeDestroy: function () {
     
     this.web3Plug.clearEventEmitter()
  },

  methods: {
       async fetchOwnedTokenIds(){
          

          let activeAddress = this.web3Plug.getActiveAccountAddress()
 

        

          let response = await StarflaskAPIHelper.resolveStarflaskQuery('http://localhost:3000/api/v1', {requestType: 'ERC721_balance_by_owner' , input:{publicAddress: activeAddress  }})
   
          console.log('response', response)
 
          this.ownedTokenIdsArray = response.output[0].tokenIds
       }
  }
}
</script>
