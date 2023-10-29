import 'dotenv/config';
import express from 'express';
import * as dataEncryptionModel from './data-encryption-model.mjs';
import path from 'path';

// HTTPS
import https from 'https';
import { readFileSync } from 'fs';

// Obtain __dirname in an ES module
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import * as dataDecryptionModel from "./data-decryption-model.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const privateKeyPath = path.resolve(__dirname, 'key.pem');
const certificatePath = path.resolve(__dirname, 'cert.pem');

let privateKey;
let certificate;

try {
    privateKey = readFileSync(privateKeyPath, 'utf8');
    certificate = readFileSync(certificatePath, 'utf8');
} catch (error) {
    console.error('Error reading SSL certificate files:', error);
    process.exit(1);
}

const passphrase = process.env.SSL_PASSPHRASE;
const creds = { key: privateKey, cert: certificate, passphrase: passphrase };

// Configure express server
const PORT = process.env.PORT || 3000; // Port 3000 because I do not know which port we will be using yet
const app = express();

app.use(express.json());
app.use(express.static('public'));

const httpsServer = https.createServer(creds, app);

// POST /ciphertext
app.post('/ciphertext', (req, res) => {
    const { plaintext, userHash } = req.body;

    try {
        dataEncryptionModel.getEncryptedData(plaintext, userHash)
            .then((result) => {
                res.status(201).json(result);
            })
            .catch((error) => {
                res.status(400).json({ error: error.message });
            });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});



app.post('/decrypttext', async (req, res) => {
    const { encryptedText, keytext, ivText } = req.body;

    try {
        // Convert the plaintext IV to hexadecimal
        const ivHex = Buffer.from(ivText, 'hex').toString('hex');

        // Perform the decryption with the hexadecimal IV
        const result = await dataDecryptionModel.getDecryptedData(encryptedText, keytext, ivHex);
        res.status(201).json(result);
    } catch (error) {
        console.error('Decryption failed:', error);
        res.status(400).json({ error: error.message });
    }
});



app.get('/', (req, res) => {
    const htmlFilePath = 'public/index.html';
    const normalizedPath = path.normalize(htmlFilePath);
    res.sendFile(normalizedPath);
});

app.get('/decrypt', (req, res) => {
    const htmlFileName = 'decrypt.html';
    res.sendFile(htmlFileName, { root: 'public' });
});


httpsServer.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});
