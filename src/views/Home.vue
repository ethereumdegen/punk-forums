<template>

<div>

   <div class="section  bg-white border-b-2 border-black px-0 lg:px-1">

     <div class=" ">
        <Navbar 
        v-bind:web3Plug="web3Plug"
       />
     </div>


   </div>

  

   <div class="section  bg-white border-b-2 border-black">
     <div class=" w-container">
       <div class="w-row">

       </div>
       <div class="w-row">

         


         <div class="column w-col w-col-6 mt-8 py-8">

            Starflask API 


         </div>
         <div class="column-2 w-col w-col-6  ">
           
             



         </div>
       </div>
     </div>
   </div>


    <div class="section  bg-white border-b-2 border-black ">
     <div class="w-container pt-8">

         

        

        
         


     </div>
   </div>



    
  <Footer/>

</div>
</template>


<script>



import Web3Plug from '../js/web3-plug.js' 

 
import Navbar from './components/Navbar.vue';
 
import Footer from './components/Footer.vue';
import TabsBar from './components/TabsBar.vue';
 
import BidPacketHelper from '../js/bidpacket-helper.js'


import BuyTheFloorHelper from '../js/buythefloor-helper.js'
import TheGraphHelper from '../js/the-graph-helper.js';
import StarflaskAPIHelper from '../js/starflask-api-helper.js';


export default {
  name: 'Home',
  props: [],
  components: {Navbar, Footer, TabsBar,  },
  data() {
    return {
      web3Plug: new Web3Plug() ,
      activePanelId: null,
      selectedTab:"bids",
      bidRowsArray:[],
      salesRowsArray: [], 
      nftContractOptionsList: [] ,
      filterByNFTContractAddress: null,

      
    }
  },

  created(){

 
    this.web3Plug.getPlugEventEmitter().on('stateChanged', function(connectionState) {
        console.log('stateChanged',connectionState);
         
        this.activeAccountAddress = connectionState.activeAccountAddress
        this.activeNetworkId = connectionState.activeNetworkId

        
          

         
      }.bind(this));
   this.web3Plug.getPlugEventEmitter().on('error', function(errormessage) {
        console.error('error',errormessage);
         
        this.web3error = errormessage
       
      }.bind(this));

      this.web3Plug.reconnectWeb()

         
      this.fetchOwnedAssets(  )

  },
  mounted: function () {
    
   
   
  }, 
  methods: {
          setActivePanel(panelId){
              if(panelId == this.activePanelId){
                this.activePanelId = null;
                return 
              }
               this.activePanelId = panelId ;
          },
          onTabSelect(tabname){
            console.log(tabname)

              this.selectedTab = tabname.toLowerCase()


          },

          async fetchOwnedAssets(){

            let apiURI = 'http://localhost:3000/api/v1/testapikey'
            let inputData = {requestType: 'all_ERC721', publicAddress:'0x99a848F6d8bb6D6Cd1A524B3C99a97e41e1E4b5A'} 
            let results = await StarflaskAPIHelper.resolveStarflaskQuery(apiURI ,  inputData   )
            console.log(results)

          },

          clickedBidRowCallback(row){
            console.log('clicked bid row',row )

            this.$router.push({ path: `/bid/${row.signature}` })
          },

          clickedSalesRowCallback(row){
            console.log('clicked sales row',row )


            window.open(this.web3Plug.getExplorerLinkForTxHash(row.txHash, 1  ));
          } 

  }
}
</script>
