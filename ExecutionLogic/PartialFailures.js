
const fs = require("fs");
const path = require("path");

// Function that returns all the partial failures along with the count and reason for it
const getPartialFailures = (transactions, instance) => {
  const results = [];

  transactions.forEach((transaction) => {
    transaction.transactionExecution.forEach((execution) => {
      execution.executionPlan.forEach((step) => {
        if (step.type === "OutboundAdapter") {
          step.status.forEach((status) => {
            if (status.status === "F") {
              results.push({
                instance,
                TransactionId: transaction.transactionId,
                Dataflow: transaction.dataflowId,
                Adapter: step.id,
                RecordCount: status.recordCount,
                Message: status.message,
              });
            }
          });
        }
      });
    });
  });

  const headers = ["Instance", "TransactionId", "Dataflow", "Adapter", "RecordCount", "Message"];
  const rows = results.map((result) => [
    result.instance,
    result.TransactionId,
    result.Dataflow,
    result.Adapter,
    result.RecordCount,
    result.Message,
  ]);

  // Calculating the maximum width for each column
  const colWidths = headers.map((header, index) => {
    return Math.max(
      header.length,
      ...rows.map((row) => String(row[index]).length)
    );
  });

  // Formatting the table
  const pad = (text, length) => text + " ".repeat(length - text.length);
  let table = headers.map((header, index) => pad(header, colWidths[index])).join(" | ") + "\n";
  table += colWidths.map((width) => "-".repeat(width)).join("-|-") + "\n\n";
  rows.forEach((row) => {
    table += row.map((cell, index) => pad(String(cell), colWidths[index])).join(" | ") + "\n";
  });


  return table
};


module.exports = { getPartialFailures };

