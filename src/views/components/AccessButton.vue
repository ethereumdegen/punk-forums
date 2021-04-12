<template>
  <div  @click="buttonClicked" class="inline-block button text-gray-200  bg-gray-900 hover:bg-gray-700   font-bold py-2 px-2 rounded cursor-pointer">
     Sign In 
  </div>
</template>


<script>
export default {
  name: 'AccessButton',
  props: ['accessPlug','web3Plug','providerNetworkID','onClickedCallback'],
  components: {},
  data() {
    return {
      showResponsiveMenu: false
    }
  },
   mounted: async function()
  { 
      //this is required because vue cant detect changes otherwise 
     this.accessPlug.getPlugEventEmitter().on('stateChanged', function(connectionState) {
        this.$forceUpdate();
      }.bind(this));
  },
  
  methods: {
    buttonClicked(){
      this.accessPlug.connect(this.web3Plug)
    }
   
  }
}
</script>