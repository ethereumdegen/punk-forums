<template>
  <div v-if="connectedToWeb3 " class="   " style="background:#333" v-cloak>
      
     

  <div class="w-container flex">

    <div class="flex-grow "> 
    
    <div class="overflow-x-auto overflow-y-none"  style="max-width:50%; max-height:50px">
      <div v-for="tokenId of ownedTokenIdsArray" v-if="ownedTokenIdsArray"
      class="m-1 inline-block border-2 border-black hover:bg-gray-200 cursor-pointer"
          :class="{'bg-purple-500': activePunkId == tokenId }"
      >
          
          <PunkIcon
            v-if="tokenId"
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

  <div v-if="activePunkId != null  " class="flex flex-row" style="min-width:120px">  
      
      <div class="pt-8 text-xs text-gray-300 inline-block"  > Punk #{{activePunkId}} </div>
      
        <router-link :to="'/punk/'.concat(activePunkId)"> 
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

 var authTokenProducedAt = Date.now()

const EventEmitter = require('events');
class PunksBarEmitter extends EventEmitter {}

const punksBarEmitter = new PunksBarEmitter();

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
      

   /*  this.web3Plug.getPlugEventEmitter().on('refreshAuthToken', (state) => {
          console.log('refreshAuthToken')
            this.refreshAuthToken(state.activeAccountAddress)
      })*/

    

      
     //  this.web3Plug.getPlugEventEmitter().off('refreshAuthToken', (state) => {} );

      this.web3Plug.getAuthTokenEventEmitter().on('punksbar', (state) => {

        console.log('on refresh auth ')
         
        this.connectedToWeb3 = this.web3Plug.connectedToWeb3()
        
        this.fetchOwnedTokenIds()

        this.refreshAuthToken(state.activeAccountAddress)

      })

      

      this.connectedToWeb3 = this.web3Plug.connectedToWeb3()
      this.fetchOwnedTokenIds()

     

      this.activePunkId = FrontendHelper.getActivePunkId()

     /// this.refreshAuthToken(  this.web3Plug.getActiveAccountAddress() )
  },
    beforeDestroy: function () {
     
     //this.web3Plug.clearEventEmitter()

     this.clearEventEmitter()
  },

  methods: {

       getActivePunkId(){
        return this.activePunkId
       },  

       async refreshAuthToken(accountAddress){
         console.log('refresh Auth Token' , accountAddress)

         if(!accountAddress)return;

           let authTokenExists = FrontendHelper.localAuthTokenExistsForAddress(  accountAddress )

          console.log('auth token existss??', authTokenExists , accountAddress)

           if(!authTokenExists){

              if(authTokenProducedAt > Date.now() - 100) return 
              authTokenProducedAt = Date.now()

              await  FrontendHelper.produceNewAuthToken( accountAddress , this.web3Plug )

              punksBarEmitter.emit('authTokenRefreshed', accountAddress)

            //  console.log('bar emitter 1')
           } 


           

       },

       async fetchOwnedTokenIds(){
          

          let activeAddress = this.web3Plug.getActiveAccountAddress()

          let chainId = this.web3Plug.getActiveNetId()
  
          let contractData = this.web3Plug.getContractDataForNetworkID(chainId)

          let response;

          if(contractData && contractData['cryptopunks']){
           // let punkContractAddress = contractData['cryptopunks'].address

            response = await StarflaskAPIHelper.resolveStarflaskQuery(FrontendHelper.getRouteTo('api'), {requestType: 'punks_balance_by_owner' , input:{ownerAddress: activeAddress  }})
    
            console.log('fetched token ids',  response)
          }
         
         
          if(response && response.output[0]){
            this.ownedTokenIdsArray = response.output[0].tokenIds

           // this.activePunkId =  this.ownedTokenIdsArray[0]

          }else{
            this.ownedTokenIdsArray = []
          }
          

          this.noPunksFound = (this.ownedTokenIdsArray.length == 0)

          if(this.noPunksFound){
            localStorage.setItem('activePunkId', null);
            this.activePunkId = null
          }


          // this.ownedTokenIdsArray = [1164,1,2,3,4,5,6,7,8,1,2,3,4,5,6,7,8,1,2,3,4,5,6,7,8,1,2,3,4,5,6,7,8,1,2,3,4,5,6,7,8,1,2,3,4,5,6,7,8,1,2,3,4,5,6,7,8,]
       },

       async onPunkClicked(punkId){

         if(this.activePunkId == punkId){
           this.activePunkId = null
         }else{
           this.activePunkId=punkId 
         }

         localStorage.setItem('activePunkId', this.activePunkId);
 
         this.getPunksEventEmitter().emit('activePunkChanged', this.activePunkId)
         
         
       },

       getPunksEventEmitter(){
         return punksBarEmitter 
       },

       clearEventEmitter(){
         this.getPunksEventEmitter().removeAllListeners() 
       }
  }
}
</script>
