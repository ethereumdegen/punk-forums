<template>
  <div class=" ">
      NFT Gallery 


       
  </div>
</template>


<script>

//use THE GRAPH 

import TheGraphHelper from '../../js/the-graph-helper.js'
import NFTHelper from '../../js/nft-helper.js'

export default {
  name: 'NFTGallery',
  props: ['nftContractAddress', 'web3Plug'],
  data() {
    return {
      ownedTokenIdsArray: [] 
    }
  },
  created(){

      this.fetchOwnedTokenIds()


  },
  methods: {
       async fetchOwnedTokenIds(){
          let activeAddress = this.web3Plug.getActiveAccountAddress()

          let nftDataArray = await NFTHelper.findERC721TokensOwnedBy(this.web3Plug,this.nftContractAddress,activeAddress,)
       
          console.log('nftDataArray',nftDataArray)
          this.ownedTokenIdsArray = nftDataArray
       }
  }
}
</script>
