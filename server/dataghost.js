
 
import PacketReceiver from './lib/packet-receiver.js'

import FileHelper from './lib/file-helper.js'

import TinyFox from 'tinyfox'
 

import Web3 from 'web3'

let envmode = process.env.NODE_ENV


let serverConfigFile = FileHelper.readJSONFile('./server/serverconfig.json')
let serverConfig = serverConfigFile[envmode]

let dataghostConfigFile = FileHelper.readJSONFile('./server/dataghostconfig.json')
let dataghostConfig = dataghostConfigFile[envmode]

  async function start(){

    console.log('dataghost config: ',dataghostConfig)


    
    let web3 = new Web3( serverConfig.web3provider  )
 
    console.log('web3 ready with provider ',serverConfig.web3provider )

    for(let tfc of dataghostConfig.tinyfoxconfigs){

        let tinyfoxConfig = {
            // contractType: 'ERC20',
            // contractAddress: '0xab89a7742cb10e7bce98540fd05c7d731839cf9f' ,
          //   startBlock: 1316824,
              indexRate: 80 * 1000,

             contractType: 'ERC20', 
             courseBlockGap: 500,
             logging:true,
             
             suffix: tfc.suffix,
             
             
             contractAddress: tfc.contractAddress,
             startBlock: tfc.startBlock,
             eventNames: tfc.eventNames
             
         } 


        initTinyFox(web3, tinyfoxConfig)
    }
    

     

} 


async function initTinyFox(web3, tinyfoxConfig){

        let tinyFox = new TinyFox()
        await tinyFox.init({suffix: tinyfoxConfig.suffix})

  
         // await tinyFox.dropDatabase()

        tinyFox.startIndexing( web3, tinyfoxConfig )  
         
 }
  



 
 start()