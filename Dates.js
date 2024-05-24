//**Only change the dates of the triggeredAt property
const system = [
    {
        hostname: "test.stmicro-avatar.camelot-itlab.com",
        triggeredAt: { "between": ["2024-05-23T13:40:00.000Z", "2024-05-24T10:40:00.000Z"] },
        instance: "TEST"
    },
    {
        hostname: "stmicro-avatar.camelot-itlab.com",
        triggeredAt: { "between": ["2024-05-23T13:40:00.000Z", "2024-05-24T10:40:00.000Z"] },
        instance: "PROD"
    },
    {
        hostname: "dev.stmicro-avatar.camelot-itlab.com",
        triggeredAt: { "between": ["2024-05-23T13:40:00.000Z", "2024-05-24T10:40:00.000Z"] },
        instance: "DEV"
    },
    {
        hostname: "pre-prod.stmicro-avatar.camelot-itlab.com",
        // triggeredAt: { "gt": " 2024-05-23T13:40:00.000Z " },
        triggeredAt: { "between": ["2024-05-23T13:40:00.000Z", "2024-05-24T10:40:00.000Z"] },
        instance: "PRE-PROD"
    }]


module.exports = system
