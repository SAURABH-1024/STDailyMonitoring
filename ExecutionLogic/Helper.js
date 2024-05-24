


const myHeaders = new Headers();
myHeaders.append("Authorization", "Basic c2FhbTpHcm90b3BvQDM1NyE=");
//******* Helper function used to fetch Data from the API */
const getData = async (hostname, triggeredAt) => {
    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
    };
    try {
        const url = constructUrl(hostname, triggeredAt)
        const response = await fetch(url, requestOptions);
        if (!response.ok) {
            console.log(response.status);
            throw new Error('Failed to fetch data');
        }
        return await response.json()
    } catch (err) {
        console.error(err)
        throw err
    }
}


// Function to fetch array of objects from API
const fetchData = async (hostname, triggeredAt, transactionId) => {
    const response = await getData(hostname, triggeredAt, transactionId)
    return response
}

//*** Function used to construct a dynamic URL for API execution as the date needs to change everyday */
const constructUrl = (hostname, triggeredAt) => {
    // return `https://${hostname}/integration/transactions?filter={"where": {"triggeredAt": {"gt": "${triggeredAt}"}}}`;
    return `https://${hostname}/integration/transactions?filter={"where": {"triggeredAt": ${JSON.stringify(triggeredAt)}}}`;
}


module.exports = { getData, constructUrl, getData, fetchData }