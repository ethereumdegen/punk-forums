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
     <div class="autospacing w-container">
        
        
       <div class="w-column py-16">


        <div class=" ">

          
          <div class="text-4xl font-bold"> {{loadedTopicOutputs.title}}  </div>

        </div>

          <div class="text-xs  " v-if="loadedTopicOutputs.category"> {{loadedTopicOutputs.category}}  </div>
          
         



        <ForumPost 
            v-bind:postData='firstPostData'

        />

    

        

          
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

 

 
import ForumPost from '../components/forum/ForumPost.vue';
import Punksbar from '../components/PunksBar.vue';

import StarflaskAPIHelper from '../../js/starflask-api-helper.js'
import FrontendHelper from '../../js/frontend-helper.js'



const categoryColors = require('../../../src/config/categoryColors.json')

export default {
  name: 'Application',
  props: [],
  components: {Navbar, Footer,  ForumPost,  Punksbar, NotConnectedToWeb3},
  data() {
    return {
      web3Plug: new Web3Plug() , 


      loadedTopicOutputs:{},

      firstPostData: {},


       
      connectedToWeb3: false 
    }
  },

     
  created(){

      
 

    this.web3Plug.getPlugEventEmitter().on('stateChanged', async function(connectionState) {
        console.log('stateChanged',connectionState);
         
        this.activeAccountAddress = connectionState.activeAccountAddress
        this.activeNetworkId = connectionState.activeNetworkId
        this.connectedToWeb3 = this.web3Plug.connectedToWeb3()
        
             this.fetchTopicData(this.$route.params.hash)
         
      }.bind(this));
   this.web3Plug.getPlugEventEmitter().on('error', function(errormessage) {
        console.error('error',errormessage);
         
        this.web3error = errormessage
       
      }.bind(this));

      this.web3Plug.reconnectWeb()
    
 

  },
  mounted: function () {
     

      this.fetchTopicData(this.$route.params.hash)
   
  }, 
  methods: {
      async fetchTopicData(topicHash){
          console.log('fetch topic hash', topicHash)

           let response = await StarflaskAPIHelper.resolveStarflaskQuery(FrontendHelper.getRouteTo('api'), {requestType: 'topic' , input:{topicHash: topicHash }})
           
           if(response.success){
               console.log('got topic results'  ,response )

             this.loadedTopicOutputs = response.output 


             this.firstPostData = {
                 markdownInput: this.loadedTopicOutputs.markdownInput ,
                 title: this.loadedTopicOutputs.title,
                 category: this.loadedTopicOutputs.category,
                 punkId: this.loadedTopicOutputs.punkId
             }
           }


      }
  }
}
</script>
