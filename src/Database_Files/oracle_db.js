const oracledb = require('oracledb');
const si = require('systeminformation');

async function connectToDatabase() {
    try {
        const connection = await oracledb.getConnection({
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            connectString: process.env.DB_CONNECTSTRING
        });
        console.log('Database connection established');
        return connection;
    } catch (err) {
        console.error('Database connection error:', err);
        throw err;
    }
}

async function insertForm(data) {
    const {
        firstName,
        lastName,
        phoneNumber,
        city,
        state,
        zipCode
    } = data;

    const connection = await connectToDatabase();

    try {
        const query = `
            INSERT INTO users (
                first_name, last_name, phone_number, city, "state", zipcode
            ) VALUES (
                :firstName, :lastName, :phoneNumber, :city, :state, :zipCode
            )
        `;

        await connection.execute(query, {
            firstName,
            lastName,
            phoneNumber,
            city,
            state,
            zipCode,
        }, { autoCommit: true });

        console.log('Form data inserted successfully!');
    } catch (err) {
        console.error('Error inserting form data:', err);
        throw err;
    } finally {
        await connection.close();
    }
}

async function insertDevice(data) {
    const {
        CPU_Brand,
        CPU_Cores,
        Sys_Manufacturer,
        Sys_Model,
        Sys_OS,
        Memory_Type
    } = data;

    const connection = await connectToDatabase();

    try {
        const query = `
            INSERT INTO device (
                CPU_Brand, CPU_Cores, Sys_Manufacturer, Sys_Model, Sys_OS, Memory_Type
            ) VALUES (
                :CPU_Brand, :CPU_Cores, :Sys_Manufacturer, :Sys_Model, :Sys_OS, :Memory_Type
            )
        `;

        await connection.execute(query, {
            CPU_Brand,
            CPU_Cores,
            Sys_Manufacturer,
            Sys_Model,
            Sys_OS,
            Memory_Type
        }, { autoCommit: true });

        console.log('Device data inserted successfully!');
    } catch (err) {
        console.error('Error inserting device data:', err);
        throw err;
    } finally {
        await connection.close();
    }
}

async function fetchDevices() {
    const connection = await connectToDatabase();

    try {
        const query = `SELECT * FROM device`;
        const result = await connection.execute(query);

        console.log('Devices fetched successfully:', result.rows);
        return result.rows;
    } catch (err) {
        console.error('Error fetching devices:', err);
        throw err;
    } finally {
        await connection.close();
    }
}

async function collectAndInsertDeviceInfo() {
    try {
        const cpuInfo = await si.cpu();
        const systemInfo = await si.system();
        const osInfo = await si.osInfo();
        const memoryInfo = await si.mem();

        const data = {
            CPU_Brand: cpuInfo.manufacturer || 'Unknown',
            CPU_Cores: cpuInfo.cores.toString(),
            Sys_Manufacturer: systemInfo.manufacturer || 'Unknown',
            Sys_Model: systemInfo.model || 'Unknown',
            Sys_OS: osInfo.distro || 'Unknown',
            Memory_Type: memoryInfo.total ? `${(memoryInfo.total / 1073741824).toFixed(2)} GB` : 'Unknown'
        };

        const connection = await connectToDatabase();
        const query = `
            INSERT INTO device (
                CPU_Brand, CPU_Cores, Sys_Manufacturer, Sys_Model, Sys_OS, Memory_Type
            ) VALUES (
                :CPU_Brand, :CPU_Cores, :Sys_Manufacturer, :Sys_Model, :Sys_OS, :Memory_Type
            )
        `;

        await connection.execute(query, data, { autoCommit: true });

        console.log('System information inserted successfully!');
    } catch (err) {
        console.error('Error collecting or inserting system information:', err);
        throw err;
    }
}

module.exports = {
    connectToDatabase,
    insertForm,
    insertDevice,
    fetchDevices,
    collectAndInsertDeviceInfo
};