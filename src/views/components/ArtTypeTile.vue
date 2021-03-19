<template>
  <div class=" cursor-pointer select-none " @click="onClicked">

    <img v-bind:src="imageURL" width="128" height="128" />
      
  </div>
</template>


<script>


export default {
  name: 'ArtTypeTile',
  props: ['imageURL', 'onClickCallback'],
  data() {
    return {

    }
  },
  created(){

  },
  methods: {
      onClicked(){
        this.onClickCallback()
      }
  }
}
</script>
