import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { injected } from "./web3file";
import { useWeb3React } from "@web3-react/core";
import * as styles from "./mainstyle";
import "./App.css";
import Web3 from "web3";
import { Modal } from "react-bootstrap";
import detectEthereumProvider from "@metamask/detect-provider";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { pairabi } from "./AMM-Task/JSON-FILE/pairabi";
import {
  busdTokenAddress,
  bustTokenAddress,
  pairAddress,
  spenderAddress,
} from "./AMM-Task/addresses";
import { spenderabi } from "./AMM-Task/JSON-FILE/spenderabi";
import { busdtokenabi } from "./AMM-Task/JSON-FILE/busdtokenabi";
import { busttokenabi } from "./AMM-Task/JSON-FILE/busttokenabi";

const ownerAddress = "0x0dbebde22004369a8456a020c684cfdf6b81dc66";

let high: boolean = false;
let flag: boolean = false;
let web3 = new Web3(Web3.givenProvider);
let provider: any = window.ethereum;
let select: boolean = false;
//@ts-ignore
const PairContract = new web3.eth.Contract(pairabi, pairAddress);
const spenderContractInstance = new web3.eth.Contract(
  //@ts-ignore
  spenderabi,
  spenderAddress
);
const busdTokenContractInstance = new web3.eth.Contract(
  //@ts-ignore
  busdtokenabi,
  busdTokenAddress
);
const bustTokenContractInstance = new web3.eth.Contract(
  //@ts-ignore
  busttokenabi,
  bustTokenAddress
);

