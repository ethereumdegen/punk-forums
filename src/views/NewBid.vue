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
        
        
          <div class="text-xl font-bold mb-8"> Place a new bid </div>


          <div  class=" " v-if="!connectedToWeb3">
              <NotConnectedToWeb3 />
          </div>

          <div id="form  " class=" " v-if="connectedToWeb3">
            
            <div class="mb-4">
                <label   class="block text-md font-medium font-bold text-gray-800  ">NFT Type To Buy The Floor</label>
                
                <GenericDropdown
                  v-bind:optionList="nftOptionsList" 
                  v-bind:onSelectCallback="onNFTSelectCallback"
                />
            </div>


           


             <div class="mb-4">
                <label   class="block text-md font-medium font-bold text-gray-800  ">Bid Currency Token</label>
                

                <div class="flex flex-row">

                <GenericDropdown
                  v-bind:optionList="currencyTokensOptionsList" 
                  v-bind:onSelectCallback="onCurrencySelectCallback"
                />
                  <div class="mb-4 p-4 ml-8" v-if="formInputs.tokenContractAddress">
                    Balance: {{ getSelectedCurrencyBalanceFormatted() }}
                </div>
                </div>


            </div>

            

              
           <div class="mb-4 ">
              <label   class="block text-md font-medium font-bold text-gray-800  ">Bid Amount</label>

              <div class="flex flex-row">
              <div class="w-1/2 px-4">
                    <input type="text" name="price" v-model="formInputs.tokenBidAmount"  class="text-gray-900 border-2 border-black font-bold px-4 text-xl focus:ring-indigo-500 focus:border-indigo-500 block w-full py-4 pl-7 pr-12   border-gray-300 rounded-md" placeholder="0.00">
                </div>

                  <div class="w-1/2 px-4" @click="approveCurrencyToken" v-if=" !selectedCurrencyIsApproved()">
                     <div class="select-none bg-teal-300 p-2 inline-block rounded border-black border-2 cursor-pointer"> Approve </div>
                </div>
              </div>
           
            </div>



          </div>


          <hr>
          <div class="py-4" v-if="selectedCurrencyIsApproved()">
             
 

            <div> nftAddress: {{formInputs.nftContractAddress}}</div>

            <div> CurrencyAddress: {{formInputs.tokenContractAddress}}</div>

            <div> bidAmount: {{formInputs.tokenBidAmount}}</div>

                 <div class="  p-4">
                     <div @click="signForBid" class="select-none bg-teal-300 p-2 inline-block rounded border-black border-2 cursor-pointer"> Sign for Bid </div>
                </div>


          </div>



            <div id="output" v-if="submittedBidPacketResponse">
            

                  {{ submittedBidPacketResponse }}


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

import GenericDropdown from './components/GenericDropdown.vue'

import BidPacketUtils from '../js/bidpacket-utils.js'

import BidPacketHelper from '../js/bidpacket-helper.js'

const nftTokenContracts= ['cryptopunks','mooncats']

const currencyTokenContracts= ['0xbtc','weth']

import BigNumber from 'bignumber.js'

import NotConnectedToWeb3 from './components/NotConnectedToWeb3.vue'

var updateTimer;

