const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const ipfsHttpClient = require('ipfs-http-client');
const Web3 = require('web3');
const StoragePlatform = require('./build/contracts/StoragePlatform.json');
const fileUpload = require('express-fileupload');

// Initialize IPFS client
const ipfs = ipfsHttpClient.create({ host: 'localhost', port: '5001', protocol: 'http' });

// Initialize Web3 and connect to Ganache
const web3 = new Web3('http://127.0.0.1:7545');

// Check if the contract is deployed on the correct network
const networkId = Object.keys(StoragePlatform.networks)[0];
if (!networkId || !StoragePlatform.networks[networkId]) {
    console.error('Contract not deployed on the current network');
    process.exit(1);
}
const contract = new web3.eth.Contract(
    StoragePlatform.abi,
    StoragePlatform.networks[networkId].address
);

// Создание сервера Express
const app = express();

// Настройка промежуточного ПО
app.use(bodyParser.json());
app.use(cors());

// Настройка загрузки файлов
app.use(fileUpload({
    limits: { fileSize: 10 * 1024 * 1024 }, // Ограничение размера файла до 10 МБ
}));
app.use(express.static('public'));

// Маршрут для загрузки файлов на IPFS
app.post('/upload', async (req, res) => {
    try {
        if (!req.files || !req.files.file) {
            return res.status(400).json({ error: 'Файл не предоставлен' });
        }

        const file = req.files.file;
        console.log(`Загружен файл: ${file.name} (${file.size} байт)`);

        // Преобразование содержимого файла в Buffer и загрузка в IPFS
        const fileContent = Buffer.from(file.data);
        const added = await ipfs.add(fileContent);
        const cid = added.path;
        console.log(`Файл добавлен в IPFS с CID: ${cid}`);

        // Сохранение CID в смарт-контракте
        const accounts = await web3.eth.getAccounts();
        const sizeInMB = Math.ceil(file.size / (1024 * 1024)); // Размер в МБ

        await contract.methods.uploadFile(cid, sizeInMB).send({
            from: accounts[0],
            gas: 6000000
        });

        res.json({ cid });
    } catch (error) {
        console.error('Ошибка при загрузке файла:', error.message);
        res.status(500).json({ error: 'Ошибка при загрузке файла', details: error.message });
    }
});

// Маршрут для регистрации провайдера
app.post('/registerProvider', async (req, res) => {
    const { capacity, pricePerMBPerDay, account } = req.body;
    try {
        await contract.methods.registerProvider(capacity, pricePerMBPerDay).send({
            from: account,
            gas: 6000000
        });
        res.json({ message: 'Провайдер успешно зарегистрирован!' });
    } catch (error) {
        console.error('Ошибка при регистрации провайдера:', error.message);
        res.status(500).json({ error: 'Ошибка при регистрации провайдера', details: error.message });
    }
});

// Маршрут для вывода заработка провайдера
app.post('/withdrawEarnings', async (req, res) => {
    const { account } = req.body;
    try {
        await contract.methods.withdrawEarnings().send({
            from: account,
            gas: 6000000
        });
        res.json({ message: 'Заработок успешно выведен!' });
    } catch (error) {
        console.error('Ошибка при выводе заработка:', error.message);
        res.status(500).json({ error: 'Ошибка при выводе заработка', details: error.message });
    }
});

// Запуск сервера
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
