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


        <div class=" pl-16 ">

          
          <div class="text-4xl font-bold" v-if="topicData"> {{topicData.title}}  </div>

           <div class="text-xs  " v-if="topicData.category"> {{topicData.category}}  </div>
          

        </div>

         
         



        <ForumPost 
             v-for="post of postsArray"
            v-bind:postData='post'
            v-bind:activePunkId="activePunkId"
            v-bind:web3Plug="web3Plug"

        />

    

        <hr class="my-4 mt-16 "> 
        <div   v-if="activePunkId">

          <div class="py-4"> 
            
            <div class="inline-block"> Reply as Punk {{ activePunkId }} </div> (<PunkIcon 
            v-bind:iconId='activePunkId'
            v-bind:renderSize=24 />)
            
            
          </div>


            <MarkdownEditor 
              ref="markdownEditor"
              v-bind:placeholder="'reply'"

            />

            <div v-if="activePunkId">
                <div @click="submitReply" class="select-none font-bold  p-2 inline-block bg-blue-400 rounded border-gray-600 hover:border-gray-300 text-white border-2 cursor-pointer  px-8" >Add Reply</div>


            </div>


              <div v-if="errorMessage" class="my-2 p-4 bg-red-500 hover:bg-red-400 text-white rounded"> 
                  Error: {{ errorMessage }}
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
import MarkdownEditor from '../components/MarkdownEditor.vue';
import NotConnectedToWeb3 from '../components/NotConnectedToWeb3.vue'

 

 
import ForumPost from '../components/forum/ForumPost.vue';
import Punksbar from '../components/PunksBar.vue';

import StarflaskAPIHelper from '../../js/starflask-api-helper.js'
import FrontendHelper from '../../js/frontend-helper.js'


import PunkIcon from '../components/PunkIcon.vue'
 

export default {
  name: 'Application',
  props: [],
  components: {Navbar, Footer,  ForumPost,  Punksbar, PunkIcon,  MarkdownEditor, NotConnectedToWeb3},
  data() {
    return {
      web3Plug: new Web3Plug() , 


      topicData:{},

      postsArray: [],

      activePunkId: null,

      errorMessage: null,
       
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
     

      this.refreshTopicData( )


    this.$refs.punksbar.getPunksEventEmitter().on('activePunkChanged', async function(activePunkId) {
      console.log('activePunkChanged',activePunkId);
        
      this.activePunkId = this.$refs.punksbar.getActivePunkId()
    }.bind(this));
    
      this.activePunkId = this.$refs.punksbar.getActivePunkId()


  }, 
  beforeDestroy: function () {
      //this.web3Plug.clearEventEmitter()

      //this.$refs.punksbar.clearEventEmitter()
  },

  methods: {
      async refreshTopicData(){
         this.fetchTopicData(this.$route.params.hash)

      },


      async fetchTopicData(topicHash){
          console.log('fetch topic hash', topicHash)

           let response = await StarflaskAPIHelper.resolveStarflaskQuery(FrontendHelper.getRouteTo('api'), {requestType: 'topic' , input:{topicHash: topicHash }})
           
           if(response.success){
               console.log('got topic results'  ,response )
 

             this.topicData = {
                
                 title: response.output.topicData.title,
                 category: response.output.topicData.category,
                 punkId: response.output.topicData.punkId,
                 topicHash: response.output.topicData.topicHash
             
             }

             this.postsArray = []

             for (let post of response.output.postsArray){
               this.postsArray.push({

                 markdownInput: post.markdownInput, 
                 punkId: post.punkId,
                 createdAt: post.createdAt,
                 postHash: post.postHash

               })
             }


           }


      },


      async submitReply(){

        let signerAddress = this.web3Plug.getActiveAccountAddress() 

        let currentUnixTime = Date.now().toString()

        let accountSignature = await this.web3Plug.requestPersonalSignature( 
        'Signing for Etherpunks at '.concat(currentUnixTime)  )



        const formData = {
          fromAddress: signerAddress,
          punkId: this.activePunkId, 
          parentTopicHash: this.topicData.topicHash,
          
          markdownInput: this.$refs.markdownEditor.getMarkdownInput(),

          signedAt: currentUnixTime,
          accountSignature: accountSignature

        }

         let response = await StarflaskAPIHelper.resolveStarflaskQuery(FrontendHelper.getRouteTo('api'), {requestType: 'create_post' , input:formData } )
   
          console.log('create new post ',response)
          

          if(response.success){

            this.$refs.markdownEditor.resetInput()
            this.refreshTopicData( )

          }else{


              this.errorMessage = response.message 
            }

      }
  }
}
</script>
