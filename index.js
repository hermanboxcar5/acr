const axios = require('axios');
const express = require('express')
const username = process.env['username']
const password = process.env['password']
const authenticate = async () => {
    try {
        const response = await axios.post(
            "https://dev-nakama.winterpixel.io/v2/account/authenticate/email?create=false",
            {
                email: username,
                password: password,
                vars: {
                    client_version: "99999"
                }
            },
            {
                headers: {
                    authorization: "Basic OTAyaXViZGFmOWgyZTlocXBldzBmYjlhZWIzOTo="
                }
            }
        );

        const token = response.data.token;
        return token;
    } catch (error) {
        console.error("Authentication failed:", error.message);
        throw error;
    }
};

const collectTimedBonus = async (token) => {
    try {
        const payload = '"{}"';
        const response = await axios.post(
            "https://dev-nakama.winterpixel.io/v2/rpc/collect_timed_bonus",
            payload,
            {
                headers: {
                    authorization: `Bearer ${token}`
                }
            }
        );

        console.log(response.data);
    } catch (error) {
        console.error("Failed to collect timed bonus:", error.message);
    }
};

const autoClaim = async () => {
    while (true) {
        try {
            const token = await authenticate();
            await collectTimedBonus(token);
            await new Promise(resolve => setTimeout(resolve, 1801000)); // Sleep for 1801 seconds
        } catch (error) {
            console.error("Auto claim failed:", error.message);
        }
    }
};
const app = express()
app.get('/', (req, res) => {
  res.send('ACR activated')
})
app.listen(3000, () => {console.log('server up')})
autoClaim();
