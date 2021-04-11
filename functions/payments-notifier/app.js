"use strict";
const DynamoDbUnmarshaller = require('/opt/nodejs/dynamo-data-unmarshaller');
const SesMailSender = require('./core/sesMailSender');
const EmailHelper = require('./core/emailHelper');
const aws = require('aws-sdk');
const ses = new aws.SES({region: process.env.AWS_REGION});
const dynamoDbUnmarshaller = new DynamoDbUnmarshaller(aws);
const sesMailSender = new SesMailSender(ses);

exports.lambdaHandler = async (event, context) => {
    const data = event.Records;
    if(data.length == 0) {
        console.log("No Payments recieved");
        return;
    }

    const helper = new EmailHelper();  

    Promise.all(data.map(item => {
        const unMarshalledObject = dynamoDbUnmarshaller.unmarshallData(item.dynamodb.NewImage);
        if(helper.shouldNotify(unMarshalledObject)) {
            return sesMailSender.sendMail(unMarshalledObject);
        }
        return Promise.resolve();
    }));
}