<template> 
        <tr v-if="rowData" class="hover:bg-gray-400 cursor-pointer">  
                    <td > <router-link  :to="'/topic/'.concat(rowData.topicHash)" class="no-underline" > {{ rowData.title }} </router-link> </td>
                    <td > <PunkIcon 
                          v-bind:iconId='rowData.punkId'
                          v-bind:renderSize=24
                    /> <div class="inline-block text-xs  "> Punk {{rowData.punkId}} </div> </td>
                    <td v-if="rowData.metrics"> {{ rowData.metrics.replies }} </td>
                    <td v-if="rowData.metrics"> {{ rowData.metrics.views }} </td>
                     
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
       
    }
    }
    
</script>
