<template>

<div>

   <div class="section  bg-gray-200  border-b-4 border-black px-0 lg:px-1">

     <div class=" ">
        <Navbar 
        v-bind:web3Plug="web3Plug"
        v-bind:accessPlug="accessPlug"
       />
     </div>


   </div>

  

   <div class="section  border-b-2 border-black" style="background:#222;">
     <div class=" ">
       <div class=" ">

       </div>
       <div class="  flex lg:flex-row flex-col  ">
 
         <div class="  md:w-1/2  w-full mt-8 py-8  px-8  text-center">

            <div class="text-white text-xl">  Ethereum API Made Simple.  </div> 

            <div class="m-4 p-4 border-2 border-white   " style="max-width:200px; min-height:200px; margin:24px auto;"> </div>

            <a :href="getRouteTo('docs')" class="text-white text-lg"> Read the docs  </a> 


         </div>
         <div class="   md:w-1/2  w-full  text-center ">
           
             
           <FrontPageMedia />


         </div>
       </div>
     </div>
   </div>


    <div class="section  bg-white border-b-2 border-black ">
     <div class="w-container  ">

         

        

        
         


     </div>
   </div>



    
  <Footer/>

</div>
</template>


<script>



import Web3Plug from '../js/web3-plug.js' 
import AccessPlug from '../js/access-plug.js' 

 
import FrontPageMedia from './components/FrontPageMedia.vue';
 
import Navbar from './components/Navbar.vue';
 
import Footer from './components/Footer.vue';
import TabsBar from './components/TabsBar.vue';
  
import StarflaskAPIHelper from '../js/starflask-api-helper.js';
import FrontendHelper from '../js/frontend-helper.js';


export default {
  name: 'Home',
  props: [],
  components: {Navbar, Footer, TabsBar, FrontPageMedia },
  data() {
    return {
      web3Plug: new Web3Plug() ,
      accessPlug: new AccessPlug() ,
      activePanelId: null,
       

      
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
   
       

  },
  mounted: function () {
         this.accessPlug.reconnect()
   
    
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

          getRouteTo(dest){
            return FrontendHelper.getRouteTo(dest)
          }

       
 

  }
}
</script>
