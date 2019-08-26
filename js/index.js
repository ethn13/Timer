// Global app controller

var timerController = (function() {
    var timeData =  {
        milisecond: 0,
        second: 0,
        secondUnfixed: 0,
        minute: 0,
        hour: 0
    }
    // 計算進位的商數和餘數的函數
    var carryNum = function(targetNum, carryNum) {
        const integerPart = Math.floor(targetNum / carryNum);
        const remainIntegerPart = targetNum - integerPart * carryNum;
        return [integerPart, remainIntegerPart];
    }
    

    return {
        calcTime: function(startTime) {
            let time, time1;
            const now = Date.now();
            time = (now - startTime);
            time1 = time / 1000;
            
            timeData.secondUnfixed = time1.toString().split('.')[0];
            timeData.secondUnfixed = parseFloat(timeData.secondUnfixed);
            let milisecond = time1.toString().split('.')[1];
            milisecond = parseFloat(milisecond);
            if(milisecond) {
                timeData.milisecond = milisecond;
            }else {
                timeData.milisecond = 0;
            }

            timeData.minute = carryNum(timeData.secondUnfixed, 60)[0];
            timeData.second = carryNum(timeData.secondUnfixed, 60)[1];

        },
        getTimeData: function() {
            return timeData;
        },
        cleatTimeData: function() {
            timeData.milisecond = 0;
            timeData.second = 0;
            timeData.secondUnfixed = 0;
            timeData.minute = 0;
            timeData.hour = 0;
        }
    }
})();


var UIController = (function() {
    var elements = {
        startBtn: document.querySelector('.timer__start'),
        timeText: document.querySelector('.timer__text'),
        pauseBtn: document.querySelector('.timer__pause'),
        resetBtn: document.querySelector('.timer__reset')
    }
    var fixZero = function(num) {
        if(num < 10) {
            return `0${num}`;
        }
        return num;
    }
    var fixZero3 = function(num) {
        if(num < 10) {
            return `00${num}`;
        }else if(num >= 10 && num < 100) {
            return `0${num}`;
        }else {
            return num;
        }
    }
    return {
        getElements: function() {
            return elements;
        },
        renderTimerText: function(hour, minute, second, milisecond) {
            elements.timeText.textContent = `${hour}:${fixZero(minute)}:${fixZero(second)}:${fixZero3(milisecond)}`;
        },
        clearTimerText: function() {
            elements.timeText.textContent = '0:00:00:000';
        }
    }
})();

var controller = (function(timerControl, UIControl) {
    var DOM = UIControl.getElements();
    var start = -1;
    var t;
    var setEventListeners = function() {
        DOM.startBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if(start === -1) {
                start = Date.now();
            }
            
            controlTimer(start);
            DOM.pauseBtn.style.display = 'inline';
            DOM.startBtn.style.display = 'none';
        });
        DOM.pauseBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if(t) {
                clearInterval(t);
            }
            DOM.pauseBtn.style.display = 'none';
            DOM.startBtn.style.display = 'inline';
        });
        DOM.resetBtn.addEventListener('click', function(e) {
            e.preventDefault();
            // pause
            if(t) {
                clearInterval(t);
            }
            // reset starting time
            start = -1;
            // clear UI
            UIControl.clearTimerText();
            // clear timer data
            timerControl.cleatTimeData();
        })
    }

    var controlTimer = function(startTime) {
            var time;
            t = setInterval(function() {
                        timerControl.calcTime(startTime);
                        time = timerControl.getTimeData();
                        UIControl.renderTimerText(time.hour, time.minute, time.second, time.milisecond);
                    }, 0, startTime);

    }

    return {
        init: function() {
            setEventListeners();
        }
    }
})(timerController, UIController);

controller.init();
