<template>
  <div class=" ">
        
        <div class="mb-4 my-4">
            <label   class="block text-md    text-gray-800  ">NFT Contract Address</label>
            <label   class="block text-md   text-gray-800  "> {{nftContractAddress}}</label>
        </div>


        <div class="mb-4 " v-if="!ownedTokenIdToSell">
            <label   class="block text-md font-medium font-bold text-gray-800  ">NFT Token ID To Sell</label>

            <div class="flex flex-row"  >
                <div class="w-1/2 px-4">
                    <input type="text"   v-model="nftTokenIdToSell"  
                    class="text-gray-900 border-2 border-black font-bold px-4 text-xl focus:ring-indigo-500 focus:border-indigo-500 block w-full py-4 pl-7 pr-12   border-gray-300 rounded-md" placeholder="1">
                </div>

                  <div class="  p-4">
                     <div @click="selectTokenIdToSell()" class="select-none bg-teal-300 p-2 inline-block rounded border-black border-2 cursor-pointer"> Continue </div>
                </div>

                
            </div>
        
          </div>


           <div class="mb-4 " v-if="ownedTokenIdToSell">
                <div>Token ID To Sell: {{ownedTokenIdToSell}}</div>
 
                <div class="text-lg my-4 font-bold">Top Bids To Fulfill</div>
                <div v-if="!selectedBidPacket">

                    <GenericTable
                        v-bind:labelsArray="['currencyType','bidAmount','expires']"
                        v-bind:rowsArray="formattedBidsArray"
                        v-bind:clickedRowCallback="clickedBidRowCallback"
                    />

                </div>

                 <div v-if="selectedBidPacket">
                    <div @click="resetBid()" class="p-1 mx-4 rounded text-xs select-none cursor-pointer bg-purple-500 text-white inline"> Select Different Bid </div>
              
                  <div> bidder: {{selectedBidPacket.bidderAddress}}</div>
                  <div> nftContractAddress: {{selectedBidPacket.nftContractAddress}}</div>
                  <div> currencyTokenAddress: {{selectedBidPacket.currencyTokenAddress}}</div>
                  <div> currencyTokenAmount: {{selectedBidPacket.currencyTokenAmount}}</div>
                  <div> expires:  {{selectedBidPacket.expires}}</div> 
                  <div> signature:  {{selectedBidPacket.signature.signature}}</div> 

                </div>





          </div>

       
  </div>
</template>


<script>

//use THE GRAPH 
 
import GenericTable from './GenericTable.vue';


import BidPacketHelper from '../../js/bidpacket-helper.js'


import BuyTheFloorHelper from '../../js/buythefloor-helper.js'

 
export default {
  name: 'NFTSellForm',
  props: ['nftContractAddress', 'web3Plug'],
  components:{GenericTable},
  data() {
    return {
       nftTokenIdToSell: null,
       ownedTokenIdToSell: null,
       formattedBidsArray: [] ,
       rawBidsArray:{},
       selectedBidPacket:null,

       buyTheFloorHelper: new BuyTheFloorHelper(this.web3Plug)
    }
  },
  created(){

      this.resetForm()

      

      this.fetchRelevantBids()

  },
  methods: {
        async fetchRelevantBids(){

            var hostname = window.location.hostname; 

                //'ws://localhost:8443'
                let serverURL = 'ws://'+hostname+':8443'
                console.log('serverURL',serverURL)

            let bidPackets = await BidPacketHelper.getBidPackets(serverURL,{/*nftContractAddress: this.nftContractAddress*/} )
            console.log('bidPackets',bidPackets)
            
            for(let bid of bidPackets){
                  this.rawBidsArray[bid.signature.signature] = bid
            }
            

            this.formattedBidsArray = bidPackets.map(pkt => (
                                                           {
                                                           // nftContractAddress: this.getNameFromContractAddress(pkt.nftContractAddress),
                                                            currencyTokenAddress: this.buyTheFloorHelper.getNameFromContractAddress(pkt.currencyTokenAddress),
                                                            currencyTokenAmount: this.buyTheFloorHelper.getFormattedCurrencyAmount(pkt.currencyTokenAmount,pkt.currencyTokenAddress).toFixed(4),
                                                            expires: pkt.expires,
                                                            signature: pkt.signature.signature
                                                          } 
                                                        ))

        },
       selectTokenIdToSell(){
         this.ownedTokenIdToSell = this.nftTokenIdToSell
       },
        resetForm(){
         this.ownedTokenIdToSell = null
         this.selectedBidPacket = null 
       },
       clickedBidRowCallback(row){
         console.log('clicked bid row', row)


          this.selectedBidPacket= this.rawBidsArray[row.signature ]

           console.log('this.selectedBidPacket', this.selectedBidPacket)
       },
       resetBid(){
         this.selectedBidPacket = null
       }
  }
}
</script>
