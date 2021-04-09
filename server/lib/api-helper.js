 
    import Web3Helper from './web3-helper.js'
    import BidPacketUtils from '../../src/js/bidpacket-utils.js'
    
    import FileHelper from './file-helper.js'

    import web3utils from 'web3-utils'
    
 
    export default class APIHelper  {
    
        constructor(   ){
           
           
        }

        //http://localhost:3000/api/v1/somestuff
        static async handleApiRequest(request, mongoInterface){
           
            let inputData = request.body 

            if(inputData.requestType == 'all_ERC721'){
 
                let inputParameters = inputData.input

                let publicAddress = inputParameters.publicAddress 

                let results = await APIHelper.findAllERC721ByOwner(publicAddress, mongoInterface)

                return {success:true, input: inputParameters, output: results  }
            }


            if(inputData.requestType == 'burned_ERC20_by_from'){
 
                let inputParameters = inputData.input

                let from = inputParameters.from 

                let results = await APIHelper.findBurnedERC20ByFrom(from, mongoInterface)

                return {success:true, input: inputParameters, output: results  }
            }

            if(inputData.requestType == 'burned_ERC20_by_token'){
 
                let inputParameters = inputData.input

                let token = inputParameters.token 

                let results = await APIHelper.findBurnedERC20ByToken(token, mongoInterface)

                return {success:true, input: inputParameters, output: results  }
            }


            return {success:false}
        }

        static async findAllERC721ByOwner(publicAddress,mongoInterface){
            publicAddress = web3utils.toChecksumAddress(publicAddress)
            return await mongoInterface.findAll('erc721_balances',{accountAddress: publicAddress })
        }


        static async findBurnedERC20ByFrom(publicAddress,mongoInterface){
            publicAddress = web3utils.toChecksumAddress(publicAddress)
            return await mongoInterface.findAll('erc20_burned',{from: publicAddress })
        }

        static async findBurnedERC20ByToken(tokenAddress,mongoInterface){
            tokenAddress = web3utils.toChecksumAddress(tokenAddress)
            return await mongoInterface.findAll('erc20_burned',{token: tokenAddress })
        }
    
         
    }