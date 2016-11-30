window.mailgun = function (config) {
    config = config || {
        key: "key-e8b3ee50f2cd733f6c9b083b1e4f27e2",
        host: "api.mailgun.net/v3/sandbox5f2da9c7bad44dfe8119378cc4f3a977.mailgun.org"
    };

    var baseUrl = "https://api:" + config.key + "@" + config.host;

    return {
        send: function (data, callback) {
            var params,
                req = new XMLHttpRequest();

            for (var key in data) {
                if (data.hasOwnProperty(key)) {
                    if (params) {
                        params = params + "&";
                    }
                    params = params + key + "=" + data[key];
                }
            }
            req.open("POST", baseUrl + "/messages", true);
            req.send(params);
            console.log('Attempting to send email');
            req.onreadystatechange = function () {
                console.log('XMLHttpRequest on ready state change');
            }
        }
    }
};

window.mailer = mailgun();
