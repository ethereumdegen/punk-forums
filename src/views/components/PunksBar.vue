<template>
  <div class="w-container ">
      
     

  <div>
    
    <div v-for="tokenId of ownedTokenIdsArray" class="m-4 p-2 inline-block border-2 border-black">
        
         

        <PunkIcon
          v-bind:iconId='tokenId'
        />

        
    </div>

    <div v-if="ownedTokenIdsArray.length ==0">
      No results found.
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
      ownedTokenIdsArray: [] 
    }
  },
   
  mounted(){
      
      this.web3Plug.getPlugEventEmitter().on('stateChanged', (state) => {

        this.fetchOwnedTokenIds()

      })

      this.fetchOwnedTokenIds()


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
