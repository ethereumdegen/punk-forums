<template>

<div>

    <div class="section  bg-gray-200  border-b-4 border-black px-0 lg:px-1">

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
        
     <form id="newTopicForm"  >  

 
       <div class="w-column py-16">
          <div class="text-lg font-bold "> Create a New Topic  </div>
 



              <div  class=" " v-if="!connectedToWeb3">
                      <NotConnectedToWeb3 />
                  </div>
 


          <div  v-if=" connectedToWeb3"> 
          
          <div class="py-4" v-if="activePunkId"> 
            
            <div class="inline-block">   Punk {{ activePunkId }} </div> 
            (<PunkIcon 
            v-bind:iconId='activePunkId'
            v-bind:renderSize=24 />)
            
            
          </div>


             <div class="my-4">
                 
                <SimpleDropdown
                  ref="categoryDropdown"
                  v-if="forumCategoriesOptions"
                  v-bind:optionList="forumCategoriesOptions" 
                  v-bind:onSelectCallback="onCategorySelected"
                />
                  
              

            </div>
            
             
            
          
            <div class="mb-4">

                
                 
                <div class="flex flex-col w-1/2">

               
                  <input type="text" v-if="formInputs" v-model="formInputs.name" class="border-gray-200 border-2 p-2 my-2 " placeholder="Title" />

                
                 </div>
              </div>


            <MarkdownEditor 
              ref="markdownEditor"
            />
           
 


              <div> 


                <div class="  p-4" v-if="activePunkId">

                    
                     <div @click="submitTopicForm" class="select-none font-bold  p-2 inline-block bg-blue-400 rounded border-gray-600 hover:border-gray-300 text-white border-2 cursor-pointer  px-8" >Submit</div>

                 
             
                </div>


                   <div class="  p-4" v-if="!activePunkId">

                     <div class="py-4"> Sign in with a Cryptopunk to post. </div>
                     <div  class="select-none font-bold  p-2 inline-block bg-gray-400 rounded border-gray-600 hover:border-gray-300 text-white border-2 cursor-pointer  px-8" >Submit</div>

                 
             
                </div>



                <div v-if="errorMessage" class="p-4 bg-red-500 hover:bg-red-400 text-white rounded"> 
                  Error: {{ errorMessage }}
                </div>


              </div> 


            

          </div>

          
         

          
       </div>

      </form>
     </div>
   </div>


    


    
  <Footer/>

</div>
</template>


<script>



import NotConnectedToWeb3 from '../components/NotConnectedToWeb3.vue'

import Web3Plug from '../../js/web3-plug.js' 
 

import Navbar from '../components/Navbar.vue';
 
import Footer from '../components/Footer.vue';
import TabsBar from '../components/TabsBar.vue';
import Punksbar from '../components/PunksBar.vue';

import PunkIcon from '../components/PunkIcon.vue';
import SimpleDropdown from '../components/SimpleDropdown.vue';
import MarkdownEditor from '../components/MarkdownEditor.vue';
  

import StarflaskAPIHelper from '../../js/starflask-api-helper.js';

import FrontendHelper from '../../js/frontend-helper.js'

const categoriesData = require('../../config/topicCategories.json')
//import marked from 'marked'
//import * as sanitizeHtml from 'sanitize-html';

export default {
  name: 'NewTopic',
  props: [],
  components: {Navbar, Footer, TabsBar, SimpleDropdown, Punksbar, PunkIcon, MarkdownEditor, NotConnectedToWeb3},
  data() {
    return {

      web3Plug: new Web3Plug() , 


      activeAccountAddress: null,
      activePunkId: null,
      
      forumCategoriesOptions: [ ],

      formInputs: {name:null,description:null,priceAmount:1,thumbnailImageURL:null,coverImageURL:null},
      formData: new FormData(),
       
      connectedToWeb3: false ,

      errorMessage: null 
       
     

    }
  },
 
  created(){

 
 
      this.web3Plug.reconnectWeb()
    
       this.web3Plug.getConnectionStateEmitter().on('newTopic', async function(connectionState) {
        console.log('stateChanged nt ',connectionState);
         
        this.activeAccountAddress = connectionState.activeAccountAddress
        this.activeNetworkId = connectionState.activeNetworkId
        
 
        this.connectedToWeb3 = this.web3Plug.connectedToWeb3()
         
         
      }.bind(this));
   this.web3Plug.getPlugEventEmitter().on('error', function(errormessage) {
        console.error('error',errormessage);
         
        this.web3error = errormessage
       
      }.bind(this));






  },
  mounted: function () {
 

    this.web3Plug.reconnectWeb()
     
    this.connectedToWeb3 = this.web3Plug.connectedToWeb3()
 
 
    this.fetchForumCategories()



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
      onCategorySelected(){
      },

      async fetchForumCategories(){

  
        this.forumCategoriesOptions = categoriesData.map(x => x.name)
 

      },


    
         
    onCategorySelectCallback(name){

    },

    async submitTopicForm( ){
 


    /*  var entireForm = document.querySelector("#newApplicationForm");

      const formData = new FormData(entireForm);
      console.log('submit form', formData)
 

     // this.formInputs.formData =  this.formData

      */ 

      let signerAddress = this.web3Plug.getActiveAccountAddress() 

      let currentUnixTime = Date.now().toString()

      console.log(this.web3Plug.getWeb3Instance())

      let accountSignature = await this.web3Plug.requestPersonalSignature( 
        'Signing for Etherpunks at '.concat(currentUnixTime)  )


 


      let selectedCategoryOption = this.$refs.categoryDropdown.getSelectedOption()

      let selectedCategoryName = null

      if(selectedCategoryOption){
        selectedCategoryName = selectedCategoryOption 
      }

      const formData = {
        fromAddress: signerAddress,
        punkId: this.activePunkId, 
        category: selectedCategoryName,
        title: this.formInputs.name,
        markdownInput: this.$refs.markdownEditor.getMarkdownInput(),

        signedAt: currentUnixTime,
        accountSignature: accountSignature
      }


      console.log('this.formData',  formData)  
      
     
      let response = await StarflaskAPIHelper.resolveStarflaskQuery(FrontendHelper.getRouteTo('api'), {requestType: 'create_thread' , input:formData } )
   
      console.log('response',response)
      

      if(response.success){
        //redirect to the topic 

        this.$router.push('/topic/'.concat( response.output.topicHash ));


      }else{


        this.errorMessage = response.message 
      }
    },



          
  }
}
</script>
