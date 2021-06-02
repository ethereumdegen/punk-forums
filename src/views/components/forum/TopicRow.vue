<template> 
        <tr v-if="rowData" class="hover:bg-gray-400 cursor-pointer">  
                    <td > <router-link  :to="'/topic/'.concat(rowData.topicHash)" class="no-underline" > {{ rowData.title }} </router-link> </td>
                    <td >  <router-link :to="'/punk/'.concat(rowData.punkId)">  <PunkIcon 
                          v-bind:iconId='rowData.punkId'
                          v-bind:renderSize=24
                    /> </router-link> <div class="inline-block text-xs  "> Punk {{rowData.punkId}} </div> </td>
                   <td  > {{ rowData.category }} </td>
                   <td v-if="rowData.metrics"> {{ customParseInt(rowData.metrics.replies) - 1 }} </td>
                    <td v-if="rowData.metrics"> {{ customParseInt(rowData.metrics.views) }} </td>
                     
     </tr>
</template>



<script>


import PunkIcon from '../PunkIcon.vue'


export default {
    name: 'TopicRow',
    props: [ 'rowData' ],
    components: {PunkIcon},
    data() {
        return {
             
        }
    },
    created(){
       
    },
    methods: {
       customParseInt(x){
           let result = parseInt(x)
           if(isNaN(x)) return 0

           return result 
       }
    }
    }
    
</script>
