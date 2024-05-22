const myHeaders = new Headers();
myHeaders.append("Authorization", "Basic c2FhbTpHcm90b3BvQDM1NyE=");


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
    return FailedTransactions
}

async function getProcessingTransactions(Transactions) {
    const PendingTransactions = [];
    for (const transaction of Transactions) {
        if (transaction.status === 'P') {
            const transactionId = transaction.transactionId
            group = transactionId;
            PendingTransactions.push(group);
        }
    }
    return PendingTransactions
}

const convertObjectToStringArray = (Transactions) => {
    return Transactions.map(obj => {
        const key = Object.keys(obj)[0];
        const value = obj[key];
        return `${key}: ${value}`;
    });
};



module.exports = { getFailedTransactions, getProcessingTransactions }