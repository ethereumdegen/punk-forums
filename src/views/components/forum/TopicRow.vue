<template> 
        <tr>  
                    <td > <router-link  :to="'/topic/'.concat(rowData.topicHash)" > {{ rowData.title }} </router-link> </td>
                    <td> Punk #{{ rowData.punkId }} </td>
                    <td v-if="rowData.metrics"> {{ rowData.metrics.replies }} </td>
                    <td v-if="rowData.metrics"> {{ rowData.metrics.views }} </td>
                     
     </tr>
 </template>



<script>
    export default {
    name: 'TopicRow',
    props: [ 'rowData' ],
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
