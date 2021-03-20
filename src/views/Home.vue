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
     <div class="autospacing w-container">
       <div class="w-row">

       </div>
       <div class="w-row">
         <div class="column w-col w-col-6  ">



              <router-link to="/newbid" class='text-gray-800 text-xl block'>-> Place a Bid for an NFT</router-link>

               <router-link to="/sell" class='text-gray-800 text-xl block'>-> View and Sell your NFTs</router-link>
            <br>
             <router-link to="/dashboard" class='text-gray-800 text-xl block'>-> View your active bids</router-link>




         </div>
         <div class="column-2 w-col w-col-6"><img src="@/assets/images/coins.svg" width="125" height="125" alt="">

         </div>
       </div>
     </div>
   </div>


    <div class="section  bg-white border-b-2 border-black ">
     <div class="w-container pt-8">

         

        <div class="text-lg text-black p-8">
         Lists of Recent Bids 
        </div>


       <div>
            <TabsBar
                v-bind:tabArray="['Bids' ]"
                v-bind:onTabSelect="onTabSelect" 
            />
          </div>
        <div>

          <div v-if="selectedTab=='bids'" class="mb-4 ">

              <GenericTable
                v-bind:labelsArray="['nftType','currencyType','bidAmount','expires']"
                v-bind:rowsArray="bidRowsArray"
                v-bind:clickedRowCallback="clickedBidRowCallback"
               />

          </div>


        </div>



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
import GenericTable from './components/GenericTable.vue';

import BidPacketHelper from '../js/bidpacket-helper.js'


import BuyTheFloorHelper from '../js/buythefloor-helper.js'

export default {
  name: 'Home',
  props: [],
  components: {Navbar, Footer, TabsBar, GenericTable},
  data() {
    return {
      web3Plug: new Web3Plug() ,
      activePanelId: null,
      selectedTab:"bids",
      bidRowsArray:[],

      buyTheFloorHelper: null
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

      //this.populateContractAddressLookupTable()

      this.buyTheFloorHelper = new BuyTheFloorHelper(this.web3Plug)
      this.fetchBidsData()

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




          },
          async fetchBidsData(){
             var hostname = window.location.hostname; 


             let contractData = this.web3Plug.getContractDataForActiveNetwork() 
             let btfContractAddress = contractData['buythefloor'].address


            //'ws://localhost:8443'
            let serverURL = 'ws://'+hostname+':8443'
            console.log('serverURL',serverURL)

            let bidPackets = await BidPacketHelper.getBidPackets(serverURL)
            console.log('bidPackets',bidPackets)

            bidPackets = bidPackets.filter( (bid) => {
              return (bid.status == 'active')
            } )

             bidPackets = bidPackets.filter( (bid) => {
              return (bid.exchangeContractAddress == btfContractAddress.toLowerCase())
            } )
            
            

            this.bidRowsArray = bidPackets.map(pkt => (
                                                           {
                                                            nftContractAddress: this.buyTheFloorHelper.getNameFromContractAddress(pkt.nftContractAddress),
                                                            currencyTokenAddress: this.buyTheFloorHelper.getNameFromContractAddress(pkt.currencyTokenAddress),
                                                            currencyTokenAmount: this.buyTheFloorHelper.getFormattedCurrencyAmount(pkt.currencyTokenAmount,pkt.currencyTokenAddress).toFixed(4),
                                                            expires: pkt.expires,
                                                            signature: pkt.signature.signature
                                                          } 
                                                        ))
          },

          /*populateContractAddressLookupTable(){
              let contractData = this.web3Plug.getContractDataForActiveNetwork()

              for (const [key, value] of Object.entries(contractData)) {
               this.contractNameLookupTable[value.address] = value.name 
               this.currencyDecimalsLookupTable[value.address] = value.decimals 
              }
              

          },
          getNameFromContractAddress(address){
               
              return this.buyTheFloorHelper.contractNameLookupTable[address]

          },
          getFormattedCurrencyAmount(amount,address){
            let decimals = buyTheFloorHelper.currencyDecimalsLookupTable[address]

            return parseFloat(this.web3Plug.rawAmountToFormatted(amount,decimals))
          },*/

          clickedBidRowCallback(row){
            console.log('clicked bid row',row )

            this.$router.push({ path: `/bid/${row.signature}` })
          }
  }
}
</script>
