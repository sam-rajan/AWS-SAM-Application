const aws = require('aws-sdk');
const s3 = new aws.S3({ apiVersion: '2006-03-01' });
const readline = require('readline');

exports.lambdaHandler = async (event, context) => {

    const s3Payload = event.detail.requestParameters;
    const payments = [];

    try {
        const params = {
            Bucket: s3Payload.bucketName,
            Key: s3Payload.key
        };
        const readStream = await s3.getObject(params).createReadStream();

        const lineReader = readline.createInterface({
            input: readStream,
            terminal: false
        });


        let lineReadPromise = new Promise((resolve, reject) => {

            lineReader.on('line', (line) => {
                payments.push(lineToObject(line));
            });
            lineReader.on('error', () => {
                reject("Error while reading the file");
            });
            lineReader.on('close', function () {
                resolve();
            });
        });

        await lineReadPromise;

    } catch (error) {
        console.log(error);
        return payments;
    }

    return payments;
};


function lineToObject(line) {
    const tokens = line.split(/\s{4}/);

    if (tokens.length < 7) 
        throw new Error('Invalid input' + line);

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