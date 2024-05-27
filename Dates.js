//**Only change the dates of the triggeredAt property
const system = [
    {
        hostname: "test.stmicro-avatar.camelot-itlab.com",
        triggeredAt: { "between": ["2024-05-26T13:00:00.000Z", "2024-05-27T10:40:00.000Z"] },
        instance: "TEST"
    },
    {
        hostname: "stmicro-avatar.camelot-itlab.com",
        triggeredAt: { "between": ["2024-05-25T13:00:00.000Z", "2024-05-26T10:00:00.000Z"] },
        instance: "PROD"
    },
    {
        hostname: "dev.stmicro-avatar.camelot-itlab.com",
        triggeredAt: { "between": ["2024-05-25T13:00:00.000Z", "2024-05-26T10:00:00.000Z"] },
        instance: "DEV"
    },
    {
        hostname: "pre-prod.stmicro-avatar.camelot-itlab.com",
        triggeredAt: { "between": ["2024-05-25T13:00:00.000Z", "2024-05-26T10:00:00.000Z"] },
        instance: "PRE-PROD"
    }]


module.exports = system
