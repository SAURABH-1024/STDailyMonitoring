


const myHeaders = new Headers();
myHeaders.append("Authorization", "Basic c2FhbTpHcm90b3BvQDM1NyE=");

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


const constructUrl = (hostname, triggeredAt) => {
    return `https://${hostname}/integration/transactions?filter={"where": {"triggeredAt": {"gt": "${triggeredAt}"}}}`;
}


module.exports = { getData, constructUrl, getData }