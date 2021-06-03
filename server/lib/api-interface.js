
 
 import express from 'express'
 
 import cors from 'cors'
import fs from 'fs'
import path from 'path'

import  history from 'connect-history-api-fallback'
import  bodyParser from 'body-parser' 
 
import { Server } from "socket.io";

import web3utils from 'web3-utils'

import http from 'http'
import https from 'https'

import APIHelper from './api-helper.js'

import AccessHelper from './access-helper.js'
import ApplicationManager from './application-manager.js'

export default class APIInterface  {

    constructor(web3, mongoInterface,wolfpackInterface,serverConfig){
        this.mongoInterface = mongoInterface;
        this.wolfpackInterface=wolfpackInterface;
        this.web3 = web3;
        this.serverConfig=serverConfig;


        

        const app = express()
 

        let envmode = process.env.NODE_ENV

        var apiPort = 3000

        if(serverConfig.useHTTPS == true ){
          var server = https.createServer({
            cert: fs.readFileSync('/home/andy/deploy/cert/etherpunks.com.pem'),
            key: fs.readFileSync('/home/andy/deploy/cert/etherpunks.com.key')
          });
          console.log('--using https--')
         
        }else{
          
          var server = http.createServer(app);
        }
       
        

 
         app.use(cors());


          

        

       

        this.startWebServer(app, apiPort)
    }


    async startWebServer(app, apiPort){

     /* app.get('/api/v1/:query', async (req, res) => {
         
          
        let response = await APIHelper.handleApiRequest( req , this.mongoInterface )

        res.send(response)
      })*/

       app.use(express.json());


      app.post('/api/v1', async (req, res) => {
         
          
        console.log('got api request', req.params , req.body    )

        //this needs to log activity so limits can be checked by validateAppId
        let response = await APIHelper.handleApiRequest( req , this.serverConfig,  this.wolfpackInterface , this.mongoInterface )

        console.log('sending reply:', response   )

        res.send(response)
      }) 


 


      //these commands will be used for creating threads and posts 


      /*app.post('/application/create', async (req, res) => {

        let inputData = req.body 
        
        console.log('create new application,', inputData )
       
   
        if(inputData  ){

          //let userPublicAddress = accessTokenData.publicAddress

          //let newApplicationResult = await ApplicationManager.generateNewApplicationForUser( userPublicAddress, this.mongoInterface )

         // res.send({success:true, result: newApplicationResult} )
 
          return 
        }

        res.send({success:false } ) 

      })

      app.post('/list_my_applications', async (req, res) => {
 
        let inputData = req.body   
        let accessToken =  inputData.accessToken   

        let accessTokenData = await  AccessHelper.findAccessToken( accessToken , this.mongoInterface)
 
        if(accessTokenData &&  accessTokenData.isValid){
          
          let userPublicAddress = accessTokenData.publicAddress

          let list = await ApplicationManager.findAllApplicationsForUser( userPublicAddress, this.mongoInterface )
         
           
          res.send({success:true, list: list} )
          return
        }

        res.send({success:false } ) 

      })*/





      /*
      app.get('/api/v1/:apikey/:query', async (req, res) => {
         
          
        let response = await APIHelper.handleApiRequest( req , this.mongoInterface )

        res.send(response)
      })*/



      const staticFileMiddleware = express.static('dist');
      app.use(staticFileMiddleware);
      app.use(history({
        disableDotRule: true,
        verbose: true
      }));
      app.use(staticFileMiddleware);




      app.listen(apiPort, () => {
        console.log(`API Server listening at http://localhost:${apiPort}`)
      })


 

    }


    
    

}