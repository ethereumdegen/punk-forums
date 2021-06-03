<template>

<div>

   <div class="section  bg-gray-200  border-b-4 border-black px-0 lg:px-1">

     <div class=" ">
        <Navbar 
        v-bind:web3Plug="web3Plug"
        
       />

      
     </div>


   </div>


      <Punksbar 
       ref="punksbar"
        v-bind:web3Plug="web3Plug"
        
       />


   <div class="section  border-b-2 border-black" style="background:#eee;">
     <div class=" w-container py-8">

        <div class="my-4 flex flex-row"> 
         <div class="flex-grow"> 
           
           <div class="hidden border-2 border-black p-2 inline-block "> Categories  </div>
           
            <GenericDropdown 
              v-bind:optionList="allCategories"
              v-bind:onSelectCallback="routeToCategory"
            
            />

         </div>

           <div> 
             <router-link :to="'/topic/new'" class="no-underline"> 
               <div class="bg-purple-500 p-2 hover:bg-purple-400 cursor-pointer select-none text-white  " >New Topic</div> 
            </router-link>
           </div>

       </div>


       <div class="mt-16" style="min-height:300px" > 

         <div class="my-4 text-xl "> {{categoryName}} <div v-if="categoryData.emoji" class="inline-block">{{ categoryData.emoji }}</div> </div>
         
         
         <div v-if="categoryData.description" class="my-2 text-gray-700 ">{{ categoryData.description }}</div>
        
        <div class="mt-4" v-if="punkHasAccess">
         <TopicsList
          v-bind:topicsArray="activeTopicsArray"
          v-bind:paginated='true'
         /> 
         </div>

          <div class="mt-4" v-if="!punkHasAccess">
             <img src="@/assets/images/accesserror.png" />
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
import Punksbar from './components/PunksBar.vue';
 
import Footer from './components/Footer.vue';
import TabsBar from './components/TabsBar.vue';
 import GenericDropdown from './components/GenericDropdown.vue';
 
  
  
import TopicsList from './components/forum/TopicsList.vue';
  
import StarflaskAPIHelper from '../js/starflask-api-helper.js';
import FrontendHelper from '../js/frontend-helper.js';


const categoriesData = require('../config/topicCategories.json')

export default {
  name: 'Home',
  props: [],
  components: {Navbar, Punksbar, Footer,GenericDropdown, TopicsList  },
  data() {
    return {
      web3Plug: new Web3Plug()  ,
  
      activeTopicsArray: [],

      punkHasAccess: true,
 

      allCategories: [],
      categoryData: {}
    }
  },
computed: {
  categoryName: function () {
    return  this.$route.params.name 
  }
},
 watch: {
   
    categoryName: function (newName, oldName) {
      this.fetchTopics(  )
       
      this.categoryData = categoriesData.filter(x => x.name.toLowerCase() == newName.toLowerCase())[0]
      this.refreshPunkHasAccess()
       
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

  mounted: async function () {
 
      this.allCategories = categoriesData.map(x => {return {name: x.name,label: x.name}})
      
      let paramName =  this.$route.params.name
      this.fetchTopics( paramName  )
       this.categoryData = categoriesData.filter(x => x.name.toLowerCase() == paramName.toLowerCase())[0]


      this.$refs.punksbar.getPunksEventEmitter().on('activePunkChanged', async function(activePunkId) {
          console.log('activePunkChanged',activePunkId);
            
          this.refreshPunkHasAccess()
           this.fetchTopics( paramName  )
        }.bind(this));

      this.refreshPunkHasAccess()
  }, 
   

  beforeDestroy: function () {
    
     
  },
  methods: {

    onPerformAction(name){
      console.log('on perform', name) 


    },
           
    getRouteTo(dest){
      return FrontendHelper.getRouteTo(dest)
    },

    async fetchTopics(   ){
 
 

       let topicsRequestInput = { category: this.categoryName  } 

      let authToken = FrontendHelper.getAuthToken()

      
      if(FrontendHelper.authTokenIsValid( authToken  )){
        topicsRequestInput.authToken = authToken.tokenHash 
      }


      let response =  await StarflaskAPIHelper.resolveStarflaskQuery(FrontendHelper.getRouteTo('api'), {requestType: 'topics' , input: topicsRequestInput})
      console.log('fetch topics', response)
      this.activeTopicsArray = response.output 
    },


    refreshPunkHasAccess(){

      let activePunkId = this.$refs.punksbar.getActivePunkId()

      

      this.punkHasAccess = true 

      let activePunkType = FrontendHelper.getPunkRace( activePunkId )

    console.log('activePunkId', activePunkId )
    console.log('activePunkType', activePunkType )

      let accessType = this.categoryData.onlyAllow

      if(accessType && !activePunkId ){
        this.punkHasAccess = false 
      }

      if(accessType && ( accessType != 'any' && accessType.toLowerCase() != activePunkType   )){
        this.punkHasAccess = false 
      }
 

      console.log('accessLevel', this.categoryData.onlyAllow)

    },


    routeToCategory(category){
      console.log('route to ', category.name )

       this.$router.push({ name: 'category', params: { name:  (category.name) } })

       

    }




       
 

  }
}
</script>
