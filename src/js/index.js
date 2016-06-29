(function () {
    var node = document.getElementById('main-form');
    var balance = node.getElementsByTagName('span')[0];
    var balanceCurrent = 123;

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
            ActivateAction(action, button);
        });
    }

    function ActivateAction(action, button){
        var times = +action.recovery_time;
        button.setAttribute('disabled', 'disabled');
        balanceCurrent += (+action.points);
        balance.innerHTML = balanceCurrent ;
        button.innerHTML = timer(times);

        var timerId = setInterval(function() {
            times--;
            button.innerHTML = timer(times);
        }, 1000);

        setTimeout(function() {
            clearInterval(timerId);
            button.disabled = false;
            button.innerHTML = "&nbsp;";
        }, times*1000);
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

    // возвращает строку таймера
    function timer (srcTime){
        var secInHours = 3600;
        var secInMinutes = 60;
        var time = srcTime;
        var hours = Math.floor(time/secInHours);
        var minutes = Math.floor(( time % secInHours ) / secInMinutes);
        var seconds = time - minutes*secInMinutes - hours*secInHours;
        var timer;

        hours = hours === 0 ? '' : (hours < 10 ? '0' + hours + ':': '' + hours + ':');
        minutes = minutes < 10 ? '0' + minutes + ':' :  + minutes + ':';
        seconds = seconds < 10 ? '0' + seconds : '' + seconds;
        timer = hours + minutes + seconds;
        return timer;
    }

    Init();
})();