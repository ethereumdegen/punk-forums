<template>
        <div class=" flex flex-row mt-8"> 
            <div> 
                <PunkIcon v-if="postData.punkId"
                v-bind:iconId='postData.punkId'
                v-bind:renderSize=48
                
                />
            </div> 


              <div  class="w-full border-2 border-gray-200    p-4  "  >

                   <div> Punk #{{ postData.punkId }}  </div>

                   <div class="w-full preview markdown-body" v-html="compiledMarkdown"></div>

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
            return  markdownIt.render( this.postData.markdownInput ) 
          }
        },
  created(){


      var markedImages = require('marked-images');

      marked.use(markedImages({}));

 

  },
  mounted: function () {
  


  }, 
  beforeDestroy: function () {
      this.web3Plug.clearEventEmitter()
  },

  methods: {
      onCategorySelected(){
      },

      
   


          
  }
}
</script>
