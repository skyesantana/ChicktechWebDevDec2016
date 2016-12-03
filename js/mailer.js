(function ($document, $window) {
    var Mailer = function () {
        var defaultSubject = 'New message sent from: ' +
            encodeURIComponent($window.location.hostname != ""
                ? $window.location.hostname
                : $window.location.pathname);

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

                emailjs.send("chicktechwebdevdec2016", "default", message);
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
        $window.emailjs.init("user_zsaRT1pLNG8UDb8toeHwC");
        $window.setInterval($window.mailer._process, 1000);
    }
    $script.src = "https://cdn.emailjs.com/dist/email.min.js";
    $script.type = "text/javascript";
    $document.getElementsByTagName('head')[0].appendChild($script);
})(document, window);
