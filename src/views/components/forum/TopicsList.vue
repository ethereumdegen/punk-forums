<template> 
<table class="table-auto w-full" style="min-height:300px">
        <thead>
            <tr style="text-align: left;" class="text-sm text-gray-600 border-b-2 border-gray-400">
                <th>Topic</th>
                <th> </th>
                <th>Replies</th>
                <th>Views</th>
                 
            </tr>
        </thead>  

        <tbody>

            <TopicRow 
                v-for='row in topicsArray'
                v-bind:rowData='row'
            />
           
        </tbody>
        

 </table>
 </template>



<script>

    import TopicRow from './TopicRow.vue'

    export default {
    name: 'TopicsList',
    props: [ 'topicsArray' ],
    components: {TopicRow},
    data() {
         
    },
    created(){
        
    },
    methods: {
          
    }
    }
</script>
