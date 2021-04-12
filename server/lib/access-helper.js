 
    import Web3Helper from './web3-helper.js'
    import BidPacketUtils from '../../src/js/bidpacket-utils.js'
    
    import FileHelper from './file-helper.js'

    import web3utils from 'web3-utils'
    
 
    export default class AccessHelper  {
    
        constructor(   ){
           
           
        }

        //http://localhost:3000/api/v1/somestuff
        static async generateAccessChallenge(publicAddress, mongoInterface){

            let unixTime = Date.now()

            let accessChallenge = `Signing in to Starflask API as ${publicAddress.toString()} at ${unixTime.toString()}` 

            await mongoInterface.upsertOne('access_challenge', {publicAddress: publicAddress}, { publicAddress: publicAddress, accessChallenge:accessChallenge })

            return accessChallenge
          
        }

        
         
    }