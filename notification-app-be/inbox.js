const API_URL = "http://4.224.186.213/evaluation-service/notifications";

const TYPE_WEIGHTS = {
    "Placement": 3,
    "Result": 2,
    "Event": 1
};

async function fetchPriorityNotifications() {
    try {
        console.log("Fetching notifications from API...");
        
        const response = await fetch(API_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'accessCode': 'BgWZSW'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const notifications = data.notifications || [];

        const sortedNotifications = notifications.sort((a, b) => {
            const weightA = TYPE_WEIGHTS[a.Type] || 0;
            const weightB = TYPE_WEIGHTS[b.Type] || 0;

            if (weightB !== weightA) {
                return weightB - weightA;
            }

            return new Date(b.Timestamp) - new Date(a.Timestamp);
        });

        const top10 = sortedNotifications.slice(0, 10);

        console.log("\n=== STAGE 1: TOP 10 PRIORITY NOTIFICATIONS ===");
        console.table(top10.map((n, index) => ({
            Rank: index + 1,
            ID: n.ID,
            Type: n.Type,
            Message: n.Message,
            Timestamp: n.Timestamp
        })));

    } catch (error) {
        console.error("Error retrieving priority inbox items:", error);
    }
}

fetchPriorityNotifications();