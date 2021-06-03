 


/*

*/


const registeredCallbacks = {} 

export default class RegisterableEmitter {

    on(  alias, func){

        let existingArray = registeredCallbacks 
  
        existingArray[alias] = func 

        console.log('registered callback',   alias )
   }

   emit(  data){

        let allCallbacks = registeredCallbacks 

        for(let [key,callback] of Object.entries( allCallbacks)  ){
            callback(data)
        }

   }
}


 