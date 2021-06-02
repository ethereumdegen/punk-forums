


import MongoInterface from '../lib/mongo-interface.js'
 
import FileHelper from '../lib/file-helper.js'
 

import Web3 from 'web3'

let envmode = process.env.NODE_ENV
 

  async function start(){
    
    console.log(`Running task in ${envmode} mode.`)
    

    let mongoInterface = new MongoInterface( ) 
    
    await mongoInterface.init( 'punkforums_api_'.concat(envmode)  )
  
    
    //let apiInterface = new APIInterface(web3, mongoInterface, wolfpackInterface, serverConfig)
 
    let punksAttributes = FileHelper.readJSONFile('src/config/punkAttributes.json')
    
    let outputArray = {}

    for(let punk of punksAttributes){
      outputArray[punk.id] = punk
    }

     

    FileHelper.writeJSONFile(JSON.stringify(outputArray), 'src/config/punkExport.json')

    console.log('completed.')
    process.exit(0)
}

 
 start()