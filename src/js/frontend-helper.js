

  
 
import axios from "axios";



export default class FrontendHelper {

    constructor( ){
      

    }

    static async requestAccessChallenge(publicAddress){

      let uri = '/generate_access_challenge/'.concat(publicAddress)
      let inputData = {} 


      return new Promise(   (resolve, reject) => {

        axios.post(uri, inputData )
        .then((res) => {
           
             console.log(res.data)
             let results = res.data
            
       
              resolve(results)
  
         }) .catch((error) => {
             console.error(error)
             reject(error)
         })
  
     }); 

     
    }

    

}