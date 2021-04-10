# A Sample AWS SAM application

This project contains source code and supporting files for an event-driven serverless application developed using AWS Serverless Application Model(SAM). This project is intended to demonstrate the usage of AWS SAM Template for provisioning different AWS serverless services and usage of AWS SAM CLI.


![](serverless-architecture-diagram.jpg?raw=true)

### Diagram Explained

This is an event driven payment meta data processing system which would extract payment details meta a file and push it to databse. This application uses different AWS resources including Event Bridge, SNS, SQS, SES, DynamoDb and API Gateway. These resources are defined in the `template.yaml` file in this project. 

1. Assume that a legacy system uploading all the payment metadata in file format to AWS S3 bucket(following file transfer integration style) after processing of payments. And these files are called receipts. The file `sample-receipt` within this project is a sample receipt file. Each line in the file represents a payment and it's attributed separated by tab space. There can be one or N number of payments in a file.
2. On receiving a file, S3 will log an event in cloud trail and these events are consumed by AWS EventBridge and trigger an AWS step function which has two AWS Lambda functions, **ReceiptsReader** and **PaymentProcessor**.
RecieptReader will read the file from S3 and upon successful completion, PaymentProcessor will extract the receipts and create payment objects. Failure in Reading or Processing will trigger an SNS event.
3. Once successful payment processing PaymentProcessor will post payment data to the SQS FIFO queue which is consumed by another AWS Lambda function called **PaymentsPersistor** . 
4. As its name implies PaymentsPersistor persist payment data. It stores data in AWS Dynamo DB.
5. **PaymentNotifier** is another Lambda Function which notifies parties associated with payment if the payment status is pending.
6. All processed payments can be fetched via HTTP Rest Endpoint configured by AWS API gateway and backed by a Lambda function **PaymentsRetriever**. 

## Project Structure

* **env** - Directory for keeping all evironment properties for testing environemnt
* **events** - Directory which contains events which helps for local development. For generating an event use 
  ```bash
  sam local generate-event
  ```
  which Generates sample payloads from different event sources, such as Amazon S3, Amazon API Gateway, and Amazon SNS
* **Functions** - Directory contains Lambda Functions.
* **Layers** - Contains shared code for Lambda Functions.
* **state-machines** - Directory contains definitions for state machines.
* **samconfig.toml** - AWS SAM CLI project-level configuration file that stores default parameters for its commands.
* **sample-receipt** - Sample Receipts File.
* **serverless-architecture-diagram.drawio** - Draw.io file for architecture diagram of this application.
* **template.yml** - AWS SAM template file in which all the services and resources are specified.

## Use the SAM CLI to build and test locally

For building the application, run:

```bash
$ sam build
```

The SAM CLI installs dependencies defined in `package.json` of each functions, creates a deployment package, and saves it in the `.aws-sam/build` folder.

Test a single function by invoking it directly with a test event. An event is a JSON document that represents the input that the function receives from the event source. Test events are included in the `events` folder in this project.

Run functions locally and invoke them with the `sam local invoke` command.

```bash
$ sam local invoke HelloWorldFunction --event events/event.json
```

The SAM CLI can also emulate application's API. 

```bash
$ sam local start-api
$ curl http://localhost:3000/
```

## Deploy the application

To deploy the application, run the following command:

```bash
$ sam deploy
```
The above command will take default parameters from `samconfig.toml` file.  For resetting this, run the following command:

```bash
$ sam deploy --guided
```
which will start an interactive session with series of prompts.

## Add a resource to your application
The application template uses AWS Serverless Application Model (AWS SAM) to define application resources. AWS SAM is an extension of AWS CloudFormation with a simpler syntax for configuring common serverless application resources such as functions, triggers, and APIs. For resources not included in [the SAM specification](https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md), use standard [AWS CloudFormation](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-template-resource-type-ref.html) resource types.

## Fetch, tail, and filter Lambda function logs

To simplify troubleshooting, SAM CLI has a command called `sam logs`. `sam logs` which helps fetching logs generated by deployed Lambda function from the command line. 

```bash
$ sam logs -n <Function-Name> --stack-name <Stack-Name> --tail
```

Find more information and examples about filtering Lambda function logs in the [SAM CLI Documentation](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-logging.html).
