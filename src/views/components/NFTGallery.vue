<template>
  <div class=" ">
     <table class="table-auto w-full">
          <thead>
            <tr>
              <th style="text-align:left" v-for="(label, index) in labelsArray">{{label}}</th>
               
            </tr>
          </thead>
          <tbody>
            <tr v-for="row of rowsArray" class="hover:bg-teal-200 cursor-pointer" @click="clickedRow(row)">
               
              <td v-for="(label, index) in labelsArray" >{{Object.values(row)[index]}}</td>
              
            </tr>
             
          </tbody>
        </table>
  </div>
</template>


<script>

//use THE GRAPH 

export default {
  name: 'GenericTable',
  props: ['labelsArray','rowsArray','clickedRowCallback'],
  data() {
    return {

    }
  },
  created(){

  },
  methods: {
      clickedRow(row){
        this.clickedRowCallback(row)
      }
  }
}
</script>
