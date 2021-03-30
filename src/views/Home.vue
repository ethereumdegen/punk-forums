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



              <router-link to="/newbid" class='text-gray-800 text-xl block'>-> Place a Bid for an NFT</router-link>

               <router-link to="/startselling" class='text-gray-800 text-xl block'>-> View and Sell your NFTs</router-link>
            <br>
             <router-link to="/dashboard" class='text-gray-800 text-xl block'>-> View your active bids</router-link>




         </div>
         <div class="column-2 w-col w-col-6  ">
           
              <FrontPageMedia />

             



         </div>
       </div>
     </div>
   </div>


    <div class="section  bg-white border-b-2 border-black ">
     <div class="w-container pt-8">

         

        

       <div>
            <TabsBar
                v-bind:tabArray="[{id:'Bids',label:'Recent Bids'},{id:'Sales',label:'Recent Sales'} ]"
                v-bind:onTabSelect="onTabSelect" 
            />
          </div>
        <div>

          <div v-if="selectedTab=='bids'" class="mb-4 ">


              <div class="mb-4">
                        <label class="hidden block text-md font-medium font-bold text-gray-800  ">Filter by NFT Type</label>
                        

                        <div class="flex flex-row">

                            <GenericDropdown
                              v-bind:optionList="nftContractOptionsList" 
                              v-bind:onSelectCallback="onNFTContractSelectCallback"
                            />
                          
                        </div>


               </div>




              <GenericTable
                v-bind:labelsArray="['nftType','currencyType','bidAmount','expires']"
                v-bind:rowsArray="bidRowsArray"
                v-bind:clickedRowCallback="clickedBidRowCallback"
               />

          </div>

           <div v-if="selectedTab=='sales'" class="mb-4   ">


              <GenericTable
                v-bind:labelsArray="['blockNumber','nftType','currencyType','bidAmount' ]"
                v-bind:rowsArray="salesRowsArray"
                v-bind:clickedRowCallback="clickedSalesRowCallback"
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
import GenericDropdown from './components/GenericDropdown.vue';
import FrontPageMedia from './components/FrontPageMedia.vue';

import BidPacketHelper from '../js/bidpacket-helper.js'


import BuyTheFloorHelper from '../js/buythefloor-helper.js'
import TheGraphHelper from '../js/the-graph-helper.js';

export default {
  name: 'Home',
  props: [],
  components: {Navbar, Footer, TabsBar, GenericTable, GenericDropdown,FrontPageMedia},
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

        
         
         
        this.fetchBidsData()
        this.fetchSalesData()

         
      }.bind(this));
   this.web3Plug.getPlugEventEmitter().on('error', function(errormessage) {
        console.error('error',errormessage);
         
        this.web3error = errormessage
       
      }.bind(this));

      this.web3Plug.reconnectWeb()

         
       
        
      this.fetchBidsData()
      this.fetchSalesData()

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
          async fetchBidsData(){

            
             var hostname = window.location.hostname;
             
             let chainId = this.web3Plug.getActiveNetId()

             if(chainId==null){
               chainId = 1 
               console.log('no web3 connection')
             }

              let allNFTTypes = BuyTheFloorHelper.getClientConfigForNetworkId(chainId).nftTypes 
             this.nftContractOptionsList = [{'name':null,'label':'all'} ].concat( allNFTTypes )
     


             let contractData = this.web3Plug.getContractDataForNetworkID(chainId) 
             let btfContractAddress = contractData['buythefloor'].address


             
            let serverURL = BuyTheFloorHelper.getSocketURL(chainId)
            console.log('serverURL',serverURL)

            let query = {exchangeContractAddress: btfContractAddress, status:'active', suspended:false  }

             if(this.filterByNFTContractAddress){
              query.nftContractAddress = this.filterByNFTContractAddress
            }


            let bidPackets = await BidPacketHelper.getBidPackets(serverURL, query)
            console.log('bidPackets',bidPackets)

           /* bidPackets = bidPackets.filter( (bid) => {
              return (bid.status == 'active')
            } )

             bidPackets = bidPackets.filter( (bid) => {
              return (bid.exchangeContractAddress == btfContractAddress.toLowerCase())
            } )*/
            
            
            this.bidRowsArray = bidPackets.map(pkt => (
                                                           {
                                                            nftContractAddress: BuyTheFloorHelper.getNameFromContractAddress(pkt.nftContractAddress,pkt.requiredProjectId, chainId),
                                                            
                                                            currencyTokenAddress: BuyTheFloorHelper.getNameFromContractAddress(pkt.currencyTokenAddress, 0, chainId),
                                                            currencyTokenAmount: BuyTheFloorHelper.getFormattedCurrencyAmount(pkt.currencyTokenAmount,pkt.currencyTokenAddress, chainId),
                                                            expires: pkt.expires,
                                                            
                                                            requiredProjectId: pkt.requiredProjectId,
                                                            signature: pkt.signature.signature
                                                          } 
                                                        ))

             this.bidRowsArray.sort(function(a, b) {
              return b.currencyTokenAmount - a.currencyTokenAmount;
            })
          },

         async fetchSalesData(){

            let chainId =  1
            

              let recentSales = await TheGraphHelper.findBoughtTheFloorHistory()


               this.salesRowsArray = recentSales.map(sale => (
                                                           {
                                                             blockNumber: sale.blockNumber ,
                                                            nftContractAddress: BuyTheFloorHelper.getNameFromContractAddress(sale.nftContractAddress,sale.requiredProjectId, chainId),
                                                            
                                                            currencyTokenAddress: BuyTheFloorHelper.getNameFromContractAddress(sale.currencyTokenAddress,0, chainId),
                                                            currencyTokenAmount: BuyTheFloorHelper.getFormattedCurrencyAmount(sale.currencyTokenAmount,sale.currencyTokenAddress, chainId),
                                                            
                                                            requiredProjectId: sale.requiredProjectId,
                                                            txHash: sale.id
                                                          } 
                                                        ))


              console.log('recentSales', this.salesRowsArray)

         },

          clickedBidRowCallback(row){
            console.log('clicked bid row',row )

            this.$router.push({ path: `/bid/${row.signature}` })
          },

          clickedSalesRowCallback(row){
            console.log('clicked sales row',row )


            window.open(this.web3Plug.getExplorerLinkForTxHash(row.txHash, 1  ));
          },

          onNFTContractSelectCallback(nftType){
            let name = nftType.name 

            let chainId = this.web3Plug.getActiveNetId()
            if(!chainId) chainId = 1;

            let contractData = this.web3Plug.getContractDataForNetworkID(chainId)

              if(contractData[name]){
                let contractAddress = contractData[name].address

                this.filterByNFTContractAddress = contractAddress
            }else{
              this.filterByNFTContractAddress = null
            }

            this.fetchBidsData()
             
          }
  }
}
</script>
