import dotenv from 'dotenv';
dotenv.config();

import validateEnvVars from './src/Configs/ValidateEnvVar.js';
import DBconnect from './src/Configs/DBconnect.js';
import app from './src/Api.js';

const PORT = validateEnvVars.PORT 

app.get('/', (req, res) => {
    res.send('Welcome to the AnnStream API job platform');
});

app.listen(PORT, async () => {
    await DBconnect();
    console.log(`Server is running on port ${PORT}`);
});