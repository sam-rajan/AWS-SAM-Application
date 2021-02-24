class PaymentSender {

    constructor(sqs) {
        this.sqs = sqs;
    }

    async sendExtractedPayment(payment) {
        if (payment.id === undefined) {
            console.log("Invalid Payment, skipping");
            return Promise.resolve();
        }
            

        let sqsPayload = {
            MessageBody: JSON.stringify(payment),
            QueueUrl: process.env.QueueUrl,
            MessageGroupId: payment.id
        };
        return new Promise((resolve, reject) => {
            this.sqs.sendMessage(sqsPayload, function (err, data) {
                if (err) {
                    reject("Failed to post to SQS. Error:" + err);
                } else {
                    console.log("submitted");
                    resolve("Message send, Id:" + data.MessageId);
                }
            });
        });
    }
}

module.exports = PaymentSender;