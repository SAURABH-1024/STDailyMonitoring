const { getData } = require("./Helper")

const myHeaders = new Headers();
myHeaders.append("Authorization", "Basic c2FhbTpHcm90b3BvQDM1NyE=");


// Function to fetch array of objects from API
const fetchData = async (hostname, triggeredAt, transactionId ) => {
  const response = await getData(hostname, triggeredAt, transactionId)
  return response
}

// Function to group the array of objects obtained through the API call.
async function getRepeatedTransactions(Transactions) {

  const groupedTransactions = [];
  for (const transaction of Transactions) {
    const transactionId = transaction.transactionId;
    const parts = transactionId.split('-');
    const textPart = parts[0];

    // Check if a group with this text part already exists
    let group = groupedTransactions.find(group => group[0].split("-")[0] === textPart);

    if (!group) {
      // Create a new group if it doesn't exist
      group = [transaction.transactionId];
      groupedTransactions.push(group);
    } else {
      // Add the current transaction to the existing group
      group.push(transaction.transactionId);
    }
  }

  return groupedTransactions.filter((element) => {
    if (element.length > 1) {
      return element
    }
  });
}

module.exports = { fetchData, getRepeatedTransactions };

