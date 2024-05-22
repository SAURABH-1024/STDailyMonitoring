const { getRepeatedTransactions, fetchData } = require('./RepeatedTransactions.js');
const { getFailedTransactions, getProcessingTransactions } = require('./FailedTransactions.js');
const fs = require('fs');
const path = require('path');

const system = [{
    hostname: "stmicro-avatar.camelot-itlab.com",
    triggeredAt: "2024-05-21T13:00:00.000Z",
    instance: "PROD"
},
{
    hostname: "dev.stmicro-avatar.camelot-itlab.com",
    triggeredAt: "2024-05-21T13:40:00.000Z",
    instance: "DEV"
},
{
    hostname: "test.stmicro-avatar.camelot-itlab.com",
    triggeredAt: "2024-05-21T13:00:00.000Z",
    instance: "TEST"
},
{
    hostname: "pre-prod.stmicro-avatar.camelot-itlab.com",
    triggeredAt: "2024-05-21T13:00:00.000Z",
    instance: "PRE-PROD"
}]

const constructStatement = (TransactionCount, getRepeatedTransactions, FailedTransactions, instance, PendingTransactions) => {
    return `For ${instance}
    Transaction Count: ${TransactionCount},
    Failed Transactions: ${FailedTransactions || 'None'},
    Pending Transactions : ${PendingTransactions.join(', ') || 'None'},
    Repeated Transaction IDs: ${getRepeatedTransactions.join(', ') || 'None'},
    `;
};

// \\hostname: "stmicro-avatar.camelot-itlab.com",
//     triggeredAt: { "gt": " 2024-05-20T13:40:00.000Z " },
// triggeredATBertnwe: { "between": "[]" },
// instance: "PROD"


const GetDailyStatus = async () => {
    let reports = [];
    for (const elem of system) {
        try {
            const Transactions = await fetchData(elem.hostname, elem.triggeredAt);
            const TransactionCount = Transactions.length;
            const instance = elem.instance;
            const RepeatedTransactions = await getRepeatedTransactions(Transactions);
            const FailedTransactions = await getFailedTransactions(Transactions);
            const PendingTransactions = await getProcessingTransactions(Transactions);

            const status = constructStatement(TransactionCount, RepeatedTransactions, FailedTransactions, instance, PendingTransactions);
            reports.push(status);

        } catch (error) {
            console.error('Error:', error);
        }
    }

    const fullReport = reports.join('\n\n');


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


    // Create the file name

    fs.writeFile(filePath, fullReport, (err) => {
        if (err) {
            console.error('Error writing to file', err);
        } else {
            console.log('Report saved to the file');
        }
    });
}

GetDailyStatus();
