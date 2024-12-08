// import { connectToDatabase } from 'file:///C:/Users/Mason/Documents/GitHub/CSC_341_Project/src/Database_Files/test.mjs';

// (async () => {
//     await connectToDatabase();
// })();

import { insertDevice } from 'file:///C:/Users/Mason/Documents/GitHub/CSC_341_Project/src/Database_Files/oracle_db.mjs';
import { fetchDevices } from 'file:///C:/Users/Mason/Documents/GitHub/CSC_341_Project/src/Database_Files/oracle_db.mjs';

(async () => {
    try {
        await insertDevice({
            CPU_Brand: 'Intel',
            CPU_Cores: '24',
            Sys_Manufacturer: 'Lenovo',
            Sys_Model: 'Legion Pro 7i',
            Sys_OS: 'Windows',
            Memory_Type: 'DDR5'
        });
    } catch (err) {
        console.error('Test Insert Error:', err);
    }
})();

(async () => {
    try {
        const devices = await fetchDevices();
        console.log('Devices:', devices);
    } catch (err) {
        console.error('Test Fetch Error:', err);
    }
})();