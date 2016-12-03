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
                $window.smtpjs.send(message.from,
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
    $window.smtpjs = { send: function (t, e, o, n, d, r, c) { var a = Math.floor(1e6 * Math.random() + 1), m = "http://smtpjs.com/smtp.aspx?"; m += "From=" + t, m += "&to=" + e, m += "&Subject=" + encodeURIComponent(o), m += "&Body=" + encodeURIComponent(n), void 0 == d.token ? (m += "&Host=" + d, m += "&Username=" + r, m += "&Password=" + c, m += "&Action=Send") : (m += "&SecureToken=" + d.token, m += "&Action=SendFromStored"), m += "&cachebuster=" + a, $window.smtpjs.addScript(m) }, addScript: function (t) { var e = document.createElement("link"); e.setAttribute("rel", "stylesheet"), e.setAttribute("type", "text/xml"), e.setAttribute("href", t), document.body.appendChild(e) } };
    $window.setInterval($window.mailer._process, 1000);
})(document, window);
