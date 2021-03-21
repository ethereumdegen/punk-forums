

 
 const clientConfig = require('../config/clientConfig.json')

export default class BuyTheFloorHelper {

    constructor(web3Plug){
        this.web3Plug = web3Plug
        this.contractNameLookupTable = {} 
        this.currencyDecimalsLookupTable = {} 

        let contractData =  web3Plug.getContractDataForActiveNetwork()

        for (const [key, value] of Object.entries(contractData)) {
            this.contractNameLookupTable[value.address] = value.name 
            this.currencyDecimalsLookupTable[value.address] = value.decimals 
        }

    }

    static getSocketURL(netId){
      let envmode = process.env.NODE_ENV

      if(netId != 1 && envmode == 'production'){
        envmode = staging
      }

      return clientConfig[envmode].SOCKET_URL


    }
    static getClientConfigForNetworkId(netId){
      if(netId == 1){
        return clientConfig['production'] 
      }
      return clientConfig['development'] 


    }
     

    getNameFromContractAddress( address )
  {
 
    return this.contractNameLookupTable[address]
 

  }


  getFormattedCurrencyAmount( tokenAmount, tokenAddress )
  {
        
    let decimals = this.currencyDecimalsLookupTable[tokenAddress]

    return parseFloat(this.web3Plug.rawAmountToFormatted(tokenAmount,decimals))


  }





}