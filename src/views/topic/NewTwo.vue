<template>

<div>

    <div class="section  bg-gray-200  border-b-4 border-black px-0 lg:px-1">

     <div class=" ">
        

      
     </div>


   </div>

 

   <div class="section  bg-white border-b-2 border-black  ">
     <div class="autospacing w-container">
        
     <form id="newTopicForm"  >  

 
       <div class="w-column py-16">
          <div class="text-lg font-bold "> Create a New Topic  </div>
 



             

          <div  v-if=" connectedToWeb3"> 
          
            

             <div class="my-4">
                 
                
                  
              

            </div>
            
             

          
            <div class="mb-4">

                
                 
                <div class="flex flex-col w-1/2">

               
                  
                
                 </div>
              </div>



            <div class="mb-4 flex flex-row">

                
                <div class="flex flex-grow  ">

                
                  
                </div>


                  <div class="flex   w-1/2">

                 
                  
                      
                </div>


              </div>






        



              <div> 


                <div class="  p-4">

                    
                   
                 
             
                </div>


              </div> 


            

          </div>

          
         

          
       </div>

      </form>
     </div>
   </div>


    

 

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

  

  },
  mounted: function () {
 
 


  }, 
  beforeDestroy: function () {
       
  },

  methods: {
      onCategorySelected(){
      },

      async fetchForumCategories(){

 

      },


      updatemarkdown(e){
 

      } ,

      

    onCategorySelectCallback(name){

    },

    async submitTopicForm( ){
 

 
    },



          
  }
}
</script>
