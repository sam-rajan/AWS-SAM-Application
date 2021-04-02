
const DynamoDbUnmarshaller = require('/opt/nodejs/dataUnmarshaller');
const DynamoDbRetriever = require('./core/dynamodbRetrievier');
const aws = require('aws-sdk');
const ddb = new aws.DynamoDB.DocumentClient();
const dynamoDbUnmarshaller = new DynamoDbUnmarshaller(aws);
const dynamoDbRetrievier = new DynamoDbRetriever(ddb);

exports.lambdaHandler = async (event, context) => {
    console.log(process.env.TABLE_NAME);
    return await dynamoDbRetrievier.readAllData(process.env.TABLE_NAME);
}