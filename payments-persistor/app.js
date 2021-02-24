"use strict";

const DynamoDbPersistor = require('./core/dynamoDbPersistor');
const aws = require('aws-sdk');
const ddb = new aws.DynamoDB.DocumentClient();
const dynamoDbPersistor = new DynamoDbPersistor(ddb);

exports.lambdaHandler = async (event, context) => {
    const messages = event.Records;
    if(messages.length == 0) {
        console.log("No Payments to persist");
        return;
    }

    await Promise.all(messages.map(element => {
        return dynamoDbPersistor.persistData(JSON.parse(element.body), process.env.TABLE_NAME);
    }));
};
