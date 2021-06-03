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

                  
                   <div class="w-full preview markdown-body" v-html="compiledMarkdown" v-if="!editing"></div>

                    <div class="border-t-2 border-gray-300 text-xs mt-2 flex" v-if="!editing">
                       <div class="flex-grow">  <a href="javascript:void(0);" v-if="canEdit() == true" @click="startEditingPost"> Edit </a> <span v-if="canEdit() == true"> |  </span> <a href="javascript:void(0);" v-if="canEdit() == true" @click="deletePost"> Delete </a>  </div> 
                       <div class="text-gray-600">  {{ postTimeFormatted }} </div> 
                    </div>




                    <MarkdownEditor 
                      v-if="editing"
                      ref="markdownEditor"
                     />

                    <div class="border-t-2 border-gray-300 text-xs mt-2 flex" v-if="editing">
                       <div class="flex-grow">  <a href="javascript:void(0);" v-if="canEdit() == true" @click="submitPostEdits"> Submit Edits </a> <span v-if="canEdit() == true"> |  </span>   <a href="javascript:void(0);"  @click="stopEditingPost"> Cancel Edits </a>  </div> 
                       <div class="text-gray-600">   </div> 
                    </div>

              </div>


        </div> 
</template>

<script>
 

 import PunkIcon from '../PunkIcon.vue'
import FrontendHelper from '../../../js/frontend-helper.js'

import StarflaskAPIHelper from '../../../js/starflask-api-helper.js'

import MarkdownEditor from '../MarkdownEditor.vue'

import  MarkdownIt  from 'markdown-it'; 

var markdownIt = new MarkdownIt();

import swal from 'sweetalert';

export default {
  name: 'ForumPost',
  props: ['postData','activePunkId','web3Plug'],
  components: {  PunkIcon, MarkdownEditor },
  data() {
    return {
      editing:false
 
       

    }
  },
computed: {
          compiledMarkdown: function() {
            if(typeof this.postData.markdownInput != 'string'){
              return null
            }
            return  markdownIt.render( unescape(  this.postData.markdownInput ) ) 
          },
          postTimeFormatted: function(){
             let tSince = FrontendHelper.timeSince(  this.postData.createdAt ) 

            return tSince + ' ago'
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

      canEdit(){
        return  parseInt(this.postData.punkId) == parseInt( this.activePunkId  )

      },
      startEditingPost(){
        this.editing = true
        this.$nextTick(function () {
         this.$refs.markdownEditor.setMarkdownInput( unescape( this.postData.markdownInput ) )
        })
        

      },
      stopEditingPost(){
        this.editing = false


      },
      async submitPostEdits(){
        console.log('submitPostEdits')

        let updatedPostData = {} //from response
        
         let signatureOutput = await FrontendHelper.etherPunksPersonalSign( this.web3Plug )

   

            const formData = {
              fromAddress: signatureOutput.signerAddress,
              punkId: this.postData.punkId, 
              postHash: this.postData.postHash,
              
              markdownInput: this.$refs.markdownEditor.getMarkdownInput(),

              signedAt: signatureOutput.signedAt,
              accountSignature: signatureOutput.accountSignature

            }

            let response = await StarflaskAPIHelper.resolveStarflaskQuery(FrontendHelper.getRouteTo('api'), {requestType: 'edit_post' , input:formData } )

            console.log('edit response' , response)


        if(response.success){
            this.postData.markdownInput = response.output.markdownInput

            this.stopEditingPost()
        }
      

      },
      async deletePost(){
      

        swal({
            title: "Are you sure?",
            text: "This will delete your post.",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then(async (willDelete) => {
            if (willDelete) {
                console.log('delete post')

                let signatureOutput = await FrontendHelper.etherPunksPersonalSign( this.web3Plug )


                 
                  const formData = {
                    fromAddress: signatureOutput.signerAddress,
                    punkId: this.postData.punkId, 
                    postHash: this.postData.postHash,
                     
                    signedAt: signatureOutput.signedAt,
                    accountSignature: signatureOutput.accountSignature
                  }

                  let response = await StarflaskAPIHelper.resolveStarflaskQuery(FrontendHelper.getRouteTo('api'), {requestType: 'delete_post' , input:formData } )
      
                  console.log('delete response' , response)

                  if(response.success){
                  swal({
                    title: "Operation successful",
                    text: "Your post has been deleted.",
                    icon: "warning",
                    buttons: false,
                    dangerMode: false,
                  })

                  }
                 
            } else {
             // swal("Your imaginary file is safe!");
            }
          });

      }

      
   


          
  }
}
</script>
