// Initialize Web3 and connect to MetaMask
let web3;
if (window.ethereum) {
    web3 = new Web3(window.ethereum);

    // Request account access from MetaMask
    window.ethereum.request({ method: 'eth_requestAccounts' })
        .then((accounts) => {
            // Retrieve the user's address
            const userAddress = accounts[0];
            document.getElementById('userAddress').innerText = userAddress;
            initializePage();
        })
        .catch(error => console.error("Error connecting to MetaMask:", error));
} else {
    alert("Please install MetaMask to use this platform!");
}



// Import IpfsHttpClient and initialize IPFS client
const { create } = window.IpfsHttpClient;
const ipfs = create({ host: 'localhost', port: '5001', protocol: 'http' });

const contractAddress = '0x9Dc066CC12B52191e1856E98198FD69Fdc88FBfb'; // Replace with your deployed contract address
const contractABI = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "files",
    "outputs": [
      {
        "internalType": "string",
        "name": "cid",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "fileName",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "size",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "encryptedAESKey",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "iv",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "providerBalances",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "storageOffers",
    "outputs": [
      {
        "internalType": "address",
        "name": "provider",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "capacity",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "pricePerMBPerDay",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "isActive",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "isCancelled",
        "type": "bool"
      },
      {
        "internalType": "uint256",
        "name": "purchaseTimestamp",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "buyer",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "userPurchasedOffers",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "capacity",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "pricePerMBPerDay",
        "type": "uint256"
      }
    ],
    "name": "registerProvider",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "offerIndex",
        "type": "uint256"
      }
    ],
    "name": "purchaseStorage",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function",
    "payable": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "offerIndex",
        "type": "uint256"
      }
    ],
    "name": "cancelOffer",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "offerIndex",
        "type": "uint256"
      }
    ],
    "name": "returnStorage",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "cid",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "fileName",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "size",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "encryptedAESKey",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "iv",
        "type": "string"
      }
    ],
    "name": "uploadFile",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "getUserFiles",
    "outputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "cid",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "fileName",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "size",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "owner",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "encryptedAESKey",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "iv",
            "type": "string"
          }
        ],
        "internalType": "struct StoragePlatform.File[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "getStorageOffersCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "getUserPurchasedOffers",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "withdrawEarnings",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]; // Replace with your contract ABI
const contract = new web3.eth.Contract(contractABI, contractAddress);


function initializePage() {
    if (window.location.pathname.includes('index.html')) {
        loadMainPage();
    } else if (window.location.pathname.includes('profile.html')) {
        loadProfilePage();
    }
}

async function loadMyProvidedStorages() {
  const myStoragesContainer = document.getElementById('myStoragesContainer');
  if (!myStoragesContainer) return;

  myStoragesContainer.innerHTML = ""; // Очистить существующее содержимое
  const accounts = await web3.eth.getAccounts();
  const userAddress = accounts[0];

  try {
    const totalOffers = await contract.methods.getStorageOffersCount().call();

    for (let i = 0; i < totalOffers; i++) {
      const offer = await contract.methods.storageOffers(i).call();

      // Проверить, что предложение принадлежит текущему пользователю
      if (offer.provider.toLowerCase() === userAddress.toLowerCase()) {
        // Пропустить полностью отменённые предложения
        if (offer.isCancelled) {
          continue; // Пропустить отменённые предложения
        }

        const offerElement = document.createElement('div');
        offerElement.className = "offer-container bg-white shadow rounded p-4 mb-4"; // Tailwind CSS классы
        offerElement.innerHTML = `
            <p class="text-lg font-semibold">Capacity: ${offer.capacity} MB</p>
            <p class="text-sm text-gray-500">Price per MB per Day: ${web3.utils.fromWei(offer.pricePerMBPerDay, 'ether')} ETH</p>
        `;

        // Проверить статус предложения
        if (offer.isActive) {
          // Если предложение активно и ещё не куплено, добавить кнопку отмены
          const cancelButton = document.createElement('button');
          cancelButton.textContent = "Cancel Offer";
          cancelButton.className = "bg-red-500 text-white px-4 py-2 rounded mt-2 hover:bg-red-600"; // Tailwind CSS классы
          cancelButton.onclick = async () => {
            try {
              await contract.methods.cancelOffer(i).send({ from: userAddress, gas: 6000000 });
              alert("Offer cancelled successfully!");
              loadMyProvidedStorages(); // Обновить список предложений
            } catch (error) {
              console.error("Error cancelling offer:", error);
              alert("Error cancelling offer: " + error.message);
            }
          };
          offerElement.appendChild(cancelButton);
        } else if (!offer.isActive && offer.purchaseTimestamp > 0) {
          // Если предложение было куплено, но не возвращено, добавить кнопку возврата
          const returnButton = document.createElement('button');
          returnButton.textContent = "Return Storage";
          returnButton.className = "bg-blue-500 text-white px-4 py-2 rounded mt-2 hover:bg-blue-600"; // Tailwind CSS классы
          returnButton.onclick = async () => {
            try {
              await contract.methods.returnStorage(i).send({ from: userAddress, gas: 6000000 });
              alert("Storage returned successfully!");
              loadMyProvidedStorages(); // Обновить список предложений
            } catch (error) {
              console.error("Error returning storage:", error);
              alert("Error returning storage: " + error.message);
            }
          };
          offerElement.appendChild(returnButton);
        }

        myStoragesContainer.appendChild(offerElement);
      }
    }
  } catch (error) {
    console.error("Error loading my provided storages:", error);
  }
}



