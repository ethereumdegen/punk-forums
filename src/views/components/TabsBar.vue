<template>
  <div   class="    "  style="min-height:90px" v-if="tabArray">
     
    <div v-for="tab in tabArray" 
    class="select-none bg-gray-300 hover:bg-blue-400 cursor-pointer p-4 mx-2 my-4 border-black border-2 rounded-lg inline " 
     :class="{ 'bg-blue-400': (tab == selectedTab) }"
     @click="onClickTab(tab)" >
        {{ tab }}
    </div>


</div>
</template>


<script>
 
 
export default {
  name: 'TabsBar',
  props: [ 'tabArray' , 'onTabSelect' ],
  components:{ },
  data() {
    return {
      selectedTab: this.tabArray[0]
       
    }
  }, 
  created(){
     
     
 
  },
  methods: {
      onClickTab(tabdata){
        this.selectedTab = tabdata
        this.onTabSelect( tabdata )
      }
         
  }
}
</script>