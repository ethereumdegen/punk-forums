
 
import axios from "axios";


export default class BidPacketHelper {


    

    static async findWrappedMooncatsOwnedBy(publicAddress)
  {
 
 
        let graphURL = "https://api.thegraph.com/subgraphs/name/tibike6/mooncatrescue"

        let queryString = `
                            {
                            owners(where:{id:"`+publicAddress+`"}) {
                                id
                                cats {
                                id
                                }
                            
                            }
                            }  
                            `

            return new Promise(   (resolve, reject) => {

               axios.post(graphURL,{query: queryString})
               .then((res) => {
                  
                    console.log(res.data)
                    let results = res.data
                    let owner = results.data.owners[0]
                    if(!owner)return 

              
                     resolve(owner.cats)

                }) .catch((error) => {
                    console.error(error)
                    reject(error)
                })

            }); 
       
 

    }


    static async findWrappedPunksOwnedBy(publicAddress)
    {
   
   
          let graphURL = "https://api.thegraph.com/subgraphs/name/tibike6/mooncatrescue"
  
          let queryString = `
                              {
                              owners(where:{id:"`+publicAddress+`"}) {
                                  id
                                  cats {
                                  id
                                  }
                              
                              }
                              }  
                              `
  
              return new Promise(   (resolve, reject) => {
  
                 axios.post(graphURL,{query: queryString})
                 .then((res) => {
                    
                      console.log(res.data)
                      let results = res.data
                      let owner = results.data.owners[0]
                      if(!owner)return 
  
                
                       resolve(owner.cats)
  
                  }) .catch((error) => {
                      console.error(error)
                      reject(error)
                  })
  
              }); 
         
   
  
      }


  /*
            axios.post('https://api.thegraph.com/subgraphs/name/tibike6/mooncatrescue', {
                  query: `
                  {
                    owners(where:{id:"`+userAddress+`"}) {
                      id
                      cats {
                        id
                      }
                    
                    }
                  }  
                  `
                })
                .then((res) => {
                  
                    console.log(res.data)
                    let results = res.data
                    let owner = results.data.owners[0]
                    if(!owner)return 
 
                  
                    resolve(owner.cats)
                })
                .catch((error) => {
                  console.error(error)
                  reject(error)
                })

  */

 
 




}