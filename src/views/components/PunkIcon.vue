<template>
  <div class="  ">
       
     <canvas class="pixelfriendly" ref="iconCanvas" v-bind:width="renderSize" v-bind:height="renderSize"> 
         
     </canvas> 


  </div>
</template>


<script>
 
export default {
  name: 'PunkIcon',
  props: ['iconId'],
  components: { },
  data() {
    return {
      renderSize: 48
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
            console.log('render!',canvas.width)
            let iconId = this.iconId
            let iconDimension = this.renderSize;
            let renderSize = this.renderSize
            let cols = 100
            let rows = 100
            let x_index = Math.floor(iconId / cols);
            let y_index = Math.floor(iconId % cols);
            console.log('indices',x_index, y_index)
            const image = new Image(24, 24);
            image.onload = function drawImageActualSize() {
                            console.log('draw!',-renderSize * y_index, -renderSize * x_index, renderSize*cols, renderSize*rows)
                             
                            ctx.drawImage(this,  -iconDimension * y_index   ,-iconDimension *  x_index -5,iconDimension*cols,iconDimension*rows);
                            }
        
            image.src = '/images/punkscomposite.png';
          }

  }
}
</script>
