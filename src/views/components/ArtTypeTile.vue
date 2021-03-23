<template>
  <div class=" cursor-pointer select-none inline-block m-4 relative" @mouseover="overlayShown=true" @mouseleave="overlayShown=false" @click="onClicked()">

    <img v-bind:src="imageURL" width="128" height="128" />


    <div v-if="overlayShown" class="w-full h-full absolute left-0 top-0 text-white " style="background:#2226; pointer-events:none;"> 
      <div class="absolute w-full text-center p-2" style="top:40%;">  {{type.label}} </div>
    </div>
      
  </div>
</template>


<script>


export default {
  name: 'ArtTypeTile',
  props: ['imageURL', 'onClickCallback','type'],
  data() {
    return {
      overlayShown: false
    }
  },
  created(){

  },
  methods: {
      onClicked(){
        this.onClickCallback(this.type.name)
      }
  }
}
</script>
