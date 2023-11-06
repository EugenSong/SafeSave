import 'dotenv/config';
import express from 'express';
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
import * as db from "./db-connector.cjs";

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
const PORT = process.env.PORT || 3001; // Port 3000 because I do not know which port we will be using yet. Port 3000 is
// the port for encryption
const app = express();

app.use(express.json());
app.use(express.static('public'));

import('ejs');

app.set('view engine', 'ejs');

const httpsServer = https.createServer(creds, app);


app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.post('/decrypttext', async (req, res) => {
    const { userNoteID, userHash } = req.body;

    try {

        // Perform the decryption with the hexadecimal IV
        const result = await dataDecryptionModel.getDecryptedData(userNoteID, userHash);
        res.status(201).json(result);
    } catch (error) {
        console.error('Decryption failed:', error);
        res.status(400).json({ error: error.message });
    }
});



app.get('/', async (req, res) => {
    const queryDatabase = `SELECT * FROM UserNotes`;

    await db.pool.query(queryDatabase, function(error, notes, fields) {
        if (error) {
            console.log(error);
            res.send('An error occurred while fetching data from the database.');
        } else {
            res.render('table', { notes });
        }
    });
});

// app.listen(PORT, () => {
//     console.log('Server is running on port 3001');
// });


httpsServer.listen(PORT, () => {
    console.log(`Decryption server listening on port ${PORT}...`);
});
