
 
import PacketReceiver from './lib/packet-receiver.js'

import FileHelper from './lib/file-helper.js'

import WolfPack from 'wolfpack'
 

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

 
   /* let wolfPackConfig = {
        contracts:[{address:"0x39ec448b891c476e166b3c3242a90830db556661", startBlock: 4465713, type:'ERC721'},
                        {address:"0x7cea7e61f8be415bee361799f19644b9889713cd", startBlock: 4528636, type:'ERC721'}],
         
        suffix:"dev",
        indexRate: 10*1000,
        courseBlockGap: 8000,
        logging:true,
        reScale: false
    }*/

    let wolfPackConfig = dataghostConfig.wolfPackConfig


    let wolfPack = new WolfPack()
    await wolfPack.init( {suffix: wolfPackConfig.suffix} )
    wolfPack.startIndexing( web3, wolfPackConfig )  




    //need to grab deposit and mint events 


    /*
        let tfc = dataghostConfig.tinyfoxconfigs[index]

        let delay = index * 25 * 1000;

        let tinyfoxConfig = {
            // contractType: 'ERC20',
            // contractAddress: '0xab89a7742cb10e7bce98540fd05c7d731839cf9f' ,
          //   startBlock: 1316824,
              indexRate: 50 * 1000,

             contractType: 'ERC20', 
             courseBlockGap: 10000,
             logging:true,
             
             suffix: tfc.suffix,
             
             
             contractAddress: tfc.contractAddress,
             startBlock: tfc.startBlock 
             
         } 

        setTimeout(function(){ initTinyFox(web3, tinyfoxConfig) } , delay)
        */
     
    

     

} 
 



 
 start()