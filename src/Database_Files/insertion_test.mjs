import { insertForm } from 'file:///C:/Users/Mason/Documents/GitHub/CSC_341_Project/src/Database_Files/oracle_db.mjs';


await insertForm({
    firstName: 'John',
    lastName: 'Doe',
    phoneNumber: '1234567890',
    city: 'Nowhere',
    state: 'NY',
    zipCode: '12345'
});