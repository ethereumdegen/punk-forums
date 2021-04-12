 
    import Web3Helper from './web3-helper.js'
    import BidPacketUtils from '../../src/js/bidpacket-utils.js'
    
    import FileHelper from './file-helper.js'

    import web3utils from 'web3-utils'

   import ethJsUtil from 'ethereumjs-util' 
    
   const MAX_APP_COUNT = 25 
 
    export default class ApplicationManager  {
    
        constructor(   ){
           
           
        }
 
            
            static async generateNewApplicationForUser(publicAddress, mongoInterface)
            {

                let allApps = await ApplicationManager.findAllApplicationsForUser(publicAddress,mongoInterface)

                if(allApps.count >= 25){
                    return {success: false, message: 'User has exceeded application limit.'}
                }

                let appId = web3utils.randomHex(20)
                let newApp = await mongoInterface.insertOne('api_application', {publicAddress: publicAddress, applicationId: appId } )
 
                return {success:true, appId: appId};

            }

            static async findAllApplicationsForUser(publicAddress, mongoInterface){
                return await mongoInterface.findAll('api_application', {publicAddress: publicAddress } )
 
            }

            static async findApplicationById(appId, mongoInterface){
                return await mongoInterface.findAll('api_application', {publicAddress: publicAddress } )
 
            }


            static async validateAppId(appId, mongoInterface){
                let matchingApp = await ApplicationManager.findApplicationById(appId,mongoInterface)

                if(!matchingApp){
                    return {success:false, message:'Invalid app id'}
                }

                //do rate limit checking here ! 



                return {success:true}
            }
            
         
    }