const MainComponent = () => {
  const [reserves, setReserves] = useState<any>({});
  const [percent, setPercent] = useState<any>("");
  const [balance, setBalance] = useState<any>("");
  const [newBusd, setNewBusd] = useState<any>(""); //busd
  const [newBust, setNewBust] = useState<any>(""); //bust
  const [userAddress, setUserAddresss] = useState<any>("");
  const [toggle, setToggle] = useState<string>("add");
  const [chainID, setChainID] = useState<any>(null);
  const [lpBalance, setLpBalance] = useState<any>(null);
  const [busdBalance, setBusdBalance] = useState<any>(null);
  const [bustBalance, setBustBalance] = useState<any>(null);
  const [swapBusdToken, setSwapBusdToken] = useState<any>(""); //swap busd
  const [swapBustToken, setSwapBustToken] = useState<any>(""); //swap bust
  const [remove, setRemove] = useState<any>({
    totalLpBalance: null,
    busdLpBalance: null,
    bustLpBalance: null,
  });

  const [click, setClick] = useState<any>("");
  const [mainBusdShow, setMainBusdShow] = useState<any>("");
  const [mainBustShow, setMainBustShow] = useState<any>("");
  const [isWallectConnected, setIsWalletConnected] = useState<boolean>(false);
  const { activate, deactivate, account, chainId } = useWeb3React();

  const reserveA = reserves._reserve0;
  const reserveB = reserves._reserve1;

  const amountA = parseFloat(balance).toFixed(5);

  let slippage = 0.5;
  const amountAmin: any = newBusd - (slippage / 100) * newBusd;
  const amountBmin: any = newBust - (slippage / 100) * newBust;
  console.log("min", amountAmin, amountBmin);

  const deadline = Math.floor(new Date().getTime() / 1000) + 900;

  const removeAmountAmin =
    remove.busdLpBalance - (slippage / 100) * remove.busdLpBalance;
  const removeAmountBmin =
    remove.bustLpBalance - (slippage / 100) * remove.bustLpBalance;

  console.log("click button4545", click);
  console.log("mainBalance", balance, chainID);
  console.log("deadline", deadline);
  console.log("reserves", reserveA, reserveB);
  console.log("amount", amountA);
  console.log("UserAddress", userAddress);
  console.log("totalSupplymkolp", lpBalance, busdBalance, bustBalance);
  console.log("busdmainBalance433", mainBusdShow);
  console.log(
    "percentageSupply",
    remove.totalLpBalance,
    remove.busdLpBalance,
    remove.bustLpBalance
  );
  console.log("swap the tokens", swapBusdToken, swapBustToken);

  // const checkWalletAvailable = () => {
  //   if (typeof window.ethereum !== "undefined") {
  //     if (window.ethereum && window.ethereum.isMetaMask) {
  //       return true;
  //     } else {
  //       alert("metamask is awailable");
  //     }
  //   } else {
  //     alert("metamask is not available");
  //   }
  // };

  const getUserAddress = async () => {
    const accounts = await provider.request({
      method: "eth_requestAccounts",
    });
    const accountAddress = accounts[0];
    return accountAddress;
  };

  const getMainBalance = async () => {
    let address = await getUserAddress();
    let balance = await web3.eth.getBalance(address);
    let mainBalance = await web3.utils.fromWei(balance);
    setBalance(mainBalance);
  };

  const connect = async () => {
    flag = true;
    try {
      await activate(injected);
      await fetchReservesFromPairContract();
      let address = await getUserAddress();
      // setBalance(balance);
      setChainID(chainID);
      setUserAddresss(address);
      setIsWalletConnected(true);
      await busdMainBalance();
      await bustMainBalance();
    } catch (err) {
      console.log(err, 909090);
    }
  };

  useEffect(() => {
    getMainBalance();
    // switchEthereumChain();

    if (account) return userAddress;
  }, [chainId, account]);

  useEffect(() => {
    switchEthereumChain();
  }, [!flag, chainId]);

  useEffect(() => {
    if (isWallectConnected) {
      getTotalSupply();
      busdMainBalance();
      bustMainBalance();
    }
  }, [isWallectConnected]);

  const disconnect = async () => {
    flag = false;
    try {
      await deactivate();
      setNewBusd("");
      setNewBust("");
      setBalance("");
      setLpBalance(null);
      setBusdBalance(null);
      setBustBalance(null);
      setRemove({
        totalLpBalance: null,
        bustLpBalance: null,
        busdLpBalance: null,
      });
      setMainBusdShow("0.00");
      setMainBustShow("0.00");
      setSwapBusdToken("");
      setSwapBustToken("");
      setIsWalletConnected(false);
    } catch (err) {
      console.log("not dis connected", err);
    }
  };

  useEffect(() => {
    allowFunction();
  }, [account]);

  const fetchReservesFromPairContract = async () => {
    try {
      const reserves = await PairContract.methods.getReserves().call();
      setReserves(reserves);
    } catch (error) {
      console.log("fetchReservesFromPair", error);
    }
  };

  const switchEthereumChain = async () => {
    try {
      await provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x61" }],
      });
    } catch (e: any) {
      if (e.code === 4902) {
        try {
          await provider.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x61",
                chainName: "Smart Chain - Testnet",
                nativeCurrency: {
                  name: "Binance",
                  symbol: "BNB", // 2-6 characters long
                  decimals: 18,
                },
                blockExplorerUrls: ["https://testnet.bscscan.com"],
                rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545/"],
              },
            ],
          });
        } catch (addError) {
          console.error(addError);
        }
      }
      // console.error(e)
      toast.warn("permission has been Denied");
    }
  };

  const fetchQuoteFromSpender = async (
    amountA: any,
    reserveA: any,
    reserveB: any
  ) => {
    try {
      const spenderAmount = await spenderContractInstance.methods
        .quote(web3.utils.toWei(amountA), reserveA, reserveB)
        .call();
      return web3.utils.fromWei(spenderAmount);
    } catch (error) {
      console.log("amount from spender address", error);
    }
  };

  // approve function
  const allowFunction = async () => {
    console.log(account, spenderAddress, "allowanceFunctiondata");
    try {
      let allowance = await busdTokenContractInstance.methods
        .allowance(account, spenderAddress)
        .call();
      console.log("Allowance Data", web3.utils.fromWei(allowance, "ether"));
    } catch (error) {
      console.log(error);
    }
  };

  const approve0 = async () => {
    try {
      const value = web3.utils.toWei(newBusd.toString());
      let approveTokenZero = await busdTokenContractInstance.methods
        .approve(spenderAddress, value)
        .send({ from: userAddress });
      // const gasLimit = await busdTokenContractInstance.methods;
      //   .approve(spenderAddress, value)
      //   .estimateGas({ from: userAddress });
      // console.log("this is gaslimit per transaction7878", gasLimit);

      console.log(approveTokenZero.status, "approvezero767667767");
      return approveTokenZero;
    } catch (error) {
      console.log("approval0 address", error);
    }
  };

  const approve1 = async () => {
    try {
      let approveTokenFirst = await bustTokenContractInstance.methods
        .approve(spenderAddress, web3.utils.toWei(newBust.toString()))
        .send({ from: userAddress });
      console.log(approveTokenFirst.status, "approvezero7676677698987");
      return approveTokenFirst;
    } catch (error) {
      console.log("approval amount error", error);
    }
  };

  // remove liquidity approve function..........................

  const removeLiquidityApprove = async () => {
    try {
      let approveLp = await PairContract.methods
        .approve(spenderAddress, web3.utils.toWei(lpBalance.toString()))
        .send({
          from: userAddress,
        });
      return approveLp;
    } catch (error) {
      console.log("remove Liquidity Approve Error", error);
    }
  };

  //...............................................................

  //  approve LP tokens (busd,bust) token for swap liquidity..........................

  // const approveSwapBusdLpToken = async () => {
  //   try {
  //     const approveBusdToken= await busdTokenContractInstance.methods
  //       .approve(spenderAddress, web3.utils.toWei(swapBusdToken.toString()))
  //       .send({
  //         from: userAddress,
  //       });
  //     return approveBusdToken
  //   } catch (error) {
  //     console.log("approveBusdLpToken is failed", error);
  //   }
  // };

  const approveSwapBustLpToken = async () => {
    try {
      const approveBustToken = await bustTokenContractInstance.methods
        .approve(spenderAddress, web3.utils.toWei(swapBustToken.toString()))
        .send({
          from: userAddress,
        });
      return approveBustToken;
    } catch (error) {
      console.log("approveBusdLpToken is failed", error);
    }
  };

  //.....................................................................................

  const busdMainBalance = async () => {
    try {
      const busdMainBalance = await busdTokenContractInstance.methods
        .balanceOf(account)
        .call();
      setMainBusdShow(
        Number(web3.utils.fromWei(busdMainBalance)).toFixed(2).toString()
      );
    } catch (err) {
      console.log("busd main balance error", err);
    }
  };

  const bustMainBalance = async () => {
    try {
      const bustMainBalance = await bustTokenContractInstance.methods
        .balanceOf(account)
        .call();
      setMainBustShow(
        Number(web3.utils.fromWei(bustMainBalance)).toFixed(2).toString()
      );
    } catch (err) {
      console.log("busd main balance error", err);
    }
  };

  const handleBusdChange = async (e: any) => {
    const input = e.target.value;
    setNewBusd(input);
    console.log("A", input);
    const temp = await fetchQuoteFromSpender(input, reserveA, reserveB);
    setNewBust(temp);
  };

  const handleBustChange = async (e: any) => {
    const input = e.target.value;
    console.log("B", input);
    setNewBust(input);
    const temp = await fetchQuoteFromSpender(input, reserveB, reserveA);
    setNewBusd(temp);
  };

  const swapBusdHandleChange = async (e: any) => {
    const input = e.target.value;
    setClick("busd");
    console.log("swapA", input);
    setSwapBusdToken(input);
    const temp1 = await spenderContractInstance.methods
      .getAmountsOut(web3.utils.toWei(input.toString()), [
        busdTokenAddress,
        bustTokenAddress,
      ])
      .call();
    setSwapBustToken(web3.utils.fromWei(temp1[1].toString()));
  };

  const swapBustHandleChange = async (e: any) => {
    const input = e.target.value;
    setClick("bust");
    console.log("swapB", input);
    setSwapBustToken(input);
    const temp2 = await spenderContractInstance.methods
      .getAmountsIn(web3.utils.toWei(input.toString()), [
        busdTokenAddress,
        bustTokenAddress,
      ])
      .call();
    setSwapBusdToken(web3.utils.fromWei(temp2[0].toString()));
  };

  const getLpBalance = async () => {
    const LpBalance = await PairContract.methods.balanceOf(userAddress).call();
    console.log("lpbalance", LpBalance);
    return LpBalance;
  };

  const getTotalSupply = async () => {
    console.log("total supply karna hai");
    let lpbalance = await getLpBalance();
    const totalSupply = await PairContract.methods.totalSupply().call();
    const busdBalance = ((reserveA / totalSupply) * lpbalance).toString();
    const bustBalance = ((reserveB / totalSupply) * lpbalance).toString();
    setLpBalance(Number(web3.utils.fromWei(lpbalance)).toFixed(4).toString());
    setBusdBalance(Number(web3.utils.fromWei(busdBalance)).toFixed(4));
    setBustBalance(Number(web3.utils.fromWei(bustBalance)).toFixed(4));
  };

  const quaterPercentage = () => {
    const quater = (25 / 100) * lpBalance;
    const quater1 = (25 / 100) * busdBalance;
    const quater2 = (25 / 100) * bustBalance;
    select = true;
    setPercent("25%");
    if (lpBalance !== null || busdBalance !== null || bustBalance !== null) {
      setRemove({
        totalLpBalance: Number(quater).toFixed(4),
        busdLpBalance: Number(quater1).toFixed(4),
        bustLpBalance: Number(quater2).toFixed(4),
      });
    } else {
      setRemove({
        totalLpBalance: lpBalance,
        busdLpBalance: busdBalance,
        bustLpBalance: bustBalance,
      });
    }
  };

  const halfPercentage = () => {
    const quater = (50 / 100) * lpBalance;
    const quater1 = (50 / 100) * busdBalance;
    const quater2 = (50 / 100) * bustBalance;
    select = true;
    setPercent("50%");

    if (lpBalance !== null || busdBalance !== null || bustBalance !== null) {
      setRemove({
        totalLpBalance: Number(quater).toFixed(4),
        busdLpBalance: Number(quater1).toFixed(4),
        bustLpBalance: Number(quater2).toFixed(4),
      });
    } else {
      setRemove({
        totalLpBalance: lpBalance,
        busdLpBalance: busdBalance,
        bustLpBalance: bustBalance,
      });
    }
  };

  const halfAbovePercentage = () => {
    const quater = (75 / 100) * lpBalance;
    const quater1 = (75 / 100) * busdBalance;
    const quater2 = (75 / 100) * bustBalance;
    select = true;
    setPercent("75%");

    if (lpBalance !== null || busdBalance !== null || bustBalance !== null) {
      setRemove({
        totalLpBalance: Number(quater).toFixed(4),
        busdLpBalance: Number(quater1).toFixed(4),
        bustLpBalance: Number(quater2).toFixed(4),
      });
    } else {
      setRemove({
        totalLpBalance: lpBalance,
        busdLpBalance: busdBalance,
        bustLpBalance: bustBalance,
      });
    }
  };
  const highlights = () => {
    high = true;
    console.log("clickeddd", high);
  };
  const totalPercentage = () => {
    select = true;
    setPercent("100%");

    setRemove({
      totalLpBalance: lpBalance,
      busdLpBalance: busdBalance,
      bustLpBalance: bustBalance,
    });
  };

  const addLiquidityHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newBusd === "" || newBust === "") {
      toast.warn("please fill the empty fields", {
        position: "top-right",
      });
    } else {
      const token0Approved = await approve0();
      const token1Approved = await approve1();

      console.log("approveFunction0", token0Approved);
      console.log("approveFunction1", token1Approved);

      if (token0Approved && token1Approved) {
        const addLiquidity1 = await spenderContractInstance.methods
          .addLiquidity(
            busdTokenAddress,
            bustTokenAddress,
            web3.utils.toWei(newBusd.toString()),
            web3.utils.toWei(newBust.toString()),
            web3.utils.toWei(amountAmin.toString()),
            web3.utils.toWei(amountBmin.toString()),
            userAddress,
            deadline
          )
          .send({ from: userAddress })
          .on("transactionHash", function (hash: any) {
            console.log("hash", hash);
          })
          .on("receipt", function (receipt: any) {
            console.log("receipt", receipt);
          })
          .on(
            "confirmation",
            function (confirmationNumber: any, receipt: string) {
              console.log(confirmationNumber, receipt);
            }
          )
          .on("error", function (error: any, receipt: string) {
            console.log(error, receipt);
          });

        // const gasLimit = await spenderContractInstance.methods
        //   .addLiquidity(
        //     busdTokenAddress,
        //     bustTokenAddress,
        //     web3.utils.toWei(newBusd.toString()),
        //     web3.utils.toWei(newBust.toString()),
        //     web3.utils.toWei(amountAmin.toString()),
        //     web3.utils.toWei(amountBmin.toString()),
        //     userAddress,
        //     deadline
        //   )
        //   .estimateGas({ from: userAddress });
        // console.log("this is gaslimit per transaction", gasLimit);

        console.log("addliquidity", addLiquidity1);

        if (addLiquidity1) {
          setNewBusd("");
          setNewBust("");
          toast.success("liquidity Has been added Successfully", {
            position: "top-center",
          });
        } else {
          toast.error("Oops request is rejected by user", {
            position: "top-center",
          });
        }
      } else {
        toast.error("user Rejected the Requested");
      }
    }
  };

  const removeLiquidityHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (select === true) {
      const approveRemove = await removeLiquidityApprove();
      if (approveRemove) {
        const removeLiquidity = await spenderContractInstance.methods
          .removeLiquidity(
            busdTokenAddress,
            bustTokenAddress,
            web3.utils.toWei(remove.totalLpBalance.toString()),
            web3.utils.toWei(remove.busdLpBalance.toString()),
            web3.utils.toWei(remove.bustBalance.toString()),
            userAddress,
            deadline
          )
          .send({ from: userAddress });

        console.log("remove liquidity from pull", removeLiquidity);

        if (removeLiquidity) {
          toast.success("selected Liquidity has been Removed");
        }
      } else {
        setRemove({
          totalLpBalance: null,
          bustLpBalance: null,
          busdLpBalance: null,
        });
        toast.error("user Rejected the Requested");
      }
    } else {
      toast.warn("kindly select remove percentage");
    }
  };

  const swapLiquidityHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (flag === true) {
      if (swapBusdToken === "" || swapBustToken === "") {
        toast.warn("please enter the swap value", {
          position: "top-right",
        });
      } else {
        const approveSwapBusdLpToken = async () => {
          try {
            const approveBusdToken = await busdTokenContractInstance.methods
              .approve(
                spenderAddress,
                web3.utils.toWei(swapBusdToken.toString())
              )
              .send({
                from: userAddress,
              });
            return approveBusdToken;
          } catch (error) {
            console.log("approveBusdLpToken is failed", error);
          }
        };

        if (await approveSwapBusdLpToken()) {
          if (click === "busd") {
            const firstInputToken = await spenderContractInstance.methods
              .swapExactTokensForTokens(
                web3.utils.toWei(swapBusdToken.toString()),
                web3.utils.toWei(swapBustToken.toString()),
                [busdTokenAddress, bustTokenAddress],
                userAddress,
                deadline
              )
              .send({ from: userAddress });

            if (firstInputToken) {
              setSwapBusdToken("");
              setSwapBustToken("");
              toast.success("swap has been done Successfully", {
                position: "top-center",
              });
            } else {
              toast.error("request is rejected", {
                position: "top-left",
              });
            }
          } else {
            const secondInputToken = await spenderContractInstance.methods
              .swapTokensForExactTokens(
                web3.utils.toWei(swapBustToken.toString()),
                web3.utils.toWei(swapBusdToken.toString()),
                [busdTokenAddress, bustTokenAddress],
                userAddress,
                deadline
              )
              .send({ from: userAddress });

            if (secondInputToken) {
              setSwapBusdToken("");
              setSwapBustToken("");
              toast.success("swap has been done successfully", {
                position: "top-center",
              });
            } else {
              toast.error("request is rejected", {
                position: "top-left",
              });
            }
          }
        } else {
          toast.error("request is rejected", {
            position: "top-center",
          });
        }
      }
    } else {
      toast.warn("please first connect to Wallet", {
        position: "top-left",
      });
    }
  };

  return (
    <>
      <styles.walletConnector>
        {/* <div style={{display:"block"}}></div> */}
        {flag === false ? (
          <styles.walletConnectButton onClick={connect}>
            Connect to Wallet
          </styles.walletConnectButton>
        ) : (
          <styles.walletConnectButton onClick={disconnect}>
            Disconnet
          </styles.walletConnectButton>
        )}

        {flag === true ? (
          <>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span>UserAddress:{account}</span>
              <span>Network Id:{chainId}</span>
              <span>Balance:{Number(balance).toFixed(3)}</span>
            </div>
          </>
        ) : null}
      </styles.walletConnector>

      <div className="parent-wrap">
        <div className="wrap">
          <div className="data">
            <div className="combine_button">
              <button className="button" onClick={() => setToggle("add")}>
                Add
              </button>
              <button className="button" onClick={() => setToggle("remove")}>
                Remove
              </button>
              <button className="button" onClick={() => setToggle("swap")}>
                Swap
              </button>
            </div>
            {(() => {
              switch (toggle) {
                case "add":
                  return (
                    <>
                      <form onSubmit={addLiquidityHandler}>
                        <div className="combine_input">
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <div style={{ padding: "5px" }}>
                              <label>
                                <span style={{ color: "rgb(40,13,95)" }}>
                                  BUSD
                                </span>
                              </label>
                            </div>
                            <div style={{ padding: "5px" }}>
                              <label>
                                <span style={{ color: "rgb(40,13,95)" }}>
                                  Balance&nbsp;:&nbsp;
                                  {balance !== "0.00" ? mainBusdShow : "0.00"}
                                </span>
                              </label>
                            </div>
                          </div>
                          <input
                            placeholder="0.00"
                            type="number"
                            onChange={handleBusdChange}
                            value={newBusd}
                          />
                        </div>
                        <div className="combine_input">
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <div style={{ padding: "5px" }}>
                              <span style={{ color: "rgb(40,13,95)" }}>
                                BUST
                              </span>
                            </div>
                            <div style={{ padding: "5px" }}>
                              <span style={{ color: "rgb(40,13,95)" }}>
                                Balance&nbsp;:&nbsp;
                                {balance !== "0.00" ? mainBustShow : "0.00"}
                              </span>
                            </div>
                          </div>
                          <input
                            placeholder="0.00"
                            type="number"
                            onChange={handleBustChange}
                            value={newBust}
                          />
                        </div>
                        <div className="combine_data">
                          <div>
                            <span style={{ color: "rgb(40,13,95)" }}>
                              <b>Slippage tolerance: 0.5%</b>
                            </span>
                          </div>
                          <div>
                            <span style={{ color: "rgb(40,13,95)" }}>
                              <b>Transaction deadline: 15 min</b>
                            </span>
                          </div>
                        </div>
                        <div className="combine_data">
                          <div>
                            <span style={{ color: "rgb(40,13,95)" }}>
                              <b>1BUSD = 2.495727 BUST</b>
                            </span>
                          </div>
                          <div>
                            <span style={{ color: "rgb(40,13,95)" }}>
                              <b>1BUST = 0.400685 BUSD</b>
                            </span>
                          </div>
                        </div>
                        <div className="combine_data">
                          <div>
                            <button
                              className="button"
                              // style={{ backgroundColor: "rgb(31,199,212)" }}
                              onClick={highlights}
                            >
                              <span>
                                <b>Add Liquidity</b>
                              </span>
                            </button>
                          </div>
                        </div>
                      </form>
                    </>
                  );
                case "remove":
                  return (
                    <>
                      <div className="combine_button">
                        <button
                          style={{
                            color:
                              percent === "25%" ? "white" : "rgb(122,110,170)",
                            background:
                              percent === "25%"
                                ? "rgb(21, 22, 37)"
                                : "rgb(238,234,244)",
                            boxShadow:
                              percent === "25%" ? "0 0 10px black" : "",
                          }}
                          onClick={quaterPercentage}
                        >
                          <b>25%</b>
                        </button>
                        <button
                          style={{
                            color:
                              percent === "50%" ? "white" : "rgb(122,110,170)",
                            background:
                              percent === "50%"
                                ? "rgb(21, 22, 37)"
                                : "rgb(238,234,244)",
                            boxShadow:
                              percent === "50%" ? "0 0 10px black" : "",
                          }}
                          onClick={halfPercentage}
                        >
                          <b>50%</b>
                        </button>
                        <button
                          style={{
                            color:
                              percent === "75%" ? "white" : "rgb(122,110,170)",
                            background:
                              percent === "75%"
                                ? "rgb(21, 22, 37)"
                                : "rgb(238,234,244)",
                            boxShadow:
                              percent === "75%" ? "0 0 10px black" : "",
                          }}
                          onClick={halfAbovePercentage}
                        >
                          <b>75%</b>
                        </button>
                        <button
                          style={{
                            color:
                              percent === "100%" ? "white" : "rgb(122,110,170)",
                            background:
                              percent === "100%"
                                ? "rgb(21, 22, 37)"
                                : "rgb(238,234,244)",
                            boxShadow:
                              percent === "100%" ? "0 0 10px black" : "",
                          }}
                          onClick={totalPercentage}
                        >
                          <b>Max</b>
                        </button>
                      </div>
                      <div className="combine_token">
                        <span
                          style={{
                            textAlign: "center",
                            color: "rgb(40,13,95)",
                            marginTop: "5px",
                          }}
                        >
                          Pooled Tokens
                        </span>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <div style={{ padding: "5px" }}>
                              <label>
                                <span style={{ color: "rgb(40,13,95)" }}>
                                  {lpBalance !== null ? lpBalance : "------"}
                                </span>
                              </label>
                            </div>
                            <div style={{ padding: "5px" }}>
                              <label>
                                <span style={{ color: "rgb(40,13,95)" }}>
                                  BUST-LP
                                </span>
                              </label>
                            </div>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <div style={{ padding: "5px" }}>
                              <label>
                                <span style={{ color: "rgb(40,13,95)" }}>
                                  {busdBalance !== null
                                    ? busdBalance
                                    : "------"}
                                </span>
                              </label>
                            </div>
                            <div style={{ padding: "5px" }}>
                              <label>
                                <span style={{ color: "rgb(40,13,95)" }}>
                                  BUSD
                                </span>
                              </label>
                            </div>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <div style={{ padding: "5px" }}>
                              <label>
                                <span style={{ color: "rgb(40,13,95)" }}>
                                  {bustBalance !== null
                                    ? bustBalance
                                    : "------"}
                                </span>
                              </label>
                            </div>
                            <div style={{ padding: "5px" }}>
                              <label>
                                <span style={{ color: "rgb(40,13,95)" }}>
                                  BUST
                                </span>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="combine_token">
                        <span
                          style={{
                            textAlign: "center",
                            color: "rgb(40,13,95)",
                            marginTop: "5px",
                          }}
                        >
                          Selected Tokens
                        </span>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <div style={{ padding: "5px" }}>
                              <label>
                                <span style={{ color: "rgb(40,13,95)" }}>
                                  {remove.totalLpBalance !== null
                                    ? remove.totalLpBalance
                                    : "------"}
                                </span>
                              </label>
                            </div>
                            <div style={{ padding: "5px" }}>
                              <label>
                                <span style={{ color: "rgb(40,13,95)" }}>
                                  BUST-LP
                                </span>
                              </label>
                            </div>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <div style={{ padding: "5px" }}>
                              <label>
                                <span style={{ color: "rgb(40,13,95)" }}>
                                  {" "}
                                  {remove.busdLpBalance !== null
                                    ? remove.busdLpBalance
                                    : "------"}
                                </span>
                              </label>
                            </div>
                            <div style={{ padding: "5px" }}>
                              <label>
                                <span style={{ color: "rgb(40,13,95)" }}>
                                  BUSD
                                </span>
                              </label>
                            </div>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <div style={{ padding: "5px" }}>
                              <label>
                                <span style={{ color: "rgb(40,13,95)" }}>
                                  {remove.bustLpBalance !== null
                                    ? remove.bustLpBalance
                                    : "------"}
                                </span>
                              </label>
                            </div>
                            <div style={{ padding: "5px" }}>
                              <label>
                                <span style={{ color: "rgb(40,13,95)" }}>
                                  BUST
                                </span>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="combine_data">
                        <div>
                          <button
                            className="button"
                            onClick={removeLiquidityHandler}
                          >
                            <span>
                              <b>Remove Liquidity</b>
                            </span>
                          </button>
                        </div>
                      </div>
                    </>
                  );
                case "swap":
                  return (
                    <form onSubmit={swapLiquidityHandler}>
                      <div className="combine_input">
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <div style={{ padding: "5px" }}>
                            <label>
                              <span style={{ color: "rgb(40,13,95)" }}>
                                From
                              </span>
                            </label>
                          </div>
                          <div style={{ padding: "5px" }}>
                            <label>
                              <span style={{ color: "rgb(40,13,95)" }}>
                                Balance &nbsp; : &nbsp;
                                {balance !== "0.00" ? mainBusdShow : "0.00"}
                              </span>
                            </label>
                          </div>
                        </div>
                        <input
                          placeholder="0.00"
                          type="number"
                          onChange={swapBusdHandleChange}
                          value={swapBusdToken}
                        />
                      </div>
                      <div className="combine_input">
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <div style={{ padding: "5px" }}>
                            <span style={{ color: "rgb(40,13,95)" }}>To</span>
                          </div>
                          <div style={{ padding: "5px" }}>
                            <span style={{ color: "rgb(40,13,95)" }}>
                              Balance&nbsp;:&nbsp;
                              {balance !== "0.00" ? mainBustShow : "0.00"}
                            </span>
                          </div>
                        </div>
                        <input
                          placeholder="0.00"
                          type="number"
                          onChange={swapBustHandleChange}
                          value={swapBustToken}
                        />
                      </div>
                      <div className="combine_data">
                        <div>
                          <span style={{ color: "rgb(40,13,95)" }}>
                            <b>Slippage tolerance: 0.5%</b>
                          </span>
                        </div>
                        <div>
                          <span style={{ color: "rgb(40,13,95)" }}>
                            <b>Transaction deadline: 15 min</b>
                          </span>
                        </div>
                      </div>
                      <div className="combine_data">
                        <div>
                          <span style={{ color: "rgb(40,13,95)" }}>
                            <b>1BUSD = 2.495727 BUST</b>
                          </span>
                        </div>
                        <div>
                          <span style={{ color: "rgb(40,13,95)" }}>
                            <b>1BUST = 0.400685 BUSD</b>
                          </span>
                        </div>
                      </div>
                      <div className="combine_data">
                        <div>
                          <button className="button" onClick={highlights}>
                            <span>
                              <b>Swap Liquidity</b>
                            </span>
                          </button>
                        </div>
                      </div>
                    </form>
                  );
              }
            })()}
          </div>
        </div>
      </div>
      {/* <div className="footer">
        <h4>Copyrights owned by @Sanjay2022</h4>
      </div> */}
    </>
  );
};

export default MainComponent;

// {
//     (flag===false)?<button className="connectButton" onClick={connect}>Connected</button>:null
//     }
//      {
//     (flag===true)?<button className="connectButton" onClick={disconnect}>Disconnect</button>:null
//     }

//     {
//      active ? <>
//         <span >userAddress:{account}</span>
//         <span>userAddress:{balance}</span>
//         <span>userAddress:{chainId}</span>
//         </>
//         : ""
//     }

//{lpbalance!==""initialstate"?lpbalance:""initial""}
