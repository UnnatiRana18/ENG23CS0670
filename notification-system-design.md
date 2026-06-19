# Notification System Design

To prevent users from losing track of critical items, we rank live unread notifications using a  sorting key composed of two fields:
1. Weight (Category-Based Priority): Defined strictly as `Placement` (Highest) > `Result` > `Event` (Lowest).
2. Recency (Temporal Priority):When two notifications carry the exact same priority category, the newest timestamp takes precedence.

The sorting logic utilizes a custom comparator function that instantly checks category differences before evaluating standard ISO timestamps.

The prompt mentions that new notifications will keep streaming in. Sorting an entire array on every arrival takes O(N \log N) time, which becomes inefficient over time.

To maintain the top 10 elements dynamically as data scales:
We can use a Min-Heap bounded to a size of 10, or a Mac heap.



File Structure
You will be modifying files inside the notification-app-fe directory.

src/services/logger.js (Helper to handle required logging middleware formats)

src/components/NotificationDashboard.jsx (The UI dashboard with sorting, filtering, and pagination)

src/App.jsx (The container mounting everything)

🔧 1. Logging Middleware Cl
