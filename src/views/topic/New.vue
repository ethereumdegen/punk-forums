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
          
            

             <div class="my-4">
                 
                <SimpleDropdown
                  ref="categoryDropdown"
                  v-bind:optionList="forumCategoriesOptions" 
                  v-bind:onSelectCallback="onCategorySelected"
                />
                  
              

            </div>
            
             

          
            <div class="mb-4">

                
                 
                <div class="flex flex-col w-1/2">

               
                  <input type="text" v-model="formInputs.name" class="border-gray-200 border-2 p-2 my-2 " placeholder="Title" />

                
                 </div>
              </div>



            <div class="mb-4 flex flex-row">

                
                <div class="flex flex-grow  ">

                 <div class="markdowneditor border-gray-200 border-2 p-2 m-2  w-full " id="editor" >
                      <textarea rows="15" :value="markdownInput" @input="updatemarkdown" class=" w-full"></textarea>
                       
                 </div>
               
                  
                </div>


                  <div class="flex   w-1/2">

                    <div class="markdowneditor border-gray-200 w-full " id="editor" >
                          
                          <div class="w-full preview markdown-body " v-html="compiledMarkdown"></div>
                    </div>
                  
                      
                </div>


              </div>






        



              <div> 


                <div class="  p-4">

                    
                     <div @click="submitTopicForm" class="select-none font-bold  p-2 inline-block bg-blue-400 rounded border-gray-600 hover:border-gray-300 text-white border-2 cursor-pointer  px-8" >Submit</div>

                 
             
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
 import SimpleDropdown from '../components/SimpleDropdown.vue';
 


import StarflaskAPIHelper from '../../js/starflask-api-helper.js';

import FrontendHelper from '../../js/frontend-helper.js'

import  MarkdownIt  from 'markdown-it';

var markdownIt = new MarkdownIt();

//import marked from 'marked'
//import * as sanitizeHtml from 'sanitize-html';

export default {
  name: 'NewTopic',
  props: [],
  components: {Navbar, Footer, TabsBar, SimpleDropdown, Punksbar, NotConnectedToWeb3},
  data() {
    return {

      web3Plug: new Web3Plug() , 


      activeAccountAddress: null,
      
      forumCategoriesOptions: [ ],

      formInputs: {name:null,description:null,priceAmount:1,thumbnailImageURL:null,coverImageURL:null},
      formData: new FormData(),
       
      connectedToWeb3: false,
      

      markdownInput: `
# New topic 

Add details here
       

How To Use The editor
-------------------

1. Type in stuff on the left.
2. See the live updates on the right.


      
      
      `

    }
  },
computed: {
          compiledMarkdown: function() {
 


            return   markdownIt.render(this.markdownInput)
          }
        },
  created(){

 
 
      this.web3Plug.reconnectWeb()
    
       this.web3Plug.getPlugEventEmitter().on('stateChanged', async function(connectionState) {
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
 
    
     
    this.connectedToWeb3 = this.web3Plug.connectedToWeb3()
 
 
    this.fetchForumCategories()


  }, 
  beforeDestroy: function () {
      this.web3Plug.clearEventEmitter()
  },

  methods: {
      onCategorySelected(){
      },

      async fetchForumCategories(){



        let response = await StarflaskAPIHelper.resolveStarflaskQuery('http://localhost:3000/api/v1', {requestType: 'forum_categories' , input:{  }})
    

        this.forumCategoriesOptions =  response.output 
 

      },


      updatemarkdown(e){

          this.markdownInput = e.target.value;

          /* _.debounce(function(e) {
                      this.markdownInput = e.target.value;
                    }, 300)*/

      } ,

        /*
     onCoverImageChange(e) {
      const file = e.target.files[0];
 
     
      this.formData.append("coverImage", file);
 
      this.formInputs.coverImageURL = URL.createObjectURL(file);
 
    },

     onThumbnailImageChange(e) {
      const file = e.target.files[0];

      this.formData.append("thumbnailImage", file); 

      this.formInputs.thumbnailImageURL = URL.createObjectURL(file);
    },*/

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
        selectedCategoryName = selectedCategoryOption.name
      }

      const formData = {
        fromAddress: signerAddress,
        activePunkId: this.$refs.punksbar.getActivePunkId(), 
        category: selectedCategoryName,
        title: this.formInputs.name,
        markdownInput: this.markdownInput,

        signedAt: currentUnixTime,
        accountSignature: accountSignature

      }
      console.log('this.formData',  formData)  
      
     
      let response = await StarflaskAPIHelper.resolveStarflaskQuery(FrontendHelper.getRouteTo('api'), {requestType: 'create_thread' , input:formData } )
   
      console.log('response',response)
      

      if(response.success){
        //redirect to the topic 

        this.$router.push('/topic/'.concat( response.output.topicHash ));


      }
    },



          
  }
}
</script>
