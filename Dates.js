//**Only change the dates of the triggeredAt property
const system = [
    {
        hostname: "test.stmicro-avatar.camelot-itlab.com",
        triggeredAt: "2024-05-22T13:00:00.000Z",
        instance: "TEST"
    },
    {
        hostname: "stmicro-avatar.camelot-itlab.com",
        triggeredAt: "2024-05-22T13:00:00.000Z",
        instance: "PROD"
    },
    {
        hostname: "dev.stmicro-avatar.camelot-itlab.com",
        triggeredAt: "2024-05-22T13:00:00.000Z",
        instance: "DEV"
    },
    {
        hostname: "pre-prod.stmicro-avatar.camelot-itlab.com",
        triggeredAt: "2024-05-22T13:00:00.000Z",
        instance: "PRE-PROD"
    }]


module.exports = system 




// \\hostname: "stmicro-avatar.camelot-itlab.com",
//     triggeredAt: { "gt": " 2024-05-20T13:40:00.000Z " },
// triggeredATBertnwe: { "between": "[]" },
// instance: "PROD"