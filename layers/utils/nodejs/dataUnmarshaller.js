class DynamoDbUnmarshaller {

    constructor(aws) {
        this.aws = aws;
    }

    unmarshallData(data) {
        if(data == undefined || data == null) {
            return null;
        }
        return this.aws.DynamoDB.Converter.unmarshall(data);
    }
}

module.exports = DynamoDbUnmarshaller;