const aws = require('aws-sdk');
const s3 = new aws.S3({ apiVersion: '2006-03-01' });
const readline = require('readline');

exports.lambdaHandler = async (event, context) => {

    console.log(event);

    const s3Payload = event.Records[0].s3;
    const payments = [];

    try {
        const params = {
            Bucket: s3Payload.bucket.name,
            Key: decodeURIComponent(s3Payload.object.key,replace(/\+/g, ' '))
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
