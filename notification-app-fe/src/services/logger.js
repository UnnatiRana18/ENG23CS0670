export const logEvent = async (level, message) => {
  try {
    await fetch("http://4.224.186.213/evaluation-service/logs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "accessCode": "BgWZSW"
      },
      body: JSON.stringify({
        stack: "frontend",
        level: level,
        message: message,
        timestamp: new Date().toISOString()
      })
    });
  } catch (error) {
    console.error("Failed sending log entry", error);
  }
};