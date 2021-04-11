"use strict";
const S3LineReader = require('./core/s3LineReader');
const aws = require('aws-sdk');
const s3 = new aws.S3({ apiVersion: '2006-03-01' });
const lineReader = new S3LineReader(s3, require('readline'));

exports.lambdaHandler = async (event, context) => {

    const s3Payload = event.detail.requestParameters; 
    const params = {
        Bucket: s3Payload.bucketName,
        Key: s3Payload.key
    };

    return await lineReader.readLineFromS3(params);
};
