


import MongoInterface from './lib/mongo-interface.js'

import APIInterface from './lib/api-interface.js'

import FileHelper from './lib/file-helper.js'
 

import Web3 from 'web3'

let envmode = process.env.NODE_ENV

let serverConfigFile = FileHelper.readJSONFile('./server/serverconfig.json')
let serverConfig = serverConfigFile[envmode]

  async function start(){

    console.log('server config: ',serverConfig)


    let mongoInterface = new MongoInterface( 'punkforums_api_'.concat(envmode) ) 

    let wolfpackInterface = new MongoInterface( 'wolfpack_punkforums_'.concat(envmode) ) 


    let web3 = new Web3( serverConfig.web3provider  )

    console.log('web3 ready with provider ',serverConfig.web3provider )

    
    let apiInterface = new APIInterface(web3, mongoInterface, wolfpackInterface, serverConfig)
 
       

}

 
 start()