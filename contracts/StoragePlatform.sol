// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract StoragePlatform {
    struct StorageOffer {
        address provider;
        uint capacity; // в MB
        uint pricePerMBPerDay; // в Wei
        bool isActive;
        bool isCancelled;
        uint purchaseTimestamp; // Время покупки предложения
        address buyer; // Адрес покупателя (для возврата средств)
    }

    struct File {
        string cid;
        string fileName;
        uint size; // Размер в сотых долях (например, 762 для 7.62 MB)
        address owner;
        string encryptedAESKey;
        string iv;
    }


    StorageOffer[] public storageOffers;
    File[] public files;
    mapping(address => uint) public providerBalances; // Баланс каждого провайдера
    mapping(address => uint[]) public userPurchasedOffers; // Купленные предложения для каждого пользователя

    // Функция для регистрации предложения провайдера
    function registerProvider(uint capacity, uint pricePerMBPerDay) public {
        storageOffers.push(StorageOffer(msg.sender, capacity, pricePerMBPerDay, true, false, 0, address(0)));
    }

    // Функция для покупки хранилища
    function purchaseStorage(uint offerIndex) public payable {
        StorageOffer storage offer = storageOffers[offerIndex];
        require(offer.isActive, "Offer is not active");
        require(msg.sender != offer.provider, "Provider cannot buy their own offer");

        uint cost = offer.pricePerMBPerDay * offer.capacity;
        require(msg.value >= cost, "Insufficient funds");

        // Сохраняем данные о покупке
        providerBalances[offer.provider] += msg.value;
        userPurchasedOffers[msg.sender].push(offerIndex);
        offer.isActive = false;
        offer.purchaseTimestamp = block.timestamp;
        offer.buyer = msg.sender; // Сохраняем адрес покупателя
    }

    // Function to cancel an offer
    function cancelOffer(uint offerIndex) public {
        StorageOffer storage offer = storageOffers[offerIndex];
        require(msg.sender == offer.provider, "Only the provider can cancel the offer");
        require(offer.isActive, "Offer is already inactive");

        // Mark the offer as inactive
        offer.isActive = false;
        offer.isCancelled = true;
    }



    // Функция для возврата средств при возврате хранилища в течение одного дня
    function returnStorage(uint offerIndex) public {
        StorageOffer storage offer = storageOffers[offerIndex];
        require(msg.sender == offer.provider, "Only the provider can initiate a return");
        require(!offer.isActive, "Offer is still active");
        require(offer.buyer != address(0), "No buyer to return funds to");

        // Проверка времени на возврат (24 часа)
        require(block.timestamp <= offer.purchaseTimestamp + 1 days, "Return allowed only within one day");

        uint cost = offer.pricePerMBPerDay * offer.capacity;
        require(providerBalances[msg.sender] >= cost, "Insufficient balance for return");

        // Возврат средств покупателю
        address payable buyer = payable(offer.buyer);
        providerBalances[msg.sender] -= cost;
        buyer.transfer(cost);

        // Удаление информации о покупке
        offer.isCancelled = true;
        offer.isActive = false; // Делаем предложение неактивным (или полностью удаляем)
        offer.buyer = address(0);
    }

    // Функция для загрузки файла и сохранения данных
    function uploadFile(
            string memory cid,
            string memory fileName,
            uint size,
            string memory encryptedAESKey,
            string memory iv
        ) public {
            files.push(File(cid, fileName, size, msg.sender, encryptedAESKey, iv));
        }


    // Функция для получения всех файлов пользователя
    function getUserFiles(address user) public view returns (File[] memory) {
        uint fileCount = 0;
        for (uint i = 0; i < files.length; i++) {
            if (files[i].owner == user) {
                fileCount++;
            }
        }

        File[] memory userFiles = new File[](fileCount);
        uint index = 0;
        for (uint i = 0; i < files.length; i++) {
            if (files[i].owner == user) {
                userFiles[index] = files[i];
                index++;
            }
        }
        return userFiles;
    }

    // Функция для получения общего количества предложений
    function getStorageOffersCount() public view returns (uint) {
        return storageOffers.length;
    }

    // Функция для получения всех купленных предложений пользователя
    function getUserPurchasedOffers(address user) public view returns (uint[] memory) {
        return userPurchasedOffers[user];
    }

    // Функция для вывода заработанных средств провайдером
    function withdrawEarnings() public {
        uint balance = providerBalances[msg.sender];
        require(balance > 0, "No funds to withdraw");

        providerBalances[msg.sender] = 0;
        payable(msg.sender).transfer(balance);
    }
}
