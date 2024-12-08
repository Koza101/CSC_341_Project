import oracledb from 'oracledb';

// Function to connect to the database and run a test query
export async function connectToDatabase() {
    try {
        // Establish the connection
        const connection = await oracledb.getConnection({
            user: 'MKOZA002',
            password: 'mEbtok-1hibsi-zuhkab',
            connectString: `(description= (retry_count=20)(retry_delay=3)(address=(protocol=tcps)(port=1522)(host=adb.us-ashburn-1.oraclecloud.com))(connect_data=(service_name=g5450923afc2a36_d14ewdn3cnxtt2jv_tp.adb.oraclecloud.com))(security=(ssl_server_dn_match=yes)))`
        });

        console.log('Database connection successful!');

        // Run a simple test query
        const result = await connection.execute(`SELECT 1 FROM DUAL`);
        console.log('Test Query Result:', result.rows);

        // Close the connection
        await connection.close();
        return 'Test query executed successfully!';
    } catch (err) {
        console.error('Error during test query:', err);
        return `Error during test query: ${err.message}`;
    }
}

// Self-invoking function to test
(async () => {
    const result = await connectToDatabase();
    console.log('Test Result:', result);
})();