// Добавь вызов функции в loadMainPage
function loadMainPage() {
  const registerProviderButton = document.getElementById('registerProviderButton');
  const offersContainer = document.getElementById('offersContainer');

  if (registerProviderButton) {
      registerProviderButton.addEventListener('click', registerProvider);
  } else {
      console.error("Error: registerProviderButton element not found in the DOM.");
  }

  if (offersContainer) {
      loadAvailableStorageOffers();
  } else {
      console.error("Error: offersContainer element not found in the DOM.");
  }

  loadMyProvidedStorages(); // Загрузить предложения пользователя
}

// Function to load available storage offers
async function loadAvailableStorageOffers() {
  const offersContainer = document.getElementById('offersContainer');
  if (!offersContainer) return;

  offersContainer.innerHTML = ""; // Очистить существующее содержимое
  const accounts = await web3.eth.getAccounts();
  const userAddress = accounts[0];

  try {
    const totalOffers = await contract.methods.getStorageOffersCount().call();
    const purchasedOffersArray = await contract.methods.getUserPurchasedOffers(userAddress).call();
    const purchasedOffers = new Set(purchasedOffersArray.map(Number)); // Преобразовать в Set для быстрого поиска

    for (let i = 0; i < totalOffers; i++) {
      const offer = await contract.methods.storageOffers(i).call();

      // Проверить, что предложение активно, не принадлежит пользователю и не было куплено
      if (offer.isActive && offer.provider.toLowerCase() !== userAddress.toLowerCase() && !purchasedOffers.has(i)) {
        const offerElement = document.createElement('div');
        offerElement.className = "offer-container bg-white shadow-lg rounded-lg p-6 mb-4 border border-gray-200"; // Tailwind CSS классы
        offerElement.innerHTML = `
          <p class="text-gray-800 font-semibold">Provider Address: ${offer.provider}</p>
          <p class="text-gray-600">Capacity: ${offer.capacity} MB</p>
          <p class="text-gray-600">Price per MB per Day: ${web3.utils.fromWei(offer.pricePerMBPerDay, 'ether')} ETH</p>
          <button class="mt-4 bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-600" onclick="buyStorage(${i})">Buy Storage</button>
        `;
        offersContainer.appendChild(offerElement);
      }
    }
  } catch (error) {
    console.error("Error loading storage offers:", error);
  }
}




// Profile page logic
function loadProfilePage() {
  loadPurchasedStorageOffers();
  loadUserFiles();
  loadEarnings(); // Загрузить заработанную сумму

  const withdrawButton = document.getElementById('withdrawEarningsButton');
  if (withdrawButton) {
      withdrawButton.addEventListener('click', withdrawEarnings);
  }
}

// Function to register as a storage provider
async function registerProvider() {
    const capacity = document.getElementById('capacityInput').value;
    const pricePerMBPerDay = web3.utils.toWei(document.getElementById('priceInput').value, 'ether');

    try {
        const accounts = await web3.eth.getAccounts();
        await contract.methods.registerProvider(capacity, pricePerMBPerDay).send({
            from: accounts[0],
            gas: 6000000
        });
        document.getElementById('providerStatus').innerText = "Registered successfully!";
        loadAvailableStorageOffers(); // Reload offers after registering
    } catch (error) {
        document.getElementById('providerStatus').innerText = "Error: " + error.message;
    }
}

