class PaymentMapper {

    mapToPayment(line) {
        const tokens = line.split(/\s{4}/);

        if (tokens.length < 7)
            throw new Error('Invalid input ' + line);

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
}

module.exports = PaymentMapper;