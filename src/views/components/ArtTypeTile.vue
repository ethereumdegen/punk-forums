<template>
  <div class=" cursor-pointer select-none inline-block m-4" @click="onClicked()">

    <img v-bind:src="imageURL" width="128" height="128" />
      
  </div>
</template>


<script>


export default {
  name: 'ArtTypeTile',
  props: ['imageURL', 'onClickCallback','typeName'],
  data() {
    return {

    }
  },
  created(){

  },
  methods: {
      onClicked(){
        this.onClickCallback(this.typeName)
      }
  }
}
</script>
