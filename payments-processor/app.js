"use strict";

const PaymentMapper = require('core/paymentMapper');
const PaymentSender = require('core/paymentSender');
const aws = require('aws-sdk');
const sqs = new aws.SQS({apiVersion: '2012-11-05'});
const paymentSender = new PaymentSender(sqs);


exports.lambdaHandler = async (event, context) => {
    const paymentMapper = new PaymentMapper();
    event.map(item => {
        let payment = paymentMapper.mapToPayment(item);
        await paymentSender.sendExtractedPayment(payment);
    });
};
