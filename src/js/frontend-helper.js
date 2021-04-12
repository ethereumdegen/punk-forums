

  
 
import axios from "axios";



export default class FrontendHelper {

    constructor( ){
      

    }

    static async requestAccessChallenge(publicAddress){

      let uri = '/generate_access_challenge/' 
      let inputData = {publicAddress: publicAddress} 


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

    static async requestAccessToken(publicAddress , signature){

      let uri = `/generate_access_token/` //${publicAddress}/${signature}`.concat(publicAddress)
      let inputData = {publicAddress:publicAddress,signature:signature} 


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