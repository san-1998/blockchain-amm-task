import detectEthereumProvider from "@metamask/detect-provider";
import Web3 from "web3";
import styled from "styled-components";

import React,{FC, useEffect} from 'react';
import { spenderabi } from "./JSON-FILE/spenderabi";
import { pairAddress, spenderAddress } from "./addresses";
import { pairabi } from "./JSON-FILE/pairabi";
const  web3=new Web3(Web3.givenProvider);
//@ts-ignore
const pairContractInstance=new web3.eth.Contract(pairabi,pairAddress); 

      

// const  web3=new Web3(provider);


const Provider:FC=()=>{
 
  const connectWalletHandler= async ()=>{
      const provider:any = await detectEthereumProvider();
         if (provider) {
           let ethereum:any = window.ethereum
             console.log('bnb network successfully detected!')
             const address = await ethereum.request({ method: 'eth_requestAccounts' });
             console.log (address[0]);
              return address[0];

          //  const chainId = await provider.request({
          //       method: 'eth_chainId'
          //     })
          //     return chainId;
          } 
          else{
            console.error('Please install MetaMask!')
          }

          fetchReservesFromPairContract();
    }
   
    

    
    const init=()=>{
     
      console.log(7324,web3);
      //@ts-ignore
      const contract=new web3.eth.Contract(spenderabi,spenderAddress); 
       //@ts-ignore
      const reserve = pairContractInstance.methods.getReserves().call().then((a:any)=>a);
      console.log(22222,reserve);
      // document.write(reserve._reserve0)
      // spenderContractInstance.methods.quote(convertToWei(amountA), reserveA, reserveB)
      // .call();
      
    }

     const fetchReservesFromPairContract = async () => {
      try {
        const reserves = await pairContractInstance.methods.getReserves().call();
        return reserves;
      } catch (error) {
        console.log("fetchReservesFromPair", error);
      }
    };
    

    useEffect(()=>{
       init();
    },[])


    return(
        <>
         <button onClick={connectWalletHandler}>CONNECT</button>
        </>
    )
}
export default Provider;