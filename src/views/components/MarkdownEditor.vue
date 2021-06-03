<template> 
<div class="mb-4 flex flex-row">

                
                <div class="flex flex-grow  ">

                 <div class="markdowneditor border-gray-200 border-2 p-2 m-2  w-full " id="editor"  >
                      <textarea rows="15" :value="markdownInput" @input="updatemarkdown" class=" w-full"></textarea>
                       
                 </div>
               
                  
                </div>


                  <div class="flex   w-1/2">

                    <div class="markdowneditor border-gray-200 w-full "   >
                          
                          <div class="w-full preview markdown-body " v-html="compiledMarkdown"></div>
                    </div>
                  
                      
                </div>


              </div>
</template> 


<script>
  
import  MarkdownIt  from 'markdown-it';

var markdownIt = new MarkdownIt();

export default {
  name: 'MarkdownEditor',
  props: [ 'placeholder' ],
  components: { },
  data() {
    return {
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
      if(this.placeholder == 'reply'){
        this.markdownInput = ` `
      }
       
  },
  mounted(){

        

      
  },
  methods: {
    updatemarkdown(e){

          this.markdownInput = e.target.value;

          /* _.debounce(function(e) {
                      this.markdownInput = e.target.value;
                    }, 300)*/

    },

    resetInput(){

      this.markdownInput = ''

    },


    getMarkdownInput(){
        return this.markdownInput
     },
     setMarkdownInput(input){
       this.markdownInput = input 
     }

    }
}
</script>