// Function to load purchased storage offers
async function loadPurchasedStorageOffers() {
  const purchasedContainer = document.getElementById('purchasedContainer');
  if (!purchasedContainer) return;

  purchasedContainer.innerHTML = ""; // Очистить существующее содержимое
  const accounts = await web3.eth.getAccounts();
  const userAddress = accounts[0];

  try {
    const purchasedOffers = await contract.methods.getUserPurchasedOffers(userAddress).call();

    for (const offerIndex of purchasedOffers) {
      const offer = await contract.methods.storageOffers(offerIndex).call();
      console.log(`Offer ${offerIndex}: isActive = ${offer.isActive}, isCancelled = ${offer.isCancelled}`);

      // Пропустить предложения, которые были отменены или возвращены
      if (!offer.isActive && offer.isCancelled) {
        continue; // Пропустить полностью удалённые предложения
      }

      const offerElement = document.createElement('div');
      offerElement.className = "offer-container bg-white shadow-md rounded-lg p-4 mb-4 border border-gray-300"; // Tailwind CSS классы
      offerElement.innerHTML = `
        <p class="text-gray-800 font-bold">Provider Address: ${offer.provider}</p>
        <p class="text-gray-600">Capacity: ${offer.capacity} MB</p>
        <p class="text-gray-600">Price per MB per Day: ${web3.utils.fromWei(offer.pricePerMBPerDay, 'ether')} ETH</p>
      `;

      // Добавить кнопку "Upload Files" только для активных предложений
      if (!offer.isActive && !offer.isCancelled) {
        const uploadButton = document.createElement('button');
        uploadButton.textContent = "Upload Files";
        uploadButton.className = "mt-3 bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600"; // Tailwind CSS классы для кнопки
        uploadButton.onclick = () => openModal(); // Открытие модального окна для загрузки файлов
        offerElement.appendChild(uploadButton);
      }

      purchasedContainer.appendChild(offerElement);
    }
  } catch (error) {
    console.error("Error loading purchased storage offers:", error);
  }
}



// Function to load user files and display them with download links
async function loadUserFiles() {
  const userFilesContainer = document.getElementById('userFilesContainer');
  if (!userFilesContainer) return;

  userFilesContainer.innerHTML = ""; // Очистка существующих файлов
  const accounts = await web3.eth.getAccounts();

  try {
      const userFiles = await contract.methods.getUserFiles(accounts[0]).call();
      for (const file of userFiles) {
          // Получение размера файла с использованием await
          const fileSize = await getFileSizeFromCID(file.cid);

          // Загрузка зашифрованного файла с IPFS
          const response = await fetch(`http://localhost:8080/ipfs/${file.cid}`);
          const encryptedFileContent = await response.arrayBuffer();

          console.log("IV from file:", file.iv);
          console.log("Encrypted AES Key from file:", file.encryptedAESKey);

          // Расшифровка файла
          const decryptedContent = await decryptFile(
            new Uint8Array(encryptedFileContent),
            base64ToUint8Array(file.encryptedAESKey), // Декодируйте зашифрованный AES-ключ
            base64ToUint8Array(file.iv)               // Декодируйте IV
          );
        
          // Создание элемента для скачивания расшифрованного файла
          const blob = new Blob([decryptedContent], { type: "application/octet-stream" });
          const url = URL.createObjectURL(blob);

          // Создание элемента с информацией о файле
          const fileElement = document.createElement('div');
          fileElement.className = "p-4 bg-white rounded shadow-md mb-4 border border-gray-200"; // Tailwind CSS классы
          fileElement.innerHTML = `
            <div class="text-gray-800 font-semibold">${file.fileName || 'Unknown'}</div>
            <div class="text-sm text-gray-600">Size: ${fileSize} MB</div>
            <a href="${url}" download="${file.fileName}" class="text-blue-500 underline hover:text-blue-700">Download</a>
          `;
          userFilesContainer.appendChild(fileElement);
      }
  } catch (error) {
      console.error("Error loading user files:", error);
  }
}



// Function to handle storage purchase
async function buyStorage(offerIndex) {
  try {
      const accounts = await web3.eth.getAccounts();
      const offer = await contract.methods.storageOffers(offerIndex).call();
      const cost = offer.pricePerMBPerDay * offer.capacity;

      await contract.methods.purchaseStorage(offerIndex).send({
          from: accounts[0],
          value: cost,
          gas: 6000000
      });

      // Обновить доступные предложения после покупки
      loadAvailableStorageOffers();
      window.location.href = "profile.html"; // Перейти на страницу профиля
  } catch (error) {
      alert("Error purchasing storage: " + error.message);
  }
}


