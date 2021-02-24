class S3LineReader {

    constructor(s3, reader) {
        this.s3 = s3;
        this.reader = reader;
    }

    async readLineFromS3(params) {
        const lines = [];
        try {
            const readStream = await this.s3.getObject(params).createReadStream();
            const lineReader = this.reader.createInterface({
                input: readStream,
                terminal: false
            });

            let lineReadPromise = new Promise((resolve, reject) => {

                lineReader.on('line', (line) => {
                    lines.push(line);
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
            return lines;
        }

        return lines;
    }
}

module.exports = S3LineReader;