const fetch = require('node-fetch');

exports.handler = async function (event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  // Parse form data
  let formData;
  try {
    formData = JSON.parse(event.body);
  } catch (error) {
    return { statusCode: 400, body: 'Invalid input' };
  }

  // ORDS endpoint and credentials
  const ordsUrl = 'https://g5450923afc2a36-d14ewdn3cnxtt2jv.adb.us-ashburn-1.oraclecloudapps.com/ords/koza/_sdw/?nav=worksheet';
  const ordsUser = 'FORM_USER';
  const ordsPassword = process.env.ORDS_PASSWORD;

  // Make POST request to ORDS
  try {
    const response = await fetch(ordsUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(`${ordsUser}:${ordsPassword}`).toString('base64'),
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ORDS Error:', errorText);
      throw new Error('Failed to submit form data');
    }

    return {
      statusCode: 200,
      body: 'Form submitted successfully',
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: 'Internal Server Error',
    };
  }
};