// Функция для загрузки заработанной суммы
async function loadEarnings() {
  const earningsAmountElement = document.getElementById('earningsAmount');
  if (!earningsAmountElement) return;

  try {
      const accounts = await web3.eth.getAccounts();
      const userAddress = accounts[0];
      const earningsInWei = await contract.methods.providerBalances(userAddress).call();
      const earningsInEth = web3.utils.fromWei(earningsInWei, 'ether');
      earningsAmountElement.innerText = earningsInEth;
  } catch (error) {
      console.error("Error loading earnings:", error);
      earningsAmountElement.innerText = "Error";
  }
}

// Функция для обработки вывода заработанной суммы
async function withdrawEarnings() {
  try {
      const accounts = await web3.eth.getAccounts();
      await contract.methods.withdrawEarnings().send({ from: accounts[0], gas: 6000000 });
      alert("Earnings withdrawn successfully!");
      loadEarnings(); // Обновить заработанную сумму после вывода
  } catch (error) {
      alert("Error withdrawing earnings: " + error.message);
  }
}

async function getFileSizeFromCID(cid) {
  try {
      // Используем ipfs.files.stat для получения размера файла
      const result = await ipfs.files.stat(`/ipfs/${cid}`);
      // Возвращаем размер файла в мегабайтах (с двумя знаками после запятой)
      return (result.size / (1024 * 1024)).toFixed(2);
  } catch (error) {
      console.error("Ошибка при получении размера файла:", error);
      return "Unknown"; // Возвращаем "Unknown" в случае ошибки
  }
}
// Функция для получения общего объёма приобретённых накопителей
async function getTotalPurchasedStorage() {
  const accounts = await web3.eth.getAccounts();
  const userAddress = accounts[0];

  try {
      const purchasedOffers = await contract.methods.getUserPurchasedOffers(userAddress).call();
      let totalCapacity = 0;

      // Суммируем объём всех приобретённых накопителей
      for (const offerIndex of purchasedOffers) {
          const offer = await contract.methods.storageOffers(offerIndex).call();
          totalCapacity += parseInt(offer.capacity, 10); // Приводим к целому числу
      }

      return totalCapacity; // Возвращаем общий объём в MB
  } catch (error) {
      console.error("Ошибка при получении объёма приобретённых накопителей:", error);
      return 0; // Возвращаем 0 в случае ошибки
  }
}

// Обновлённая функция загрузки файла с шифрованием
async function uploadFile() {
  const fileInput = document.getElementById('fileInput').files[0];
  if (!fileInput) {
      alert("Please select a file to upload.");
      return;
  }

  const fileSizeInHundredths = Math.round((fileInput.size / (1024 * 1024)) * 100);
  const accounts = await web3.eth.getAccounts();
  const userAddress = accounts[0];

  try {
      const purchasedOffers = await contract.methods.getUserPurchasedOffers(userAddress).call();
      let totalCapacity = 0;

      for (const offerIndex of purchasedOffers) {
          const offer = await contract.methods.storageOffers(offerIndex).call();
          totalCapacity += parseInt(offer.capacity);
      }

      const userFiles = await contract.methods.getUserFiles(userAddress).call();
      let usedCapacity = 0;
      for (const file of userFiles) {
          usedCapacity += parseFloat(file.size) / 100;
      }

      const remainingCapacity = totalCapacity - usedCapacity;
      const fileSizeInMB = fileSizeInHundredths / 100;

      if (fileSizeInMB > remainingCapacity) {
          alert(`Insufficient storage. Available: ${remainingCapacity.toFixed(2)} MB, File Size: ${fileSizeInMB.toFixed(2)} MB`);
          return;
      }

      const reader = new FileReader();
      reader.onloadend = async () => {
          const fileContent = new Uint8Array(reader.result);

          try {
              const publicKey = await getPublicKeyForEncryption();
              const aesKey = await generateAESKey();
              const { encryptedContent, iv } = await encryptFileWithAES(fileContent, aesKey);
              const encryptedAESKey = await encryptAESKey(aesKey, publicKey);

              // Преобразование зашифрованного ключа AES и iv в правильный формат
              const ivBase64 = arrayBufferToBase64(iv);
              const encryptedAESKeyBase64 = arrayBufferToBase64(encryptedAESKey);

              // Загрузка зашифрованного содержимого в IPFS
              const added = await ipfs.add(encryptedContent);
              const cid = added.path;
              console.log("File uploaded to IPFS with CID:", cid);


              // Сохранение данных в смарт-контракте
              await contract.methods.uploadFile(
                cid,
                fileInput.name,
                fileSizeInHundredths,
                encryptedAESKeyBase64,
                ivBase64
            ).send({
                from: userAddress,
                gas: 6000000
            });
           
              alert("File uploaded successfully!");
              loadUserFiles();
          } catch (error) {
              console.error("Error uploading file:", error);
              alert("Error uploading file: " + error.message);
          }
      };
      reader.readAsArrayBuffer(fileInput);
  } catch (error) {
      console.error("Error checking storage capacity:", error);
  }
}




