browser.runtime.onMessage.addListener(async (msg) => {
  if (msg.type === "FETCH_API") {
    try {
      const response = await fetch(msg.url);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("background fetch failed", error);
      throw error;
    }
  }
});
