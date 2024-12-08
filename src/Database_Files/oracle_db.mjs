import oracledb from 'oracledb';

// Function to connect to the database
export async function connectToDatabase() {
    try {
        const connection = await oracledb.getConnection({
            user: 'MKOZA002',
            password: 'mEbtok-1hibsi-zuhkab',
            connectString: `(description= (retry_count=20)(retry_delay=3)(address=(protocol=tcps)(port=1522)(host=adb.us-ashburn-1.oraclecloud.com))(connect_data=(service_name=g5450923afc2a36_d14ewdn3cnxtt2jv_tp.adb.oraclecloud.com))(security=(ssl_server_dn_match=yes)))`
        });
        return connection; // Return the connection for further operations
    } catch (err) {
        console.error('Database connection error:', err);
        throw err; // Rethrow the error for proper handling
    }
}

// Function to insert form data into the database
export async function insertForm(data) {
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
                first_name, last_name, phone_number, city, "state", 
                zipcode
            ) 
            VALUES (
                :firstName, :lastName, :phoneNumber, :city, :state, 
                :zipCode
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
        await connection.close(); // Ensure the connection is closed
    }
}

export async function insertDevice(data) {
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
            ) 
            VALUES (
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
        await connection.close(); // Ensure the connection is closed
    }
}

// Function to fetch all devices from the database
export async function fetchDevices() {
    const connection = await connectToDatabase();

    try {
        const query = `SELECT * FROM device`;
        const result = await connection.execute(query);

        console.log('Devices fetched successfully:', result.rows);
        return result.rows; // Return the rows for further use
    } catch (err) {
        console.error('Error fetching devices:', err);
        throw err;
    } finally {
        await connection.close(); // Ensure the connection is closed
    }
}