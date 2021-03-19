


import MongoInterface from './lib/mongo-interface.js'

import PacketReceiver from './lib/packet-receiver.js'

import FileHelper from './lib/file-helper.js'

import PacketCustodian from './lib/packet-custodian.js'

import Web3 from 'web3'

let serverConfig = FileHelper.readJSONFile('./server/serverconfig.json')


  async function start(){
    let mongoInterface = new MongoInterface( 'bidthefloor' ) 


    let packetReceiver = new PacketReceiver(mongoInterface)
 
     
    let web3 = new Web3( serverConfig.web3provider  )
    
    console.log('web3 ready with provider ',serverConfig.web3provider )

    let packetCustodian = new PacketCustodian(web3,mongoInterface)



}

 
 start()