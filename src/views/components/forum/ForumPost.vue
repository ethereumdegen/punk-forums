<template>
        <div class=" flex flex-row mt-8"> 
            <div> 
              <router-link :to="'/punk/'.concat(postData.punkId)">   <PunkIcon v-if="postData"
                v-bind:iconId='postData.punkId'
                v-bind:renderSize=48
                
                /></router-link>

                 <div class="bg-purple-500 rounded text-white text-sm inline-block p-1"> Punk #{{ postData.punkId }}  </div>

            </div> 


              <div  class="w-full border-2 border-gray-200    p-4  " v-if="postData" >

                  
                   <div class="w-full preview markdown-body" v-html="compiledMarkdown" v-if="compiledMarkdown"></div>

              </div>


        </div> 
</template>

<script>
 

 import PunkIcon from '../PunkIcon.vue'


import  MarkdownIt  from 'markdown-it'; 

var markdownIt = new MarkdownIt();


export default {
  name: 'ForumPost',
  props: ['postData'],
  components: {  PunkIcon },
  data() {
    return {
 
 
       

    }
  },
computed: {
          compiledMarkdown: function() {
            if(typeof this.postData.markdownInput != 'string'){
              return null
            }
            return  markdownIt.render( unescape(  this.postData.markdownInput ) ) 
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

      
   


          
  }
}
</script>
