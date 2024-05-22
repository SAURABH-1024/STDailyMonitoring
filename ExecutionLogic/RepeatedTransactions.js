const myHeaders = new Headers();
myHeaders.append("Authorization", "Basic c2FhbTpHcm90b3BvQDM1NyE=");


//*********** Function that returns all the repeated transactions for the capgemini flows (Planned Order / Purchase req) */
async function getRepeatedTransactionsForCapGFlows(Transactions) {
  const groupedCapGTransactions = [];

  for (const transaction of Transactions) {

    const plannedSubstring = 'Planned Order';
    const purchaseSubstring = 'Purchase Req';

    const transactionId = transaction.transactionId;

    const containsPlannedSubstring = transactionId.includes(plannedSubstring);
    const containsPurchaseSubstring = transactionId.includes(purchaseSubstring);
    if (containsPlannedSubstring || containsPurchaseSubstring) {
      const parts = transactionId.split(' ');
      const textPart = parts.slice(0, 5).join(' ');

      // Check if a group with this text part already exists
      let group = groupedCapGTransactions.find(group => group[0].split(' ').slice(0, 5).join(' ') === textPart);

      if (!group) {
        // Create a new group if it doesn't exist
        group = [transaction.transactionId];
        groupedCapGTransactions.push(group);
      } else {
        // Add the current transaction to the existing group
        group.push(transaction.transactionId);
      }
    }
  }

  return groupedCapGTransactions.filter((element) => {
    if (element.length > 1) {
      return element
    }
  });

}


//*********** Function that returns all the repeated transactions in the daily chain */
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

module.exports = { getRepeatedTransactions, getRepeatedTransactionsForCapGFlows };

