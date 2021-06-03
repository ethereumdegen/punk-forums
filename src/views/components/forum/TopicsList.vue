<template>
<div> 
  <table class="table-auto w-full" >
        <thead>
            <tr style="text-align: left;" class="text-sm text-gray-600 border-b-2 border-gray-400">
                <th>Topic</th>
                <th> </th>
                 <th> Category </th>
                <th>Replies</th>
                <th>Views</th>
                 
            </tr>
        </thead>  

        <tbody>

            <TopicRow 
                v-if="visibleTopicsArray"
                v-for='row in visibleTopicsArray'
                v-bind:rowData='row'
            />
           
        </tbody>
        

 </table>

   <div class="p-2" v-if="maxPages > 1">

      <div v-for="i in maxPages" :key="i" class="border-black border-2 mx-1 p-1 px-2 inline-block cursor-pointer" :class="{'bg-purple-400': i == pageNumber }" @click="selectPage(i)"> {{i}} </div> 
    
    </div> 

</div> 
</template>


<script>
 import TopicRow from './TopicRow.vue'

const rowsPerPage = 14 

export default {
  name: 'TopicsList2',
   props: [ 'topicsArray', 'paginated' ],
    components: {TopicRow},
  data() {
    return {
      visibleTopicsArray: [] ,
      pageNumber: 1 ,
      maxPages: 1
    }
  }, 
  watch: {
    pageNumber: function (val) {
      
      if(this.paginated){
        this.refreshPagination()
      }

    } ,
     topicsArray: function (val) {
      
      if(this.paginated){
        this.refreshPagination()
      }else{
        this.visibleTopicsArray = this.topicsArray
      }

    } 
  },

  mounted(){
     
   
  },
  methods: {
    refreshPagination(){
      
        let startIndex = (this.pageNumber-1) *rowsPerPage;
        let endIndex = startIndex+rowsPerPage

        this.maxPages = Math.ceil(  this.topicsArray.length / rowsPerPage )

        if(this.maxPages > 9) this.maxPages = 9 

        console.log('refreshPagination',startIndex,endIndex, this.maxPages)

        this.visibleTopicsArray = this.topicsArray.slice( startIndex, endIndex  )
    },
    selectPage(pageNumber){
      this.pageNumber = pageNumber
    }
  }
}
</script>
