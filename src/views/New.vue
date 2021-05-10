<template>

<div>

   <div class="section bg-gray-200  border-b-2 border-black px-0 lg:px-1">

     <div class=" ">
        <Navbar 
        v-bind:web3Plug="web3Plug" 
       />
     </div>


   </div>

  

   <div class="section  bg-white border-b-2 border-black  ">
     <div class="autospacing w-container">
        
     <form id="newApplicationForm"> 
       <div class="w-column py-16">
          <div class="text-lg font-bold mb-8"> Create a New Application  </div>
 



              <div  class=" " v-if="!connectedToWeb3">
                      <NotConnectedToWeb3 />
                  </div>
 


          <div  v-if=" connectedToWeb3"> 
            <div class="mb-4">

                <label   class="block text-md font-medium font-bold text-gray-800  ">Application Name</label>
                 
                <div class="flex flex-col w-1/2">

               
                  <input type="text" v-model="formInputs.name" class="border-gray-200 border-2 p-2 m-2 " placeholder="My First Application" />

               
                  
                </div>


              </div>



            <div class="mb-4">

                <label   class="block text-md font-medium font-bold text-gray-800  ">Application Description</label>
                 
                <div class="flex flex-col w-1/2">

               
                  <textarea type="text" v-model="formInputs.description" class="border-gray-200 border-2 p-2 m-2 " placeholder=" " />

               
                  
                </div>


              </div>




             <div class="mb-4">
                <label   class="block text-md font-medium font-bold text-gray-800  ">Subscription Price (per month)</label>
                 
                <div class="flex flex-row">

                <input type="number" v-model="formInputs.priceAmount" class="border-black border-2 p-2 m-2 " />

                <GenericDropdown
                  v-bind:optionList="currencyTokensOptionsList" 
                  v-bind:onSelectCallback="onCurrencySelectCallback"
                />
                  
                </div>


            </div>
             <div class="mb-4">

                <label   class="block text-md font-medium font-bold text-gray-800  ">Payouts Address</label>
                 
                <div class="flex flex-col w-1/2">

                  <div class="text-xs p-2"> The Public address of an Ethereum account you control.  Do not use an exchange address or your funds may be non-recoverable.  Please use a personal account (such as metamask).    </div>

                  <input type="text" v-bind:model="formInputs.payoutsAddress" class="border-black border-2 p-2 m-2 " placeholder="0x..." />

               
                  
                </div>


              </div>


               <div class="mb-4">

                <label   class="block text-md font-medium font-bold text-gray-800  ">Cover Image</label>


                   <div class="flex flex-row ">

                      <div class="flex flex-col w-1/2">

                        <div class="text-xs p-2">  Recommended dimensions 1500x500.    </div>

                        <input type="file"  class="border-black border-2 p-2 m-2 "  @change="onCoverImageChange" /> 
                        
                      </div>
                
                
                
                   <div class="flex flex-col p-2 ">
                
                      
                    <div id="preview">
                      <img v-if="formInputs.coverImageURL" :src="formInputs.coverImageURL" width="80px" />
                    </div>
                  </div> 


                  </div>


              </div>


          <div class="mb-4">

                <label   class="block text-md font-medium font-bold text-gray-800  ">Thumbnail Image</label>

              <div class="flex flex-row ">

                <div class="flex flex-col w-1/2">

                  <div class="text-xs p-2">  Recommended dimensions 500x500.    </div>

                  <input type="file"   class="border-black border-2 p-2 m-2 " @change="onThumbnailImageChange"  /> 
                  
                </div>

                <div class="flex flex-col p-2 ">

               
                     
                  <div id="preview">
                    <img v-if="formInputs.thumbnailImageURL" :src="formInputs.thumbnailImageURL" width="80px" />
                  </div>
                </div> 


                </div> 


              </div>



              <div> 


                <div class="  p-4">

                   
                 
                     <div @click="submitForm" class="select-none font-bold  p-2 inline-block bg-blue-400 rounded border-gray-600 hover:border-gray-300 text-white border-2 cursor-pointer  px-8"> Submit </div>
             

                 
             
                </div>


              </div> 


            

          </div>

          
         

          
       </div>

      </form>
     </div>
   </div>


    


    
  <Footer/>

</div>
</template>


<script>



import NotConnectedToWeb3 from './components/NotConnectedToWeb3.vue'

import Web3Plug from '../js/web3-plug.js' 
 

import Navbar from './components/Navbar.vue';
 
import Footer from './components/Footer.vue';
import TabsBar from './components/TabsBar.vue';
import GenericTable from './components/GenericTable.vue';
 import GenericDropdown from './components/GenericDropdown.vue';
 

import FrontendHelper from '../js/frontend-helper.js'

export default {
  name: 'Application',
  props: [],
  components: {Navbar, Footer, TabsBar, GenericDropdown, NotConnectedToWeb3},
  data() {
    return {
      web3Plug: new Web3Plug() , 
      
      currencyTokensOptionsList: [{name:'0xBTC',label:'0xBTC'}],

      formInputs: {name:null,description:null,priceAmount:1,thumbnailImageURL:null,coverImageURL:null},
       
       
      connectedToWeb3: false,
      currentBlockNumber: 0
    }
  },

  created(){

 
    this.web3Plug.getPlugEventEmitter().on('stateChanged', async function(connectionState) {
        console.log('stateChanged',connectionState);
         
        this.activeAccountAddress = connectionState.activeAccountAddress
        this.activeNetworkId = connectionState.activeNetworkId
        this.connectedToWeb3 = this.web3Plug.connectedToWeb3()
        this.currentBlockNumber = await this.web3Plug.getBlockNumber()

         
         
      }.bind(this));
   this.web3Plug.getPlugEventEmitter().on('error', function(errormessage) {
        console.error('error',errormessage);
         
        this.web3error = errormessage
       
      }.bind(this));

      this.web3Plug.reconnectWeb()
    
 

  },
  mounted: function () {
    
     // this.accessPlug.reconnect()


 
   
  }, 
  methods: {

    async onCurrencySelectCallback(currency){
      console.log('onCurrencySelectCallback',currency)
    },

     onCoverImageChange(e) {
      const file = e.target.files[0];
      this.formInputs.coverImageURL = URL.createObjectURL(file);
 
    },

     onThumbnailImageChange(e) {
      const file = e.target.files[0];
      this.formInputs.thumbnailImageURL = URL.createObjectURL(file);
    },

    async submitForm(){
      console.log('submit form', this.formInputs)

      let result = await FrontendHelper.submitNewApplicationForm(this.formInputs)

    }
          
  }
}
</script>
