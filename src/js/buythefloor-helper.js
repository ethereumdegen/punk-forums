

 
 const clientConfig = require('../config/clientConfig.json')

 const contractDataLookup = require('../config/generated/contractlookup.json')
 import BigNumber from 'bignumber.js'

export default class BuyTheFloorHelper {

    constructor( ){
      

    }

    static getSocketURL(netId){
      let envmode = process.env.NODE_ENV

      if(netId != 1 && envmode == 'production'){
        envmode = 'staging'
      }

      return clientConfig[envmode].SOCKET_URL


    }
    static getClientConfigForNetworkId(netId){
      if(netId == 1){
        return clientConfig['production'] 
      }
      return clientConfig['development'] 


    }
     

    static getNameFromContractAddress( address, netId )
  {
    let networkName = 'mainnet'
    if(netId == 5){
      networkName = 'goerli'
    }

    console.log('get name', contractDataLookup[networkName] , address)


    return contractDataLookup[networkName][address.toLowerCase()].name  //this.contractNameLookupTable[address]
 

  }

  static getDecimalsFromContractAddress( address, netId )
  {
    let networkName = 'mainnet'
    if(netId == 5){
      networkName = 'goerli'
    }

    console.log('get decimals', contractDataLookup[networkName] , address)

    return contractDataLookup[networkName][address.toLowerCase()].decimals  //this.contractNameLookupTable[address]
 

  }


  static getFormattedCurrencyAmount( tokenAmount, tokenAddress, netId )
  {
    
        
    let decimals = this.getDecimalsFromContractAddress(tokenAddress, netId)

    return parseFloat(BuyTheFloorHelper.rawAmountToFormatted(tokenAmount,decimals))


  }


  static rawAmountToFormatted(amount,decimals)
  {
    return (amount * Math.pow(10,-1 * decimals)).toFixed(decimals);
  }

  static formattedAmountToRaw(amountFormatted,decimals)
  { 
       
    var multiplier = new BigNumber( 10 ).exponentiatedBy( decimals ) ;


    return multiplier.multipliedBy(amountFormatted).toFixed() ;
  }


}