// Функция для получения публичного ключа для шифрования
async function getPublicKeyForEncryption() {
  const accounts = await web3.eth.getAccounts();
  const userAddress = accounts[0];
  const publicKeyKey = `${userAddress}_publicKey`;
  const publicKeyString = localStorage.getItem(publicKeyKey);

  if (!publicKeyString) {
      throw new Error("Public key not found for encryption.");
  }

  // Преобразование строки в массив байтов и импорт ключа
  const publicKeyBytes = Uint8Array.from(atob(publicKeyString), c => c.charCodeAt(0));
  return window.crypto.subtle.importKey(
      "spki",
      publicKeyBytes.buffer,
      { name: "RSA-OAEP", hash: { name: "SHA-256" } },
      true,
      ["encrypt"]
  );
}



function openModal() {
  const modal = document.getElementById('uploadModal');
  if (modal) {
    modal.classList.remove('hidden'); // Убираем класс `hidden`
    modal.classList.add('flex');      // Добавляем класс `flex` для отображения
  } else {
    console.error("Upload modal element not found.");
  }
}

function closeModal() {
  const modal = document.getElementById('uploadModal');
  if (modal) {
    modal.classList.add('hidden');    // Добавляем класс `hidden` для скрытия
    modal.classList.remove('flex');   // Убираем класс `flex`
  }
}


async function generateAESKey() {
  return await window.crypto.subtle.generateKey(
      {
          name: "AES-GCM",
          length: 256
      },
      true,
      ["encrypt", "decrypt"]
  );
}
async function encryptFileWithAES(fileContent, aesKey) {
  const iv = window.crypto.getRandomValues(new Uint8Array(12)); // Initialization vector
  const encryptedContent = await window.crypto.subtle.encrypt(
      {
          name: "AES-GCM",
          iv: iv
      },
      aesKey,
      fileContent
  );
  return { encryptedContent: new Uint8Array(encryptedContent), iv: iv };
}
async function encryptAESKey(aesKey, publicKey) {
  const exportedAESKey = await window.crypto.subtle.exportKey("raw", aesKey);
  return await window.crypto.subtle.encrypt(
      {
          name: "RSA-OAEP"
      },
      publicKey,
      exportedAESKey
  );
}

function base64ToUint8Array(base64) {
  if (!base64 || typeof base64 !== 'string') {
      console.error("Invalid Base64 input:", base64);
      throw new Error("Invalid Base64 string provided.");
  }

  try {
      const binaryString = atob(base64);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
      }
      return bytes;
  } catch (error) {
      console.error("Error decoding Base64:", error);
      throw new Error("Invalid Base64 string provided.");
  }
}

function arrayBufferToBase64(buffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}


async function decryptFile(encryptedContent, encryptedAESKey, iv) {
  const accounts = await web3.eth.getAccounts();
  const userAddress = accounts[0];
  const privateKeyKey = `${userAddress}_privateKey`;
  const privateKeyString = localStorage.getItem(privateKeyKey);

  if (!privateKeyString) {
      throw new Error("Private key not found for decryption.");
  }

  // Преобразование приватного ключа из строки в ключевой объект
  const privateKeyBytes = base64ToUint8Array(privateKeyString).buffer;
  const privateKey = await window.crypto.subtle.importKey(
      "pkcs8",
      privateKeyBytes,
      { name: "RSA-OAEP", hash: { name: "SHA-256" } },
      true,
      ["decrypt"]
  );

  // Расшифровка ключа AES
  const aesKey = await window.crypto.subtle.decrypt(
      { name: "RSA-OAEP" },
      privateKey,
      encryptedAESKey.buffer
  );

  // Преобразование расшифрованного ключа AES в CryptoKey
  const aesCryptoKey = await window.crypto.subtle.importKey(
      "raw",
      aesKey,
      { name: "AES-GCM" },
      true,
      ["decrypt"]
  );

  // Расшифровка содержимого файла с использованием AES
  const decryptedContent = await window.crypto.subtle.decrypt(
      { name: "AES-GCM", iv: iv.buffer },
      aesCryptoKey,
      encryptedContent
  );

  return new Uint8Array(decryptedContent);
}




