(function () {
    var node = document.getElementById('main-form');
    var balance = node.getElementsByTagName('span')[0];
    var balanceCurrent = 123;

    Init();

    function Init() {
        var buttons = node.getElementsByTagName('button');
        for (var i = 0 ; i < buttons.length; i++){
            buttons[i].onclick = function(){
                return GetActionByButtonId(this);
            };
        }
        balance.innerHTML = balanceCurrent;
    }

    function GetActionByButtonId(button){
        var action = {};
        getJSON('data/actions.json', function(resp){
            if (resp && resp.length > 0) {
                for (var i = 0; i < resp.length; i++) {
                    if (+resp[i].id === +button.id){
                        action = resp[i];
                        break;
                    }
                }
            }
            button.setAttribute('disabled', 'disabled');
            setTimeout(function(){
                button.disabled = false;
            }, 3000);

            MainRoutine(action);
        });
    }

    function MainRoutine(action){
        balanceCurrent += (+action.points);
        balance.innerHTML = balanceCurrent ;
        return action;
    }

    function getJSON(url, cb) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.onreadystatechange = function () {
            if (xhr.status !== 200 || xhr.readyState !== 4) return;
            cb(JSON.parse(xhr.responseText));
        };
        xhr.send();
    }
})();