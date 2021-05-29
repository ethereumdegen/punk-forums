<template> 
<table class="table-auto w-full" style="min-height:300px">
        <thead>
            <tr style="text-align: left;">
                <th>Topic</th>
                <th> </th>
                <th>Replies</th>
                <th>Views</th>
                <th>Activity</th>
            </tr>
        </thead>  

        <tbody>
            <tr>
                    <td > Intro to CSSIntro to CSSIntro to CSSIntro to CSSs</td>
                    <td>Adam</td>
                    <td>858</td>
                    <td>858</td>
                    <td>858</td>
            </tr>
        </tbody>
        

 </table>
 </template>



<script>
    export default {
    name: 'TopicsList',
    props: [ ],
    data() {
        return {
            startTime: 0
        }
    },
    created(){
        this.startTime= Date.now()

        setInterval(this.update,500)
    },
    methods: {
         update(){
             this.$forceUpdate()
         },
         getTimeElapsed(){
             return Date.now() - this.startTime
         }
    }
    }
</script>
