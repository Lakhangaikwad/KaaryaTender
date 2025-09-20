const { ipcMain } = require("electron");

ipcMain.handle("get-villages-by-takula", async (event, payload) => {
  try {
    const res = await fetch(
      `https://api.data.gov.in/resource/c967fe8f-69c4-42df-8afc-8a2c98057437?api-key=579b464db66ec23bdd0000014aa0cced3e9a4a4154bdf5e449c04cbd&format=json&filters[stateCode]=27&filters[subdistrictCode]=${payload?.subdistrictcode}&limit=10000&offset=0`
    );

    const data = await res.json();
    return (data.records || []).map((v) => ({
      label: v.villageNameLocal,
      value: v.villageCensus2011Code,
    }));
  } catch (err) {
    console.error("Error fetching villages:", err);
    return [];
  }
});
