(function ($el) {
    var Mailer = function (config) {
        config = config || {
            host: "smtp.mailgun.org",
            password: "aaada5417872351f063866a686a1d28e",
            username: "postmaster@sandbox5f2da9c7bad44dfe8119378cc4f3a977.mailgun.org"
        };

        var baseUrl = "https://api:" + config.key + "@" + config.host;

        return {
            _flush: function () {
                var message = mailer.messages.pop();
                if(!message) return;
                $el.Email.send(message.from,
                               message.to,
                               message.subject,
                               message.body,
                               config.host,
                               config.username,
                               config.password);

            },
            messages: [],
            send: function (message) {
                if (typeof message == "string") {
                    message = {
                        body: message
                    };
                }

                message.from = message.from || "chicktechwebdevdec2016@mailinator.com";
                message.subject = message.subject || "Hey! You got a message";
                message.to = message.to || "chicktechwebdevdec2016@mailinator.com";

                mailer.messages.push(message);
            }
        }
    };
    var $script = document.createElement('script');
    $script.async = true;
    $script.onload = function () {
        setInterval(mailer._flush, 1000);
    }
    $script.src = "http://smtpjs.com/smtp.js";
    $script.type = "text/javascript";
    document.getElementsByTagName('head')[0].appendChild($script);

    $el.Mailer = Mailer;
    $el.mailer = Mailer();
})(window);
