require.config({
    paths: {
        jquery: '../lib/jquery/dist/jquery.min',
        watch: '../lib/watch/src/watch.min',
        userModel: '../js/store/models/user',
        modelStore: '../js/store/store',
        viewHelper: '../js/viewHelper',
        noty: '../lib/noty/js/noty/packaged/jquery.noty.packaged.min',
        socketio: '../lib/socket.io-client/socket.io'
    }
});

require(
    [
        'jquery',
        'modelStore',
        'viewHelper',
        'socketio'
    ],
    function($, modelStore, viewHelper, socketio) {

        var socket = socketio.connect('http://localhost:3000');
        socket.on('leaderboard', function (data) {
            console.log(data);
        });

        // Identifiers for model in modelStore's shelf. Could be made dynamic.
        var userAId = "UserA";
        var userBId = "UserB";

        // Initialize data binding
        bindElementsToModel(['inputRowA','followersA','retweetsA', 'favoritesA', 'horizonA'], userAId);
        bindElementsToModel(['inputRowB','followersB','retweetsB', 'favoritesB', 'horizonB'], userBId);
        function bindElementsToModel(elementIds, modelId){
            elementIds.forEach(function(e){
                rivets.bind($('#' + e)[0], {data: modelStore.getInstance().getModel(modelId)});
            });
        }
        viewHelper.getInstance(); //watches models and renders profile pics in dom

        // On completion of input, get associated twitter+horizon data
        watcher('#handleInputA', userAId);
        watcher('#handleInputB', userBId);
        function watcher(selector, modelId){
            var typingTimer;
            var doneTypingInterval = 1000;
            $(selector).keyup(function(){
                clearTimeout(typingTimer);
                if ($(selector).val) {
                    typingTimer = setTimeout(doneTyping, doneTypingInterval);
                }
            });
            function doneTyping () {
                modelStore.getInstance().getHandleData(modelId);
            }
        }

        // Disable second input until first profile horizon is calculated. viewHelper watches for it.
        $("#handleInputB")[0].disabled = true;

        // Show all initially hidden elements. Start hidden due to rivets loading.
        $(document).ready(function() {
            $(".hide").show();
        });
    }
);
