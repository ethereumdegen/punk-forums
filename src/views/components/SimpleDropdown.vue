<template> 

<select class="cursor-pointer p-2 bg-white border-2 border-black" @change="onChange($event)">
  <option ref="optionSelect" v-for="item in optionList"  > {{item}} </option>
 
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
    onChange(event, hideMethod) {        
        
        // hideMethod() 

          console.log('meep', event )
        this.handleSelectedOptionChanged(event.target.value)
    },
    
    handleSelectedOptionChanged(optionData){

       console.log('selected option changed', optionData)

      if(optionData ){
        this.selectedOptionData = optionData
       
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
