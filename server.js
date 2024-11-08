const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const Web3 = require('web3');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const StoragePlatform = require('./build/contracts/StoragePlatform.json');

// Инициализация Web3 и подключение к Ganache
const web3 = new Web3('http://127.0.0.1:7545');

// Проверка, развернут ли контракт в текущей сети
const networkId = Object.keys(StoragePlatform.networks)[0];
if (!networkId || !StoragePlatform.networks[networkId]) {
    console.error('Контракт не развернут в текущей сети');
    process.exit(1);
}
const contract = new web3.eth.Contract(
    StoragePlatform.abi,
    StoragePlatform.networks[networkId].address
);
async function splitAndUploadFile(fileContent, chunkSize, hash) {
    const numChunks = Math.ceil(fileContent.length / chunkSize);
    for (let i = 0; i < numChunks; i++) {
        const chunk = fileContent.slice(i * chunkSize, (i + 1) * chunkSize);
        const partName = `${hash}_part${i + 1}`;
        
        // Сохранение каждого фрагмента
        const uploadPath = path.join(__dirname, 'uploads', partName);
        fs.writeFileSync(uploadPath, chunk);
    }
}

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(fileUpload());
app.use(express.static('public'));

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}


// Маршрут для загрузки файлов
app.post('/upload', async (req, res) => {
    try {
        // Проверка наличия файла и ключей
        if (!req.files || !req.files.file || !req.body.encryptedAESKeyBase64 || !req.body.ivBase64) {
            console.error("Отсутствует файл или один из ключей (AES/IV) в запросе.");
            return res.status(400).json({ error: 'Missing file or encryption keys in request.' });
        }

        // Получение данных файла
        const file = req.files.file;
        const encryptedAESKey = req.body.encryptedAESKeyBase64;
        const iv = req.body.ivBase64;
        
        // Генерация хэша для файла
        const hash = crypto.createHash('sha256').update(file.data).digest('hex');
        await splitAndUploadFile(file.data, chunkSize, hash);
        // Размер каждого фрагмента
        const partSize = Math.ceil(file.data.length / 4);

        for (let i = 0; i < 4; i++) {
            // Вычисляем границы каждого фрагмента
            const start = i * partSize;
            const end = Math.min(start + partSize, file.data.length);
            const filePart = file.data.slice(start, end);

            // Сохранение каждого фрагмента с уникальным именем
            const partPath = path.join(__dirname, 'uploads', `${hash}_part${i + 1}`);
            fs.writeFileSync(partPath, Buffer.from(filePart));

            console.log(`Фрагмент ${i + 1} файла сохранен как ${hash}_part${i + 1}`);
        }

        // Получение аккаунтов и размера файла
        const accounts = await web3.eth.getAccounts();
        const sizeInMB = Math.ceil(file.size / (1024 * 1024));

        // Сохранение информации о файле в смарт-контракте
        await contract.methods.uploadFile(
            hash,
            file.name,
            sizeInMB,
            encryptedAESKey,
            iv
        ).send({
            from: accounts[0],
            gas: 6000000
        });

        res.json({ message: 'File uploaded and fragmented successfully', hash });
    } catch (error) {
        console.error("Ошибка на сервере:", error);
        res.status(500).json({ error: 'Server error', details: error.message });
    }
});




app.get('/download/:hash', async (req, res) => {
    try {
        const fileHash = req.params.hash.replace(/_part\d+$/, ''); // Удаление возможного добавленного суффикса
        console.log(`Запрос на скачивание для хэша: ${fileHash}`);

        const partPaths = [];
        for (let i = 1; i <= 4; i++) {
            const partPath = path.join(__dirname, 'uploads', `${fileHash}_part${i}`);
            console.log(`Проверка существования файла по пути: ${partPath}`);
            if (!fs.existsSync(partPath)) {
                console.error(`Фрагмент ${i} не найден по пути ${partPath}`);
                return res.status(404).json({ error: `Фрагмент ${i} не найден` });
            }
            partPaths.push(partPath);
        }

        const encryptedContent = Buffer.concat(partPaths.map(partPath => fs.readFileSync(partPath)));
        console.log("Размер объединенного зашифрованного файла:", encryptedContent.length);

        const fileData = await contract.methods.getFileData(fileHash).call();
        const encryptedAESKeyBase64 = fileData.encryptedAESKey;
        const ivBase64 = fileData.iv;

        res.json({
            fileName: fileData.fileName,
            encryptedContent: encryptedContent.toString('base64'),
            encryptedAESKeyBase64,
            ivBase64
        });
    } catch (error) {
        console.error('Ошибка при скачивании файла:', error.message);
        res.status(500).json({ error: 'Ошибка при скачивании файла', details: error.message });
    }
});






// Запуск сервера
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
