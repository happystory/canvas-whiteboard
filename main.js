(function() {
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    var colors = document.getElementsByClassName('color');
    var pen = document.getElementById('pen');
    var eraser = document.getElementById('eraser');
    var clear = document.getElementById('clear');
    var download = document.getElementById('download');

    var current = {
        color: 'black'
    };
    var drawing = false;
    var eraserEnabled = false;

    // 绑定事件
    if ('ontouchstart' in document.documentElement) {
        // Mobile
        canvas.addEventListener('touchstart', onTouchStart, false);
        canvas.addEventListener('touchmove', onTouchMove, false);
        canvas.addEventListener('touchend', onTouchEnd, false);
    } else {
        // PC
        canvas.addEventListener('mousedown', onMouseDown, false);
        canvas.addEventListener('mouseup', onMouseUp, false);
        canvas.addEventListener('mouseout', onMouseUp, false);
        canvas.addEventListener('mousemove', throttle(onMouseMove, 10), false);
    }

    for (var i = 0; i < colors.length; i++) {
        colors[i].addEventListener('click', onColorUpdate, false);
    }

    pen.addEventListener('click', function(e) {
        eraserEnabled = false
        this.classList.add('active')
        eraser.classList.remove('active')
    }, false);

    eraser.addEventListener('click', function(e) {
        eraserEnabled = true
        this.classList.add('active')
        pen.classList.remove('active')
    }, false);

    clear.addEventListener('click', function(e) {
        context.clearRect(0, 0, canvas.width, canvas.height)
    }, false);

    download.addEventListener('click', function(e) {
        var url = canvas.toDataURL("image/png")
        var a = document.createElement('a')
        document.body.appendChild(a)
        a.href = url
        a.target = '_blank'
        a.download = 'canvas'
        a.click()
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

    function onTouchStart(e) {
        drawing = true;
        current.x = e.touches[0].clientX;
        current.y = e.touches[0].clientY;
    }

    function onTouchEnd(e) {
        if (!drawing) { return; }
        drawing = false;
        drawLine(current.x, current.y, e.clientX, e.clientY, current.color);
    }

    function onTouchMove(e) {
        if (!drawing) { return; }

        // 是否开启橡皮擦
        if (eraserEnabled) {
            context.clearRect(current.x - 5, current.y - 5, 10, 10)
        } else {
            drawLine(current.x, current.y, e.touches[0].clientX, e.touches[0].clientY, current.color);
        }
        current.x = e.touches[0].clientX;
        current.y = e.touches[0].clientY;
    }

    function onColorUpdate(e) {
        current.color = e.target.className.split(' ')[1];
        var colors = e.target.parentNode.children
        for (var i = 0;i < colors.length; i++) {
            colors[i].classList.remove('active')
        }
        e.target.classList.add('active')
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