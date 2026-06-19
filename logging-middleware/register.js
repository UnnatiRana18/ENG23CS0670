const url = 'http://4.224.186.213/evaluation-service/register';

async function makeRequest() {
    try {
        const response = await fetch(url, {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                 "email": "ranaunnati223@gmail.com",
                 "name": "unnati rana",
                 "mobileNo":"7260009277",
                 "githubUsername":"UnnatiRana18",
                 "rollNo":"ENG23CS0670",
                 "accessCode":"BgWZSW"
                
            }),
        });

        const data = await response.text();
        console.log('Status:', response.status);
        console.log('Response:', data);
    }
     catch (error) {
        console.error('Error making request:', error);
    }
}

makeRequest();