const myHeaders = new Headers();
myHeaders.append("Authorization", "Basic c2FhbTpHcm90b3BvQDM1NyE=");

//*********** Function that returns all the failed transactions in the daily chain along with their reason */
async function getFailedTransactions(Transactions) {
    const FailTransactions = [];
    for (const transaction of Transactions) {
        if (transaction.status === 'F') {
            const transactionId = transaction.transactionId
            group = { [transactionId]: transaction.transactionExecution[0].message };
            FailTransactions.push(group);
        }
    }
    const FailedTransactions = convertObjectToStringArray(FailTransactions)
    const failedTransaction = FailedTransactions.length > 0 ? FailedTransactions : "None"
    if (failedTransaction === "None") {
        return "None"
    }
   return failedTransaction.join('\n')
}


//*********** Function that returns all the transactions stuck in processing in the daily chain */
async function getProcessingTransactions(Transactions) {
    const PendingTransactions = [];
    for (const transaction of Transactions) {
        if (transaction.status === 'P') {
            const transactionId = transaction.transactionId
            group = transactionId;
            PendingTransactions.push(group);
        }
    }
    const pendingTransactions =  PendingTransactions.length > 0 ? PendingTransactions : "None"
    if (pendingTransactions === "None") {
        return "None"
    }
    return pendingTransactions.join('\n')
}


//*********** Function to convert the array of object recieved to an array of string */
//*********** This function is created to convert the object that we construct in the getFailureTransactions function
//*********** which returns an object that has the Failed Transaction along with its message * /
//*********** used in getFailedTransactions */

const convertObjectToStringArray = (Transactions) => {
    return Transactions.map(obj => {
        const key = Object.keys(obj)[0];
        const value = obj[key];
        return `${key}: ${value}`;
    });
};


module.exports = { getFailedTransactions, getProcessingTransactions }