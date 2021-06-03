<template>

<div>

   <div class="section bg-gray-200  border-b-2 border-black px-0 lg:px-1">

     <div class=" ">
        <Navbar 
        v-bind:web3Plug="web3Plug"
      
       />
     </div>


   </div>

    <Punksbar 
        ref="punksbar"
        v-bind:web3Plug="web3Plug"
        
       />



   <div class="section  bg-white border-b-2 border-black  ">
     <div class="autospacing w-container py-16">


        <div class=" flex flex-row mt-8"> 
            <div class="w-1/4"> 


             <div class="  rounded text-black text-xl   p-1"> Punk #{{ punkId }}  </div>

                   <PunkIcon  
                v-bind:iconId='punkId'
                v-bind:renderSize=48
                
                />

                
            </div> 


            <div class=" flex flex-col w-full "> 
              <div  class="w-full border-2 border-gray-200    p-4 mb-4  "   >

                    <div class="my-2 "> Owned by: <a target='_blank' v-bind:href="'https://etherscan.io/address/'+punkData.accountAddress">{{ punkData.accountAddress}}</a> </div>

                   <div class="my-2 ">  View on <a target='_blank' v-bind:href="'https://larvalabs.com/cryptopunks/details/'+punkData.punkId">   Larva Labs Marketplace  </a> </div>
                    <div class="my-2 "> View on <a target='_blank' v-bind:href="'https://opensea.io/accounts/'+punkData.accountAddress">  OpenSea </a> </div>


                  
                 
              </div>


               <div  class="w-full border-2 border-gray-200    p-4 mb-4  "   >
 
                   <div class="text-lg">  Recent Topics  </div>

                    <TopicsList
                      v-bind:topicsArray="recentTopicsArray"
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




import Web3Plug from '../../js/web3-plug.js' 
 


import Navbar from '../components/Navbar.vue';
 
import Footer from '../components/Footer.vue';
import TabsBar from '../components/TabsBar.vue';
import GenericTable from '../components/GenericTable.vue';
import NotConnectedToWeb3 from '../components/NotConnectedToWeb3.vue'

 

 

 import PunkIcon from '../components/PunkIcon.vue'

import TopicsList from '../components/forum/TopicsList.vue';
import Punksbar from '../components/PunksBar.vue';

import StarflaskAPIHelper from '../../js/starflask-api-helper.js'
import FrontendHelper from '../../js/frontend-helper.js'


 

export default {
  name: 'PunkShow',
  props: [],
  components: {Navbar, Footer,  PunkIcon,  Punksbar, TopicsList, NotConnectedToWeb3},
  data() {
    return {
      web3Plug: new Web3Plug() , 

 
      punkData: {},

      recentTopicsArray: [],
       
      connectedToWeb3: false 
    }
  },

     
  created(){

    this.punkId = this.$route.params.punkId
 

    this.web3Plug.getPlugEventEmitter().on('stateChanged', async function(connectionState) {
        console.log('stateChanged',connectionState);
         
        this.activeAccountAddress = connectionState.activeAccountAddress
        this.activeNetworkId = connectionState.activeNetworkId
        this.connectedToWeb3 = this.web3Plug.connectedToWeb3()
        
             this.fetchPunkData(this.punkId)
         
      }.bind(this));
   this.web3Plug.getPlugEventEmitter().on('error', function(errormessage) {
        console.error('error',errormessage);
         
        this.web3error = errormessage
       
      }.bind(this));

      this.web3Plug.reconnectWeb()
    
 

  },
  mounted: function () { 

      this.fetchPunkData(this.punkId)

      this.fetchTopics(this.punkId)
   
  }, 
  methods: {
      async fetchPunkData(punkId){
          console.log('fetch punkId', punkId)

           let response = await StarflaskAPIHelper.resolveStarflaskQuery(FrontendHelper.getRouteTo('api'), {requestType: 'punk' , input:{punkId: punkId }})
           
           if(response.success){
               console.log('got fetch results'  ,response )

               let punkOutputData = response.output[0]
 

             this.punkData = {
                 punkId: punkId, 
                 accountAddress: punkOutputData.accountAddress 
             }
             
           }


      },


      async fetchTopics(punkId){
        let response =  await StarflaskAPIHelper.resolveStarflaskQuery(FrontendHelper.getRouteTo('api'), {requestType: 'topics' , input:{byPunkId: punkId  }})
        console.log('fetch topics', response)
        this.recentTopicsArray = response.output.slice(0,9)
      }

       
  }
}
</script>
