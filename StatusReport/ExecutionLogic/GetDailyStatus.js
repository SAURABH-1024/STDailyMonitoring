const { getRepeatedTransactions, getRepeatedTransactionsForCapGFlows } = require('./RepeatedTransactions.js');
const { getFailedTransactions, getProcessingTransactions } = require('./FailedTransactions.js');
const { fetchData } = require('./Helper.js');
const { getPartialFailures } = require("./PartialFailures.js")
const fs = require('fs');
const path = require('path');
const system = require('./ArrayOfObjects.js');

const constructStatement = (TransactionCount, TotalRepeatedTransactions, FailedTransactions, instance, PendingTransactions) => {
    return `For ${instance}
    Transaction Count: ${TransactionCount},
    Failed Transactions: ${FailedTransactions || 'None'},
    Pending Transactions: ${PendingTransactions || 'None'},
    Repeated TransactionsIDs: ${TotalRepeatedTransactions || 'None'}`;
};

// \\hostname: "stmicro-avatar.camelot-itlab.com",
//     triggeredAt: { "gt": " 2024-05-20T13:40:00.000Z " },
// triggeredATBertnwe: { "between": "[]" },
// instance: "PROD"



//Get Daily Monitoring status
const GetDailyStatus = async () => {
    let reports = [];
    for (const elem of system) {
        try {
            const Transactions = await fetchData(elem.hostname, elem.triggeredAt);
            const TransactionCount = Transactions.length;
            const instance = elem.instance;
            const RepeatedTransactionsForNormalFlows = await getRepeatedTransactions(Transactions);
            const RepeatedTransactionsForCapGFlows = await getRepeatedTransactionsForCapGFlows(Transactions)
            const TotalTransactions = RepeatedTransactionsForNormalFlows.concat(RepeatedTransactionsForCapGFlows)
            const FailedTransactions = await getFailedTransactions(Transactions);
            const PendingTransactions = await getProcessingTransactions(Transactions);
            const PartialFailures = await getPartialFailures(Transactions)

            function formatRepeatedTransactionsArray(TotalTransactions) {
                return TotalTransactions.map(innerArray => innerArray.join('\n'))
                    .join('\n\n');
            }
            const TotalRepeatedTransactions = formatRepeatedTransactionsArray(TotalTransactions);


            const status = constructStatement(TransactionCount, TotalRepeatedTransactions, FailedTransactions, instance, PendingTransactions);
            reports.push(status);


        } catch (error) {
            console.error('Error:', error);
        }
    }


    const fullReport = reports.join('\n\n');

    //Report saved to file.
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    const formattedDate = `${month}-${day}`;

    const fileName = `MonitoringReport_${formattedDate}.txt`;

    const folderPath = path.join(__dirname, './StatusReport');
    const filePath = path.join(folderPath, fileName);

    // Ensure the directory exists
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
    }

    fs.writeFile(filePath, fullReport, (err) => {
        if (err) {
            console.error('Error writing to file', err);
        } else {
            console.log('Daily Monitoring Report saved to the file');
        }
    });



}

GetDailyStatus();
