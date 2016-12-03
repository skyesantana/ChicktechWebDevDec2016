(function ($document, $window) {
    var Mailer = function (config) {
        config = config || {
            host: "smtp.mailgun.org",
            password: "aaada5417872351f063866a686a1d28e",
            username: "postmaster@sandbox5f2da9c7bad44dfe8119378cc4f3a977.mailgun.org"
        };

        var baseUrl = "https://api:" + config.key + "@" + config.host;
        var defaultSubject= 'New message for: ' +
            $window.location.hostname == undefined
                ? $window.location.hostname
                : $window.location.pathname;

        return {
            _process: function () {
                var message = $window.mailer.messages.pop();
                if(!message) return;
                $window.Email.send(message.from,
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
                message.subject = message.subject || defaultSubject;
                message.to = message.to || "chicktechwebdevdec2016@mailinator.com";

                $window.mailer.messages.push(message);
            }
        }
    };

    $window.mailer = Mailer();

    var $script = $document.createElement('script');
    $script.async = true;
    $script.onload = function () {
        setInterval($window.mailer._process, 1000);
    }
    $script.src = "http://smtpjs.com/smtp.js";
    $script.type = "text/javascript";
    $document.getElementsByTagName('head')[0].appendChild($script);
})(document, window);
