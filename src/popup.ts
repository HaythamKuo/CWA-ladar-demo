async function fetchLadar() {
  try {
    const res = await fetch("http://localhost:3005/ladar");
    if (!res.ok) {
      throw new Error(`無法請求資料: ${res.status}`);
    }
    const data = await res.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
  }
}

fetchLadar().then((data) => {
  if (data) {
    // 在 popup 或 UI 中顯示資料
    const ladar = document.getElementById("ladar");
    ladar!.textContent = JSON.stringify(data, null, 2); // 美化縮排
  }
});
