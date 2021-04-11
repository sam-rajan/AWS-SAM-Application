class SesMailSender {

    constructor(ses) {
        this.ses = ses;
    }

    sendMail(data, toAddress) {
        var params = {
            Destination: {
                ToAddresses: [toAddress],
            },
            Message: {
                Body: {
                    Text: { Data: "Test" },
                },

                Subject: { Data: "Test Email" },
            },
            Source: "SourceEmailAddress",
        };

        return this.ses.sendEmail(params).promise()
    }
}

module.exports = SesMailSender;