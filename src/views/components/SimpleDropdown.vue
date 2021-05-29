<template> 

<select name="cars" class="cursor-pointer p-2 bg-white border-2 border-black">
  <option value="volvo">Volvo</option>
  <option value="saab">Saab</option>
  <option value="mercedes">Mercedes</option>
  <option value="audi">Audi</option>
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
           
           if( !this.selectedOptionData  || !this.selectedOptionData.label ){
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
      console.log('sel 1', optionName)
       for(let optionData of this.optionList){
        if(optionData.name.toLowerCase() == (optionName.toLowerCase())){

             console.log('sel 2', optionData)

          this.handleSelectedOptionChanged(optionData)
          return
        }
      } 
    },
    handleSelectedOptionChanged(optionData){

      if(optionData && optionData.label){
        this.selectedOptionData = optionData
        console.log('selected option changed', optionData)
        if(optionData){
          this.onSelectCallback(optionData)
        }
      }
      
      
    } 


  }
}
</script>
