class EmailHelper { 
    shouldNotify(data) {
        return data.status in StatusToNotify;
    }
}

const StatusToNotify = {
    FAILED: "FAILED", 
    PENDING: "PENDING"
};

module.exports = EmailHelper;