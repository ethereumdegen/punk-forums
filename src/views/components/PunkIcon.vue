<template>
  <div class=" p2 select-none cursor-pointer inline-block"   @click="onClickedCallback(iconId)" >
       
     <canvas class="pixelfriendly pt-1" ref="iconCanvas" v-bind:width="renderSize" v-bind:height="renderSize"> 
         
     </canvas> 


  </div>
</template>


<script>
 
export default {
  name: 'PunkIcon',
  props: ['iconId','renderSize','onClickedCallback', 'largeSize'],
  components: { },
  data() {
    return {
       
    }
  },
    watch: {
    
      iconId: function ( ) {
          this.renderIcon( )
      }
  },
  mounted(){ 
       this.renderIcon( )
  },
  methods: {
       
        renderIcon( ) {

          console.log('token id', this.iconId)

            var canvas = this.$refs.iconCanvas  
            const ctx = canvas.getContext('2d');

            ctx.webkitImageSmoothingEnabled = false;
            ctx.mozImageSmoothingEnabled = false;
            ctx.imageSmoothingEnabled = false;


            ctx.clearRect(0, 0, canvas.width, canvas.height);
             
            let iconId = this.iconId
            let iconDimension = this.renderSize;
            let renderSize = this.renderSize
            let cols = 100
            let rows = 100
            let x_index = Math.floor(iconId / cols);
            let y_index = Math.floor(iconId % cols);
            
            const image = new Image(24, 24);
            image.onload = function drawImageActualSize() {
                               
                            ctx.drawImage(this,  -iconDimension * y_index   ,-iconDimension *  x_index -2,iconDimension*cols,iconDimension*rows);
                            }
        
            image.src = '/images/punkscomposite.png';
          }

  }
}
</script>
