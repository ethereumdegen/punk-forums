<template> 

<select name="cars" class="cursor-pointer p-2 bg-white border-2 border-black">
  <option v-for="item in optionList" v-bind:value="item">{{item}}</option>
 
</select>



</template> 


<script>
  

export default {
  name: 'SimpleDropdown',
  props: [ 'optionList' , 'onSelectCallback' ],
  components: { },
  data() {
    return {
        
    }
  },
  watch: {
    optionList: function (optionList) {
      console.log('watch optionList',this.optionList)
        if(this.optionList && this.optionList.length > 0){
           
           if( !this.selectedOptionData    ){
             console.log('handleSelectedOptionChanged')
                this.handleSelectedOptionChanged( this.optionList[0] )
           }
           
      }
    } 
  },


  created(){
      if(this.optionList && this.optionList.length > 0){
            this.handleSelectedOptionChanged( this.optionList[0] )
          
      }
       
  },
  mounted(){

        if(this.optionList && this.optionList.length > 0){ 

          this.handleSelectedOptionChanged( this.optionList[0] )
      }

      
  },
  methods: {
    onChange(optionName, hideMethod) {        
        
         hideMethod() 

        this.selectOptionByName(optionName)
    },
    selectOptionByName(optionName){
       
       for(let optionData of this.optionList){
        if(optionData.toLowerCase() == (optionName.toLowerCase())){
 

          this.handleSelectedOptionChanged(optionData)
          return
        }
      } 
    },
    handleSelectedOptionChanged(optionData){

      if(optionData ){
        this.selectedOptionData = optionData
        console.log('selected option changed', optionData)
        if(optionData){
          this.onSelectCallback(optionData)
        }
      }
      
      
    },
    getSelectedOption(){
      return this.selectedOptionData
    }


  }
}
</script>
