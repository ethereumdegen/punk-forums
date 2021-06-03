

  
 import Web3 from 'web3'
import axios from "axios";

import StarflaskAPIHelper from './starflask-api-helper.js'

const env = process.env.NODE_ENV

const punkAttributes = require('../config/punkAttributes.json')

const clientConfig = require('../config/clientConfig.json')[env]
 

export default class FrontendHelper {

    constructor( ){
      

    }

    

    

    static localAuthTokenExistsForAddress( address  ){

      address = Web3.utils.toChecksumAddress(address)

      let authToken = FrontendHelper.getAuthToken()

      if(authToken && authToken.fromAddress == address && !FrontendHelper.authTokenIsExpired(authToken)){
        return true
      }

      console.log('no local auth token', address, authToken )

      return false 
    }

    static async produceNewAuthToken( signerAddress , web3Plug ){

      if(!signerAddress) return false 

      if(!web3Plug.connectedToWeb3()) return false

      console.log('produce new auth token ', signerAddress)

        
      signerAddress = Web3.utils.toChecksumAddress(signerAddress)
  
      let currentUnixTime = Date.now().toString()

      //personal sign and send to server 
      let accountSignature = await web3Plug.requestPersonalSignature( 
        'Signing for Etherpunks at '.concat(currentUnixTime)  )

      let input = {
        fromAddress: signerAddress,
        signedAt: currentUnixTime,
        accountSignature: accountSignature
      }

      let response = await StarflaskAPIHelper.resolveStarflaskQuery(FrontendHelper.getRouteTo('api'), {requestType: 'create_authtoken' , input: input } )
      
      input.tokenHash = response.output.tokenHash

      let success = FrontendHelper.storeAuthToken( input  )
 
      return success 
    }

    static storeAuthToken( tokenData ){
      localStorage.setItem('authToken', JSON.stringify( tokenData ) );
      return true 
    }

    static getAuthToken(){
      let jsonData = localStorage.getItem('authToken')

      if(!jsonData) return jsonData 

      return JSON.parse(jsonData)
    }
     
    static authTokenIsExpired( token ){
      const ONE_DAY = 1000*60*60*24 
      return token.signedAt < Date.now() - ONE_DAY
    }

    static authTokenIsValid( token ){
      if(!token) return false 
      if(FrontendHelper.authTokenIsExpired(token)) return false 
      if(!token.tokenHash) return false 

      return true 
    }



    static timeSince(date) {

      var seconds = Math.floor((new Date() - date) / 1000);
    
      var interval = seconds / 31536000;
    
      if (interval > 1) {
        return Math.floor(interval) + " years";
      }
      interval = seconds / 2592000;
      if (interval > 1) {
        return Math.floor(interval) + " months";
      }
      interval = seconds / 86400;
      if (interval > 1) {
        return Math.floor(interval) + " days";
      }
      interval = seconds / 3600;
      if (interval > 1) {
        return Math.floor(interval) + " hours";
      }
      interval = seconds / 60;
      if (interval > 1) {
        return Math.floor(interval) + " minutes";
      }
      return Math.floor(seconds) + " seconds";
    }



    static async handleAPIRequest(endpoint, inputData ){
        let api_root = FrontendHelper.getRouteTo('api')
  
  
        let uri = api_root.concat(endpoint/*'/generate_access_token'*/)
        //let inputData = {publicAddress:publicAddress,signature:signature} 
  
  
        return new Promise(   (resolve, reject) => {
  
          axios({
            method: "post",
            url: uri,
            data: inputData,
            headers: { "Content-Type": "multipart/form-data" },
          })
          .then((res) => {
             
               console.log('res', res.data)
               let results = res.data
              
         
                resolve(results)
    
           }) .catch((error) => {
               console.error(error)
               reject(error)
           })
    
       }); 
  
       
      }

 
    static getRouteTo(dest){

        console.log('ENV IS ', env )

        return clientConfig.external_routes[dest]
      

    }


    static async submitNewTopicForm(formInputs){

         
        let endpoint =   '/topic/create' 

        let inputData = formInputs 

        return FrontendHelper.handleAPIRequest(endpoint,inputData)

    }

    static getActivePunkId(){
      let punkId = localStorage.getItem('activePunkId');
      if(punkId == 'null') punkId= null;

      return punkId
         
    }

    static async etherPunksPersonalSign(web3Plug){


      let currentUnixTime = Date.now().toString() 

      let challenge = 'Signing for Etherpunks at '.concat(currentUnixTime) 
      let address = web3Plug.getActiveAccountAddress()
      let web3Instance = web3Plug.getWeb3Instance()
      let accountSignature = await FrontendHelper.personalSignWithMetamask(  challenge, address , web3Instance )
    
      return {signedAt: currentUnixTime, signerAddress: address, accountSignature: accountSignature}
    }



    static async personalSignWithMetamask( challenge, address , web3Instance)
    {
      console.log('personal signing ', challenge, address, web3Instance)
  
 

      var challengeHash =    Web3.utils.fromUtf8 (challenge)



  
      var sig =   await new Promise(async (resolve,reject) => {
        
  
        web3Instance.eth.personal.sign( challengeHash , address, function (err,result){
                if (err) {return console.error(err)}
                console.log('PERSONAL SIGNED:' + result)
                resolve(result);
        })
  
      })
  
      return sig;
  
    }
  

    static getPunkRace(punkId){
      if(!punkId) return null

      for(let punk of punkAttributes){
        if(punkId == punk.id){

          return punk.Type.toLowerCase()
        }
      }

    }


}

 