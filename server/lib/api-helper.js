 
    //const ethJsUtil = require('ethereumjs-util')
    import ethJsUtil from 'ethereumjs-util'


    import web3utils from 'web3-utils'
    import ApplicationManager from './application-manager.js'
    
    import ForumManager  from './forum-manager.js'

    import FileHelper from './file-helper.js'


    const contractData = FileHelper.readJSONFile('./src/config/contractdata.json')



    export default class APIHelper  {
    
        constructor(   ){
           
           
        }

        //http://localhost:3000/api/v1/somestuff
        static async handleApiRequest(request, serverConfig,  wolfpackInterface, mongoInterface){
           
            let inputData = request.body 



              
            if(inputData.requestType == 'forum_categories'){
                let categoriesData =  [
                    {name: 'generaldiscussion', label:'General Discussion' , color:'#222'}
                ]
                 
                
                return {success:true, input: {}, output: categoriesData  }
            } 

 
              
            if(inputData.requestType == 'create_thread'){
                
                let personalSignatureIsValid = APIHelper.validatePersonalSignature(inputData.input)
                
                if(!personalSignatureIsValid){
                    return {success:false, input: inputData.input }
                }


                let userOwnsPunk = await APIHelper.validatePunkOwnership(inputData.input.fromAddress, inputData.input.activePunkId, wolfpackInterface , serverConfig)

                if(!userOwnsPunk){
                    return {success:false, input: inputData.input, message: 'Not owner of punk' }
                }


                let threadId = 0; 

                let newTopic = await ForumManager.createNewTopic(  inputData.input , mongoInterface )

                
                return {success:true, input: inputData.input, output: {threadId: threadId}  }
            } 

            




            // ------------  Data retrieval ------------
         
            if(inputData.requestType == 'ERC721_balance_by_owner'){
 
                let inputParameters = inputData.input

                let ownerAddress = inputParameters.ownerAddress 

                let results = await APIHelper.findAllERC721ByOwner(ownerAddress, wolfpackInterface)

               
                return {success:true, input: inputParameters, output: results  }
            } 



            if(inputData.requestType == 'ERC721_balance_by_token'){
 
                let inputParameters = inputData.input

                let token = inputParameters.token 

                let results = await APIHelper.findAllERC721ByToken(token, wolfpackInterface)

                
                return {success:true, input: inputParameters, output: results  }
            }

            if(inputData.requestType == 'ERC721_balance_by_owner_and_token'){
 
                let inputParameters = inputData.input

                let token = inputParameters.token 
                let ownerAddress = inputParameters.ownerAddress 

                let results = await APIHelper.findAllERC721ByTokenAndOwner(token, ownerAddress, wolfpackInterface)

                
                return {success:true, input: inputParameters, output: results  }
            }


             

            if(inputData.requestType == 'ERC20_balance_by_owner'){
 
                let inputParameters = inputData.input

                let account = inputParameters.account 
                

                let results = await APIHelper.findERC20BalanceByAccount(account,  wolfpackInterface)

                await ApplicationManager.logNewRequest(appId,inputData.requestType,inputParameters,results, mongoInterface)

                return {success:true, input: inputParameters, output: results  }
            }

            if(inputData.requestType == 'ERC20_balance_by_token'){
 
                let inputParameters = inputData.input
 
                let results = await APIHelper.findERC20BalanceByToken(inputParameters.token  ,  wolfpackInterface)

                await ApplicationManager.logNewRequest(appId,inputData.requestType,inputParameters,results, mongoInterface)

                return {success:true, input: inputParameters, output: results  }
            }

            if(inputData.requestType == 'ERC20_transferred_from'){
 
                let inputParameters = inputData.input 

                let results = await APIHelper.findERC20TransferredByFrom(inputParameters.from , wolfpackInterface)

                await ApplicationManager.logNewRequest(appId,inputData.requestType,inputParameters,results, mongoInterface)

                return {success:true, input: inputParameters, output: results  }
            }

            if(inputData.requestType == 'ERC20_transferred_to'){
 
                let inputParameters = inputData.input 

                let results = await APIHelper.findERC20TransferredByTo(inputParameters.to , wolfpackInterface)

                await ApplicationManager.logNewRequest(appId,inputData.requestType,inputParameters,results, mongoInterface)

                return {success:true, input: inputParameters, output: results  }
            }

            if(inputData.requestType == 'ERC20_transferred_from_to'){
 
                let inputParameters = inputData.input 

                let results = await APIHelper.findERC20TransferredByFromTo(inputParameters.from, inputParameters.to, wolfpackInterface)

                await ApplicationManager.logNewRequest(appId,inputData.requestType,inputParameters,results, mongoInterface)

                return {success:true, input: inputParameters, output: results  }
            }



 
 


            return {success:false}
        }


        /*
        fromAddress: '0x99a848f6d8bb6d6cd1a524b3c99a97e41e1e4b5a',
        activePunkId: '3315', 
        signedAt: '1622323329977',
        accountSignature: '0xa7cc18dd4d0b4193016814072157165dd236f64eadb913ca43162b26e9e6221076031be48f5cbc5fb0180293c06712e760f04a990357768afec012d29d56d1f31b

        */
        static validatePersonalSignature(input){

                console.log('input',input)

           // let signatureIsValid = web3.recover( input )

            let challenge = 'Signing for Etherpunks at '.concat(input.signedAt)

            var recoveredAddress =  APIHelper.ethJsUtilecRecover(challenge, input.accountSignature)

             recoveredAddress = recoveredAddress.toLowerCase()
             console.log('recoveredAddress',recoveredAddress)

             if(recoveredAddress != input.fromAddress){
                 return false 
             }

            return true 
        }

        static async validatePunkOwnership(accountAddress, punkId, wolfpackInterface, serverConfig){

            let networkName = serverConfig.networkName 

            let punkContractAddress = contractData[networkName].contracts['cryptopunks'].address

            let allPunksData = await APIHelper.findAllERC721ByTokenAndOwner( punkContractAddress,accountAddress, wolfpackInterface)

            let allPunksList = allPunksData[0]


            let ownsPunk = false
            
            console.log('.check punk1', accountAddress, allPunksData)

            for(let id of allPunksList.tokenIds){
                console.log('.check punk', punkId , id)
                if(!isNaN(punkId) && parseInt(punkId) == parseInt(id)){
                    ownsPunk = true 
                }
            }

            return ownsPunk
        }

        static ethJsUtilecRecover(msg,signature)
        {
      
      
      
          console.log('ecrecover ', msg, signature)
            var res = ethJsUtil.fromRpcSig(signature)
      
            const msgHash = ethJsUtil.hashPersonalMessage(Buffer.from( msg ) );
      
      
            var pubKey = ethJsUtil.ecrecover( ethJsUtil.toBuffer(msgHash) , res.v, res.r, res.s);
            const addrBuf = ethJsUtil.pubToAddress(pubKey);
            const recoveredSignatureSigner    = ethJsUtil.bufferToHex(addrBuf);
            console.log('rec:', recoveredSignatureSigner)
      
      
          return recoveredSignatureSigner;
      
         }



        static async findAllERC721ByOwner(publicAddress,mongoInterface){
            publicAddress = web3utils.toChecksumAddress(publicAddress)
            return await mongoInterface.findAll('erc721_balances',{accountAddress: publicAddress })
        }



        static async findAllERC721ByToken(publicAddress,mongoInterface){
            publicAddress = web3utils.toChecksumAddress(publicAddress)
            return await mongoInterface.findAll('erc721_balances',{contractAddress: publicAddress })
        }


        static async findAllERC721ByTokenAndOwner(contractAddress,ownerAddress, mongoInterface){
            ownerAddress = web3utils.toChecksumAddress(ownerAddress)
            contractAddress = web3utils.toChecksumAddress(contractAddress)
           
            return await mongoInterface.findAll('erc721_balances',{contractAddress:contractAddress, accountAddress: ownerAddress })
        }



        static async findBurnedERC20ByFrom(publicAddress,mongoInterface){
            publicAddress = web3utils.toChecksumAddress(publicAddress)
            return await mongoInterface.findAll('erc20_burned',{from: publicAddress })
        }

        static async findBurnedERC20ByToken(tokenAddress,mongoInterface){
            tokenAddress = web3utils.toChecksumAddress(tokenAddress)
            return await mongoInterface.findAll('erc20_burned',{token: tokenAddress })
        }

         
        static async findERC20BalanceByAccount(accountAddress, mongoInterface){
            accountAddress = web3utils.toChecksumAddress(accountAddress) 
            return await mongoInterface.findAll('erc20_balances',{accountAddress: accountAddress  })
        }

        static async findERC20BalanceByToken(tokenAddress,mongoInterface){
            tokenAddress = web3utils.toChecksumAddress(tokenAddress)
            return await mongoInterface.findAll('erc20_balances',{contractAddress: tokenAddress })
        }


        //IMPLEMENT THESE 

     /*   static async findERC20TransferredByToken(tokenAddress,mongoInterface){
            tokenAddress = web3utils.toChecksumAddress(tokenAddress)
            return await mongoInterface.findAll('erc20_transferred',{token: tokenAddress })
        }*/

        static async findERC20TransferredByFrom(from,mongoInterface){
            from = web3utils.toChecksumAddress(from)
            return await mongoInterface.findAll('erc20_transferred',{from: from })
        }

        static async findERC20TransferredByTo(to,mongoInterface){
            to = web3utils.toChecksumAddress(to)
            return await mongoInterface.findAll('erc20_transferred',{to: to })
        }

        static async findERC20TransferredByFromTo(from,to,mongoInterface){
            from = web3utils.toChecksumAddress(from)
            to = web3utils.toChecksumAddress(to)
            return await mongoInterface.findAll('erc20_transferred',{from: from, to:to })
        }

         
    }