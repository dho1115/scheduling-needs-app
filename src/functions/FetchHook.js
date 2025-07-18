export const fetchDataPromise = async url => {
   try {
      const rawData = await fetch(url);
      if (!rawData.ok) throw new Error(`Error fetching ${url}. Status Code: ${rawData.status}.`)
      const jsonData = await rawData.json();
      return jsonData;
   } catch (error) {
      console.error({ from: 'useFetch inside FetchHook.js', status: error.status, message: error.message, errCode: error.code });

      return { message: 'Error Fetching data!!!', error, errorCode: error.code, errorMessage: error.message };
   }
}