export default {
  name: 'Home',
  props: [ ],
  components: {Navbar, Footer, GenericDropdown,NotConnectedToWeb3},
  data() {
    return {
      web3Plug: new Web3Plug(),
      formInputs: {
        
        tokenContractAddress: null,
        tokenDecimals: 18,

        nftContractAddress: null,
        tokenBidAmountRaw: 0,
        expiresAtBlock:0 
        
      },

      connectedToWeb3: false,
                         
      ApproveAllAmount: 1000000000000000000000000000000,
      tokensApproved:{},
      tokenBalances:{},
      currencyTokensOptionsList:[ ],
      nftOptionsList:[ ],
      submittedBidPacketResponse: null,
    }
  },
  computed: {
     
   
  },
  created(){

    this.web3Plug.getPlugEventEmitter().on('stateChanged', function(connectionState) {
        console.log('stateChanged',connectionState);
         
        this.activeAccountAddress = connectionState.activeAccountAddress
        this.activeNetworkId = connectionState.activeNetworkId

        this.connectedToWeb3 = this.web3Plug.connectedToWeb3()
         
         
      }.bind(this));
   this.web3Plug.getPlugEventEmitter().on('error', function(errormessage) {
        console.error('error',errormessage);
         
        this.web3error = errormessage
        
      }.bind(this));


      this.web3Plug.reconnectWeb()
    this.initOptionsLists()

  },
  mounted () {
    
    


      updateTimer = setInterval(this.updateBalances.bind(this), 5000);
   
    
  }, 

  beforeDestroy(){
      clearInterval(updateTimer) 
  },
  methods: {
         initOptionsLists(){ 

          this.currencyTokensOptionsList=[{'name':'weth','label':'wEth'},{'name':'0xbitcoin','label':'0xBTC'}],
          this.nftOptionsList=[{'name':'artsale','label':'artsale'},{'name':'wrappedcryptopunks','label':'Cryptopunks'}]

         },
         async updateBalances(){
          
          let contractData = this.web3Plug.getContractDataForActiveNetwork()

          let activeAddress = this.web3Plug.getActiveAccountAddress()
          let currencyAddress = this.formInputs.tokenContractAddress

          

          let btfContractAddress = contractData['buythefloor'].address

          console.log('currencyAddress',currencyAddress)
          
          this.tokenBalances[currencyAddress] = await this.web3Plug.getTokenBalance(currencyAddress,activeAddress)
          this.tokensApproved[currencyAddress] = await this.web3Plug.getTokenAllowance(currencyAddress,btfContractAddress,activeAddress)

          console.log('approve', this.tokensApproved)
          this.$forceUpdate()
         }, 
          async approveCurrencyToken(){
              let contractData = this.web3Plug.getContractDataForActiveNetwork()

              let activeAddress = this.web3Plug.getActiveAccountAddress()
              let currencyAddress = this.formInputs.tokenContractAddress

              let btfContractAddress = contractData['buythefloor'].address
              let currencyTokenContract = this.web3Plug.getTokenContract(currencyAddress)
              console.log(btfContractAddress)
              await currencyTokenContract.methods.approve(btfContractAddress, new BigNumber(this.ApproveAllAmount)).send({from:activeAddress})

          },

           selectedCurrencyIsApproved() {
 
            return (this.tokensApproved[this.formInputs.tokenContractAddress] >= this.ApproveAllAmount)
          },

         async signForBid(){
           console.log('sign for bid')

           let args = [
              this.web3Plug.getActiveAccountAddress(),
              this.formInputs.nftContractAddress,
              this.formInputs.tokenContractAddress,              
              this.getTokenBidAmountFormatted(),
              this.formInputs.expiresAtBlock
           ]

            let signature = await BidPacketUtils.performOffchainSignForBidPacket(args, this.web3Plug)
            

            let packetData = BidPacketUtils.getBidPacket(
              this.web3Plug.getActiveAccountAddress(),
              this.formInputs.nftContractAddress,
              this.formInputs.tokenContractAddress,              
              this.getTokenBidAmountFormatted(),
              this.formInputs.expiresAtBlock,
              signature
                )


              
                var hostname = window.location.hostname; 

                //'ws://localhost:8443'
                let serverURL = 'ws://'+hostname+':8443'
                console.log('serverURL',serverURL)

            let reply = await BidPacketHelper.sendBidPacket(serverURL, packetData);

              console.log('reply')

              this.submittedBidPacketResponse = reply

         },
        onNFTSelectCallback(optionData){
          console.log('callback2',optionData)
           

          let contractData = this.web3Plug.getContractDataForActiveNetwork()
          let nftContract = contractData[optionData.name]

 
          this.formInputs.nftContractAddress = nftContract.address

          //this.updateBalances();
        },
        onCurrencySelectCallback(optionData){
           
          let contractData = this.web3Plug.getContractDataForActiveNetwork()

           console.log('contractData',contractData)

          let tokenContract = contractData[optionData.name]
 
          this.formInputs.tokenContractAddress = tokenContract.address
          this.formInputs.tokenDecimals = tokenContract.decimals
          this.updateBalances();

           
        },
        getTokenBidAmountFormatted(){
          return this.web3Plug.rawAmountToFormatted( this.formInputs.tokenBidAmountRaw, this.formInputs.tokenDecimals ) 
        },
        getSelectedCurrencyBalance(){
          return this.tokenBalances[this.formInputs.tokenContractAddress]
        },
         getSelectedCurrencyBalanceFormatted(){
          return this.web3Plug.rawAmountToFormatted( this.getSelectedCurrencyBalance(), this.formInputs.tokenDecimals ) 
        }
  }
}
</script>
