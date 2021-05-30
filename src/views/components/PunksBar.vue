<template>
  <div v-if="connectedToWeb3 " class="   " style="background:#333" v-cloak>
      
     

  <div class="w-container flex">

    <div class="flex-grow "> 
    
    <div class="overflow-x-auto overflow-y-none"  style="max-width:50%; max-height:50px">
      <div v-for="tokenId of ownedTokenIdsArray" 
      class="m-1 inline-block border-2 border-black hover:bg-gray-200 cursor-pointer"
          :class="{'bg-purple-500': activePunkId == tokenId }"
      >
          
          <PunkIcon
            v-bind:iconId='tokenId'
            v-bind:renderSize=24
            v-bind:onClickedCallback="onPunkClicked"
            v-bind:largeSize="true"
          />

          
      </div>
    </div>
    

    <div  v-if="noPunksFound" class="p-2 text-white"  >
      No punks found.
    </div>

    </div>

  <div v-if="activePunkId" class="flex flex-row" style="min-width:120px">  
      
      <div class="pt-8 text-xs text-gray-300 inline-block"  > Punk #{{activePunkId}} </div>
      
        <router-link :to="'/profile'"> 
        <PunkIcon
          v-bind:iconId='activePunkId'
          v-bind:renderSize=48
          
        />
        </router-link>
 
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
      ownedTokenIdsArray: [] ,
      activePunkId: null,
      noPunksFound: false

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


      this.activePunkId = localStorage.getItem('activePunkId');


  },
    beforeDestroy: function () {
     
     this.web3Plug.clearEventEmitter()
  },

  methods: {

       getActivePunkId(){
        return this.activePunkId
       },  

       async fetchOwnedTokenIds(){
          

          let activeAddress = this.web3Plug.getActiveAccountAddress()
  
          let contractData = this.web3Plug.getContractDataForActiveNetwork()
         
          let punkContractAddress = contractData['cryptopunks'].address

          let response = await StarflaskAPIHelper.resolveStarflaskQuery(FrontendHelper.getRouteTo('api'), {requestType: 'ERC721_balance_by_owner_and_token' , input:{ownerAddress: activeAddress , token: punkContractAddress }})
   
          console.log('fetched token ids',  response)
 
          this.ownedTokenIdsArray = response.output[0].tokenIds

          this.noPunksFound = (this.ownedTokenIdsArray.length == 0)


          // this.ownedTokenIdsArray = [1164,1,2,3,4,5,6,7,8,1,2,3,4,5,6,7,8,1,2,3,4,5,6,7,8,1,2,3,4,5,6,7,8,1,2,3,4,5,6,7,8,1,2,3,4,5,6,7,8,1,2,3,4,5,6,7,8,]
       },

       async onPunkClicked(punkId){

         if(this.activePunkId == punkId){
           this.activePunkId = null
         }else{
           this.activePunkId=punkId 
         }

         localStorage.setItem('activePunkId', this.activePunkId);
         
         
       }
  }
}
</script>
