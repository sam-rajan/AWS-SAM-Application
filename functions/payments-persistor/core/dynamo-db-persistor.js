class DynamoDbPersistor {
   
    constructor(dynamoDb) {
        this.dynamoDb = dynamoDb;
    }

    async persistData(data, tableName) {

        var params = {
            TableName: tableName,
            Item: data
        };

        return new Promise((resolve, reject) => {
            this.dynamoDb.put(params, function (err, data) {
                if (err) {
                    reject("Failed to write to database. Error: " + err);
                } else {
                    resolve("Data persisted. ID: " + data.id);
                }
            });
        });
    }
}

module.exports = DynamoDbPersistor;