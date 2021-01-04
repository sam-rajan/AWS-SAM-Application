const aws = require('aws-sdk');
const s3 = new aws.S3({ apiVersion: '2006-03-01' });
const sqs = new aws.SQS({apiVersion: '2012-11-05'});
const readline = require('readline');

exports.lambdaHandler = async (event, context) => {
    await Promise.all(payments.map(item => sendExtractedPayment(item)));
};


function lineToObject(line) {
    const tokens = line.split(/\s{4}/);

    if (tokens.length < 7) return {};

    return {
        id: tokens[0],
        reference: tokens[1],
        payee: tokens[2],
        email: tokens[3],
        amount: tokens[4],
        date: tokens[5],
        status: tokens[6]
    }
}

async function sendExtractedPayment(payment) {
    if (payment.id === undefined)
        return Promise.resolve();

    let sqsPayload = {
        MessageBody: JSON.stringify(payment),
        QueueUrl: process.env.QueueUrl
    };
    return new Promise((resolve, reject) => {
        await sqs.sendMessage(sqsPayload, function (err, data) {
            if (err) {
                reject("Failed to post to SES");
            } else {
                resolve("Message send, Id:" + data.MessageId);
            }
        });
    });
}