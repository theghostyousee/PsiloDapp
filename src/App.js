import './index.css';
import wallet from './media/wallet.svg'
import logo from './media/logo.svg'
import eth from './media/ETH.svg'
import click from './media/click.svg'
import twitter from './media/twitter.svg'
import discord from './media/discord.svg'
import Web3 from "web3";
import contractABI from "./ABI.json";
import React, { useState, useEffect } from "react";

function App() {

  const [userAddress, setUserAddress] = useState(null);
  const [buttonText, setButtonText] = useState('Connect Wallet');

  useEffect(() => {
    // Check if MetaMask is installed
    if (typeof window.ethereum !== 'undefined') {
      // Request access to user's accounts
      window.ethereum.request({ method: 'eth_requestAccounts' })
        .then(accounts => {
          const web3 = new Web3(window.ethereum);
          // Get the user's address
          setUserAddress(accounts[0]);
          setButtonText(shortAddress(accounts[0]));
        })
        .catch(error => {
          console.error(error);
          setButtonText('Connect Wallet');
        });
    }
  }, []);

  const shortAddress = (address) => {
    return address ? address.slice(0, 6) + '...' + address.slice(-5) : '';
  };


    const [amount, setAmount] = useState("");
    const [connected, setConnected] = useState(false);
    const [totalPurchased, setTotalPurchased] = useState(0);


  const handleMaxClick = async () => {
    const web3 = new Web3(window.ethereum);
    const accounts = await web3.eth.getAccounts();
    const balance = await web3.eth.getBalance(accounts[0]);
    const value = web3.utils.fromWei(balance, "ether");
    setAmount(value);
  };

  const handleAmountChange = (event) => {
    const value = event.target.value;
    setAmount(value);
  };
  const handleUnlockWallet = async () => {
    const web3 = new Web3(window.ethereum);
    const contractAddress = "0x667C0CDDbA69b89784532EE38eaFee681f877303";
    const contract = new web3.eth.Contract(contractABI, contractAddress);

    const sender = (await web3.eth.getAccounts())[0];
    const value = web3.utils.toWei(amount, "ether");

    try {
      const result = await contract.methods.buyPresale().send({
        from: sender,
        value: value,
      });
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const updateTotalPurchased = async () => {
      const web3 = new Web3(window.ethereum);
      const contractAddress = "0x667C0CDDbA69b89784532EE38eaFee681f877303";
      const contract = new web3.eth.Contract(contractABI, contractAddress);

      const purchased = await contract.methods.totalPurchased().call();
      setTotalPurchased(web3.utils.fromWei(purchased, 'ether'));
    };
    updateTotalPurchased();
  }, []);

  const percentage = (totalPurchased / 200) * 100;

  async function connectWallet() {
    try {
      const web3 = new Web3(window.ethereum);

      // Get the user's accounts
      const accounts = await web3.eth.requestAccounts();

      // Check if the user is on the Arbitrum chain
      const chainId = await web3.eth.getChainId();
      if (chainId !== 42161) {
        setButtonText('Wrong Network');
        return;
      }

      // Update state with the user's address
      setUserAddress(accounts[0]);
      setButtonText(shortAddress(accounts[0]));
    } catch (error) {
      console.error(error);
    }
  }


  return (
    <div className="App">
      <header className="header">



        <button className='connect-btn' onClick={() => window.ethereum && connectWallet()}>{userAddress ? shortAddress(userAddress) : buttonText}

        </button>
        <div className='liste'>
          <a>Dashboard</a>
          <a>Market</a>
          <a>Stake</a>
          <a>Vest</a>
          <a style={{ color: 'rgb(55, 114, 255)' }}>IDO</a>

        </div>
        <img  className='logo'    src={logo}></img>
      </header>
      <main>
        <div className='wrap'>
          <div className='card-presale'>

            <div className='title-presale'>
              <h1>The Presale will start soon.</h1>
            </div>

            <div className='wrap-indicator'>
              <div className='long-bar'>
                <p>24 hours</p>
              </div>
              <div className='info'>
                <div className='petit-rond'>
                </div>
                <p>Public Round</p>
              </div>
            </div>
            <div className='invest-progress'>
              <div className='invest-title'>
                <p>Investment progress</p>
              </div>

              <div className='invest-wrap'>
                <div className='invest-loads'>
                  <div className='invests-progress'style={{ width: `${percentage}%` }}></div>
                </div>
              </div>

              <div className='raised-funds'>
                <div className='amount-title'>
                  <h3>Total Fund Raised</h3>
                </div>
                <div className='amount'>
                  <h3>{(totalPurchased * 1800).toFixed(2)}$</h3>
                  <img src={eth}></img>
                </div>
              </div>
              <div className='raised-funds'>
                <div className='amount-title'>
                  <h3>Total PSILO for Sale</h3>
                </div>
                <div className='amount'>
                  <h3>250</h3>
                </div>
              </div>

            </div>

          </div>

          <div className='card-buy'>
            <div className='input-holder'>
              <h6>Amount</h6>
              <button className='max'  onClick={handleMaxClick} >Max</button>
              <input type={'number'} placeholder="0.0" onChange={handleAmountChange} value={amount} ></input>
              <div className='eth-handler'>
                <img src={eth}></img>
                <h3>ETH</h3>
              </div>
            </div>
            <div className='btn-wrapper'>
              <button onClick={handleUnlockWallet}>Contribute</button>
            </div>

          </div>
          <div className='description-card'>
            <div className='paragraph'>

              <p> The Psilo protocol operates on a fair launch model, 
                where 100% of the revenue generated is distributed to $Psilo token holders with no involvement from VC. 
                <span style={{ fontWeight: 500 }}>The Psilo team will not retain any portion of the funds raised during the public sale. 
                All funds will be allocated according to the project's established plan and goals.</span>


              </p>

            </div>

            <div className='paragraph'>

              <p> As a token staker, you can expect to receive returns that are significantly higher than other LSD assets, such as ETH staking. 
                By staking and locking up $PSILO, you can earn a yearly return ranging from 10% to 30% in ETH, in addition to extra rewards in the form of esPSILO. </p>

            </div>

            <div className='paragraph2'>

              <p>For the latest updates and accurate information regarding the claiming of $PSILO tokens, please follow the official announcements.</p>

            </div>
            <div className='links'>
              <a href='#'>Presale Contract</a>
              <img src={click}></img>
              
              
            </div>
            
  
  
          </div>
        </div>
        <footer>

          <p>© 2023 Psilo</p>
          <div className='social-footer'>

            <img src={twitter}></img>
            <img src={discord}></img>
          </div>
        </footer>
      </main>

    </div>
  );
}

export default App;
