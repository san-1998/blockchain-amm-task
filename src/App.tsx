
import React, { useState, useEffect } from "react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import { injected } from "./web3file";
import { Web3ReactProvider } from "@web3-react/core";
import MainComponent from "./MainComponent";
const getLibrary=(provider:any)=>{
  return provider;
}

const App: React.FC = () => {
return (
    <>
     <Web3ReactProvider getLibrary={getLibrary}>
         <MainComponent/>
      </Web3ReactProvider>
      <ToastContainer autoClose={2000}/>
    </>
  );
};
export default App;











