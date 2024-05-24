const { getRepeatedTransactions, getRepeatedTransactionsForCapGFlows } = require('./RepeatedTransactions.js');
const { getFailedTransactions, getProcessingTransactions } = require('./FailedTransactions.js');
const { fetchData } = require('./Helper.js');
const { getPartialFailures } = require("./PartialFailures.js")
const fs = require('fs');
const path = require('path');
const system = require('../Dates.js');

const constructStatement = (TransactionCount, TotalRepeatedTransactions, FailedTransactions, instance, PendingTransactions) => {
    return `For ${instance}
    Transaction Count: ${TransactionCount},
    Failed Transactions: ${FailedTransactions},
    Pending Transactions: ${PendingTransactions || 'None'},
    Repeated TransactionIDs: \n\n  ${TotalRepeatedTransactions || 'None'}`;
};


const GetDailyStatus = async () => {
    let reports = [];
    let PartialFailures
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
            PartialFailures = PartialFailures + "\n\n" + await getPartialFailures(Transactions, instance)


            //******** Function used to format the long list of RepeatedTransactions which includes results 
            //******** from two Functions - RepeatedTransactionsForNormalFlows, RepeatedTransactionsForCapGFlows *** /
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

    //** This step joins the reports for all the ST instances */
    const fullReport = reports.join('\n\n');


    //************Report saved to file********************//.

    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    const formattedDate = `${month}-${day}`;

    const fileName = `MonitoringReport_${formattedDate}.txt`;

    const folderPath = path.join(__dirname, '../StatusReport');
    const filePath = path.join(folderPath, fileName);

    // Ensures that the directory exists
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

    const filenamePartialFailures = `Partial_Failures_${month}_${day}.txt`;
    const filePathforPF = path.join(folderPath, filenamePartialFailures);

    fs.writeFile(filePathforPF, PartialFailures, (err) => {
        if (err) {
            console.error('Error writing to file', err);
        } else {
            console.log('PartialFailure Report saved to the file');
        }
    });

}

GetDailyStatus();
