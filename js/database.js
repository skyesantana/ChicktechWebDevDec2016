(function ($document, $window) {
    var keyPrefix = btoa($window.location.hostname != ""
        ? $window.location.hostname
        : $window.location.pathname);

    function Database () {
        var queue = [];

        function enqueue (op, key, value) {
            var item = {
                    callback: function() {},
                    command: {
                        key: key,
                        op: op,
                        value: value
                    }
                },
                promise = {
                    then: function (callback) {
                        item.callback = callback;
                    }
                };

            queue.push(item);

            return promise;
        }

        function firebaseDatabase () {
            return $window.firebase.app().database().ref();
        }

        return {
            _process: function () {
                var item = queue.pop();
                if (item == null) return;

                var command = item.command;

                switch (command.op) {
                    case 'GET':
                        firebaseDatabase()
                            .child(keyPrefix)
                            .child(command.key)
                            .once('value')
                            .then(function (snapshot) {
                                item.callback(snapshot.val());
                            });
                        break;
                    case 'REMOVE':
                        firebaseDatabase()
                            .child(keyPrefix)
                            .child(command.key)
                            .remove()
                            .then(function (snapshot) {
                                item.callback();
                            });
                        break;
                    case 'SET':
                        firebaseDatabase()
                            .child(keyPrefix)
                            .child(command.key)
                            .set(command.value)
                            .then(function (snapshot) {
                                item.callback();
                            });
                        break;
                }
            },
            get: function (key) {
                return enqueue('GET', key, null);
            },
            remove: function (key) {
                return enqueue('REMOVE', key, null);
            },
            set: function (key, value) {
                return enqueue('SET', key, value);
            }
        }
    }

    $window.database = Database();

    var $script = $document.createElement('script');
    $script.async = true;
    $script.onload = function () {
        var config = {
            apiKey: "AIzaSyCXnkJu8q2s_G7rmxOXkRvn1VY4RUFXn_g",
            authDomain: "chicktechwebdevdec2016.firebaseapp.com",
            databaseURL: "https://chicktechwebdevdec2016.firebaseio.com",
            storageBucket: "chicktechwebdevdec2016.appspot.com",
            messagingSenderId: "1084905412239"
        };
        $window.firebase.initializeApp(config);
        window.setInterval($window.database._process, 10);
    }
    $script.src = "https://www.gstatic.com/firebasejs/3.6.2/firebase.js";
    $script.type = "text/javascript";
    $document.getElementsByTagName('head')[0].appendChild($script);
})(document, window);
