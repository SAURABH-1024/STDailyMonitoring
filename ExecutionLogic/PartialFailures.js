const fs = require("fs");
const path = require("path");

// const data = {
//   id: "3bf4c2a0-1863-11ef-9b39-c7c096ed6d17",
//   transactionId:
//     "SCA_STDDMRPT_IBP2SCA_ORDERINPUTSTOCKTRANSFER_GIT-20240522174537",
//   dataflowId: "Dataflow-OrderCreation-4",
//   status: "S",
//   triggeredAt: "2024-05-22T17:46:35.849Z",
//   transactionExecution: [
//     {
//       retryOnStartup: false,
//       executionParameters: {},
//       hostName: "integration-75d469646c-qlw6t",
//       status: "S",
//       message: "Executed successfully",
//       executedAt: "2024-05-22T17:46:35.849Z",
//       APCTransactionInfo: {
//         apcTransactionId: "10555806",
//         Start: "2024-05-22T17:47:03.000Z",
//         Group: "",
//         End: "2024-05-22T17:47:03.000Z",
//         Status: "eClosed",
//         Type: "eMerge",
//         User: "integration_ci",
//       },
//       executionPlan: [
//         {
//           id: "Pre Step Dataflow Dataflow-OrderCreation-4",
//           type: "Preprocessing",
//           status: [
//             {
//               status: "I",
//               timestamp: "2024-05-22T17:46:35.830Z",
//               message: "Initial status",
//               recordCount: null,
//             },
//             {
//               status: "P",
//               timestamp: "2024-05-22T17:46:35.900Z",
//               message:
//                 "Processing started for Pre Step Dataflow Dataflow-OrderCreation-4",
//               recordCount: 0,
//             },
//             {
//               status: "S",
//               timestamp: "2024-05-22T17:46:50.417Z",
//               message:
//                 "Processing finished for Pre Step Dataflow Dataflow-OrderCreation-4",
//               recordCount: 0,
//             },
//           ],
//           dependentStep: [],
//         },
//         {
//           id: "OrderCreationOutboundID_NoSOSID_CTFalse",
//           type: "OutboundAdapter",
//           status: [
//             {
//               status: "I",
//               timestamp: "2024-05-22T17:46:35.830Z",
//               message: "Initial status",
//               recordCount: null,
//             },
//             {
//               status: "P",
//               timestamp: "2024-05-22T17:47:02.420Z",
//               message:
//                 "Processing started for OrderCreationOutboundID_NoSOSID_CTFalse",
//               recordCount: 2473,
//             },
//             {
//               status: "F",
//               timestamp: "2024-05-22T17:47:03.031Z",
//               message:
//                 "Processing failed for OrderCreationOutboundID_NoSOSID_CTFalse with error No LocationProductSegment found for keys",
//               recordCount: 43,
//             },
//             {
//               status: "S",
//               timestamp: "2024-05-22T17:47:03.032Z",
//               message:
//                 "Processing finished for OrderCreationOutboundID_NoSOSID_CTFalse",
//               recordCount: 2430,
//             },
//           ],
//           dependentStep: [
//             {
//               id: "TargetMapper-OrderCreation-NoSOSID-ClearTransFalse",
//               type: "TargetMapping",
//             },
//           ],
//         },
//         {
//           id: "OrderCreationOutboundID_NoSOSID_CTFalse1",
//           type: "OutboundAdapter",
//           status: [
//             {
//               status: "I",
//               timestamp: "2024-05-22T17:46:35.830Z",
//               message: "Initial status",
//               recordCount: null,
//             },
//             {
//               status: "P",
//               timestamp: "2024-05-22T17:47:02.420Z",
//               message:
//                 "Processing started for OrderCreationOutboundID_NoSOSID_CTFalse",
//               recordCount: 2473,
//             },
//             {
//               status: "F",
//               timestamp: "2024-05-22T17:47:03.031Z",
//               message:
//                 "Processing failed for OrderCreationOutboundID_NoSOSID_CTFalse with error No LocationProductSegment found for keys",
//               recordCount: 43,
//             },
//             {
//               status: "S",
//               timestamp: "2024-05-22T17:47:03.032Z",
//               message:
//                 "Processing finished for OrderCreationOutboundID_NoSOSID_CTFalse",
//               recordCount: 2430,
//             },
//           ],
//           dependentStep: [
//             {
//               id: "TargetMapper-OrderCreation-NoSOSID-ClearTransFalse",
//               type: "TargetMapping",
//             },
//           ],
//         },
//       ],
//     },
//   ],
// };


//*********** Function that returns all the partial failures along with the count and reason for it*/
const getPartialFailures = (Transactions) => {
  const results = [];
  for (elem of Transactions) {
    elem.transactionExecution.forEach((execution) => {
      execution.executionPlan.forEach((step) => {
        if (step.type === "OutboundAdapter") {
          step.status.forEach((status) => {
            if (status.status === "F") {
              results.push({
                Dataflow: elem.dataflowId,
                Adapter: step.id,
                RecordCount: status.recordCount,
                Message: status.message,
              });
            }
          });
        }
      });
    });

    const headers = ["Dataflow", "Adapter", "RecordCount", "Message"];
    const rows = results.map((result) => [
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
    let table =
      headers
        .map((header, index) => pad(header, colWidths[index]))
        .join(" | ") + "\n";
    table += colWidths.map((width) => "-".repeat(width)).join("-|-") + "\n";
    rows.forEach((row) => {
      table +=
        row
          .map((cell, index) => pad(String(cell), colWidths[index]))
          .join(" | ") + "\n";
    });



    //************Report saved to file********************//.

    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    const filenamePartialFailures = `Partial_Failures_${month}_${day}.txt`;

    const folderPath = path.join(__dirname, "./StatusReport");
    const filePath = path.join(folderPath, filenamePartialFailures);

    fs.writeFileSync(filePath, table),
      (err) => {
        if (err) {
          console.error("Error writing to file", err);
        } else {
          console.log("PartialFailure Report saved to the file");
        }
      };
  }
};

module.exports = { getPartialFailures };
