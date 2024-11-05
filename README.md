Decentralized Storage Platform
This project is a decentralized storage platform using IPFS and Ethereum smart contracts. The platform allows users to offer their storage services, while other users can buy and use these services by uploading encrypted files to IPFS.

Installation and Setup
Requirements
Before you start, make sure you have the following dependencies installed:

Node.js (version 14.x or later)
npm or yarn
MetaMask (browser extension)
Ganache (for a local Ethereum development environment)
IPFS Kubo (formerly IPFS go-ipfs) for a local IPFS node
Truffle (for working with Solidity contracts)
Setup Steps
Clone the Repository

git clone https://github.com/n1tr0oo/decentralized-storage-platform.git
cd decentralized-storage-platform
Install Dependencies

Install all necessary packages to run the project:

npm install
Setup Local Blockchain (Ganache)

Install and run Ganache.
Configure MetaMask to use the Ganache network.
Start Ganache and note the RPC settings for connecting.
Deploy Smart Contracts

Ensure Truffle is installed globally:

npm install -g truffle
Compile and deploy the smart contracts:

truffle compile
truffle migrate --network development
Install and Configure IPFS Kubo

Download and install IPFS Kubo (go-ipfs) from the official site: https://dist.ipfs.tech/kubo

Initialize IPFS if this is your first time:

ipfs init
Start the IPFS daemon to keep the local node running:

ipfs daemon
Ensure IPFS is running at http://localhost:5001.

Start the Local Server

Run the server using Node.js:

node server.js
Libraries and Technologies Used
Solidity: For writing smart contracts
Web3.js: For interacting with the blockchain
IPFS Kubo: For decentralized data storage
Tailwind CSS: For styling the user interface
MetaMask: For managing Ethereum accounts
Ganache: For a local Ethereum development environment
Truffle: For deploying and testing smart contracts
Project Structure
contracts/: Solidity smart contracts
src/: Client-side source code
public/: Static files, including Tailwind CSS styles
server.js: Server code for interacting with IPFS and Web3.js
truffle-config.js: Truffle configuration
How to Use
Open MetaMask and connect it to the Ganache network.
Navigate to http://localhost:3000 to interact with the platform.
Register as a Provider: Enter the storage capacity and price, then click "Register Provider".
Buy Storage: Select an offer and click "Buy Storage".
Upload Files: Select and encrypt a file before uploading. Use the "Upload Files" button to upload to IPFS.
Withdraw Earnings: In the "Your Earnings" section, click "Withdraw Earnings" to withdraw your earnings.
Notes
Files are encrypted using asymmetric encryption (RSA for keys and AES for data).
Local Storage is used to store users' private and public keys.
Tailwind CSS is used to enhance the UI design.
Troubleshooting
If you encounter errors when deploying contracts, ensure Ganache is running.
Check that your IPFS node (Kubo) is running and accessible at http://localhost:5001.
Make sure all dependencies are installed and configured correctly.
