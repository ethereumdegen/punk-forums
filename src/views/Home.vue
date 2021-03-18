<template>

<div>

   <div class="section bg-world px-0 lg:px-1">

     <div class=" ">
       <Navbar />
     </div>


   </div>

  

   <div class="section ctas">
     <div class="autospacing w-container">
       <div class="w-row">

       </div>
       <div class="w-row">
         <div class="column w-col w-col-6  ">



            <h2 class="text-yellow-500"> 0xBTC-ETH Pair </h2>

            <a href="/newbid" target="_blank" class='text-gray-200'>
                 -> Place a Bid for an NFT
                </a>
                <br>

           <a href="/profile" target="_blank" class='text-gray-200'>
                -> View and Sell your NFTs

               </a>



         </div>
         <div class="column-2 w-col w-col-6"><img src="@/assets/images/coins.svg" width="125" height="125" alt="">

         </div>
       </div>
     </div>
   </div>


    <div class="section dark autospacing ">
     <div class="w-container pt-8">

         

        <div class="text-gray-100 p-8">
         Lists of all Bids / Recent Sales 
        </div>

     </div>
   </div>



   <div class="section dark autospacing  ">

   </div>

  <Footer/>

</div>
</template>


<script>
import Navbar from './components/Navbar.vue';
 
import Footer from './components/Footer.vue';

export default {
  name: 'Home',
  props: [],
  components: {Navbar, Footer},
  data() {
    return {

    }
  },
  methods: {

  }
}
</script>
