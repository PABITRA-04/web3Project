import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { Web3Provider } from '@ethersproject/providers';
import { contractABI, contractAddress } from "../utils/constants";




export const TransactionContext = React.createContext();

const { ethereum } = window;

const getEthereumContract = () => {
  //const provider = new ethers.providers.Web3Provider(ethereum);
  const provider = new Web3Provider(ethereum);
 

  const signer = provider.getSigner();
  const transactionsContract = new ethers.Contract(contractAddress, contractABI, signer);

  return transactionsContract;
// console.log({
  // provider,
  // signer,
  // transactionsContract
   //   });
}
export const TransactionsProvider = ({ children }) => {
    const [currentAccount, setCurrentAccount] = useState("");
    const [formData, setFormData] = useState({ addressTo: "", amount: "", keyword: "", message: "" });
    const [isLoading, setIsLoading] = useState(false);
    const [transactionCount, setTransactionCount] = useState(localStorage.getItem("transactionCount"));
    //const [transactions, setTransactions] = useState([]);
  
   const handleChange = (e, name) => {
      setFormData((prevState) => ({ ...prevState, [name]: e.target.value }));
    };
   
    const checkIfWalletIsConnected = async () =>{
        try{
           if(!ethereum)return alert("please install MetaMask");

       
           const accounts= await ethereum.request({ method:'eth_accounts' });
       if(accounts.length){
           setCurrentAccount(accounts[0]);

            // getAllTransactions();
       }
       else{
           console.log('No account found');
       }
        //console.log(accounts);
   }

       catch(error){
          console.log(error);
          throw new error(" No ethereum object");
       }
    }


    const connectWallet = async () => {
        try {
          if (!ethereum) return alert("Please install MetaMask.");
    
          const accounts = await ethereum.request({ method: "eth_requestAccounts", });
    
          setCurrentAccount(accounts[0]);
          window.location.reload();
        } catch (error) {
          console.log(error);
    
          throw new Error("No ethereum object");
        }
      };
      const sendTransaction = async () => {
        try {
            if (!ethereum) return alert("Please install MetaMask.");
           // if (ethereum) {
                const { addressTo, amount, keyword, message } = formData;
               // getEthereumContract();
                const transactionsContract = getEthereumContract();
                 const parsedAmount = ethers.parseEther(amount);
                 //const parsedamount = ethers.utils.parseEther(amount);
                 const network = await ethereum.request({ method: 'net_version' });
     
                await ethereum.request({
                  method: "eth_sendTransaction",
                  params: [{
                    from: currentAccount,
                    to: addressTo,
                    gas: "0x5208",
                    value: parsedAmount._hex,
                  }]
                  });
        
                const transactionHash = await transactionsContract.addToBlockchain(addressTo, parsedAmount, message, keyword);
        
                setIsLoading(true);
                console.log(`Loading - ${transactionHash.hash}`);
                await transactionHash.wait();
                setIsLoading(false);
                console.log(`Success - ${transactionHash.hash}`);
        
                const transactionsCount = await transactionsContract.getTransactionCount();
        
                setTransactionCount(transactionsCount.toNumber());
               // window.location.reload();
            //  } else {
              //  console.log("No ethereum object");
              //}
            //

        } catch (error) {
            console.log(error);
      
            throw new Error("No ethereum object");
          }
        };
   useEffect(() =>{
    checkIfWalletIsConnected();
   },[]);
   return(
    <TransactionContext.Provider value={{connectWallet, currentAccount, formData, setFormData, handleChange, sendTransaction}}>
        {children}
    </TransactionContext.Provider>
   );
}
  
