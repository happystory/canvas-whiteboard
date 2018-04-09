(function() {
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    var colors = document.getElementsByClassName('color');

    var current = {
        color: 'black'
    };
    var drawing = false;
    var eraserEnabled = false;

    // 绑定事件
    canvas.addEventListener('mousedown', onMouseDown, false);
    canvas.addEventListener('mouseup', onMouseUp, false);
    canvas.addEventListener('mouseout', onMouseUp, false);
    canvas.addEventListener('mousemove', throttle(onMouseMove, 10), false);

    for (var i = 0; i < colors.length; i++) {
        colors[i].addEventListener('click', onColorUpdate, false);
    }

    document.getElementById('eraser').addEventListener('click', function(e) {
        eraserEnabled = !eraserEnabled
        e.target.textContent = eraserEnabled ? '橡皮擦' : '画笔';
    }, false);

    window.addEventListener('resize', onResize, false);
    onResize();

    // 画线
    function drawLine(x0, y0, x1, y1, color) {
        context.beginPath();
        context.moveTo(x0, y0);
        context.lineTo(x1, y1);
        context.strokeStyle = color;
        context.lineWidth = 5;
        context.stroke();
        context.closePath();
    }

    function onMouseDown(e) {
        drawing = true;
        current.x = e.clientX;
        current.y = e.clientY;
    }

    function onMouseUp(e) {
        if (!drawing) { return; }
        drawing = false;
        drawLine(current.x, current.y, e.clientX, e.clientY, current.color);
    }

    function onMouseMove(e) {
        if (!drawing) { return; }

        // 是否开启橡皮擦
        if (eraserEnabled) {
            context.clearRect(current.x - 5, current.y - 5, 10, 10)
        } else {
            drawLine(current.x, current.y, e.clientX, e.clientY, current.color);
        }
        current.x = e.clientX;
        current.y = e.clientY;
    }

    function onColorUpdate(e) {
        current.color = e.target.className.split(' ')[1];
    }

    // limit the number of events per second
    function throttle(callback, delay) {
        var previousCall = new Date().getTime();
        return function() {
            var time = new Date().getTime();
            if ((time - previousCall) >= delay) {
                previousCall = time;
                callback.apply(null, arguments);
            }
        };
    }

    // make the canvas fill its parent
    function onResize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
})();