(function ($document, $window) {
    var Mailer = function (config) {
        config = config || {
            apiKey: "e8b3ee50f2cd733f6c9b083b1e4f27e2",
            baseUrl: "https://api.mailgun.net/v3/sandbox5f2da9c7bad44dfe8119378cc4f3a977.mailgun.org"
        };

        var defaultSubject= 'New message for: ' +
            $window.location.hostname == undefined
                ? $window.location.hostname
                : $window.location.pathname;

        return {
            _process: function () {
                var message = $window.mailer.messages.pop();
                if(!message) return;
                var params = "";
                for (var prop in message) {
                    if (!message.hasOwnProperty(prop)) {
                        continue;
                    }
                    if (params.length > 0) {
                        params = params + "&";
                    }
                    params = params + prop + "=" + message[prop];
                }

                var req = new XMLHttpRequest();
                req.open("POST", config.baseUrl);
                req.setRequestHeader("Authorization", "Basic: " + btoa('api:' + config.apiKey));
                req.send(params);
            },
            messages: [],
            send: function (message) {
                if (typeof message == "string") {
                    message = {
                        text: message
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
    $window.setInterval($window.mailer._process, 1000);
})(document, window);
