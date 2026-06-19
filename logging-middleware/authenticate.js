const url = 'http://4.224.186.213/evaluation-service/auth';

// Adjust method to 'GET' if the endpoint doesn't accept POST
async function makeRequest() {
    try {
        const response = await fetch(url, {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "email":"ranaunnati223@gmail.com",
                "name":"unnati rana",
                "rollNo":"eng23cs0670",
                "accessCode":"BgWZSW",
                "clientID":"d6ec2875-3f0f-4236-86fc-7ef96ab5fd25",
                "clientSecret":"APeXgYrnrpNsGYtz"
                 })
        });

        const data = await response.text(); // or .json() if it returns JSON
        console.log('Status:', response.status);
        console.log('Response:', data);
    } catch (error) {
        console.error('Error making request:', error);
    }
}

makeRequest();