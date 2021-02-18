class S3LineReader {

    constructor(s3, readLine) {
        this.s3 = s3;
        this.readLine = readLine;
    }

    readLine(params) {
        const lines = [];
        try {
            const readStream = await this.s3.getObject(params).createReadStream();
            const lineReader = this.readline.createInterface({
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