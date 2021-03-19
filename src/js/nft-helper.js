
 
import axios from "axios";


export default class NFTHelper {


    
    //really should use the graph - make a custom subgraph for each contract 
    static async findERC721TokensOwnedBy(web3Plug, nftContractAddress, publicAddress)
    {

        let nftDataArray = [] 
        
        let nftTokenContract = web3Plug.getNFTContract(nftContractAddress)  
        
        try{
        let wrappedTokenId = await nftTokenContract.methods.tokenOfOwnerByIndex( publicAddress , 0  ).call();
        let actualTokenId = await nftTokenContract.methods.tokenByIndex( wrappedTokenId  ).call();
        
        actualTokenIds.push( {actualTokenId: actualTokenId, wrappedTokenId: wrappedTokenId} )
        }catch(e){
            console.error(e)
        }

        return nftDataArray
    }


     
 

 
 




}