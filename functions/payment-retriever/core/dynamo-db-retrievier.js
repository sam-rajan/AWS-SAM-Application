class DynamoDbRetriever {
    
    constructor(dynamoDb) {
        this.dynamoDb = dynamoDb;
    }

    async readAllData(tableName) {
        var params = {
            TableName: tableName,
            ProjectionExpression: "#payment_date, email, payee, #payment_reference, #payment_status, amount",
            ExpressionAttributeNames: {
                "#payment_date": "date",
                "#payment_reference": "reference",
                "#payment_status": "status"
            },
        };

        return new Promise((resolve, reject) => {
            this.dynamoDb.scan(params, function (err, data) {
                if (err) {
                    reject("Failed to read from database. Error: " + err);
                } else {
                    resolve(data);
                }
            });
        });
    }

}

module.exports = DynamoDbRetriever;