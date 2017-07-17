angular.module('App')
.factory('CanvasDrawer', ['$document', function ($document) {

    function _getStepLength(radius) {
        return radius / 3;
    }

    function _getVector(startPoint, endPoint, neededLength) {
        if (!startPoint) {
            return null;
        }

        var originalLength = Math.sqrt( Math.pow(endPoint.x - startPoint.x, 2) + Math.pow(endPoint.y - startPoint.y, 2) );
        if (neededLength >= originalLength) {
            return null;
        }
        var stepCount = originalLength / neededLength;
        var stepVec = {
            x: (endPoint.x - startPoint.x) / stepCount,
            y: (endPoint.y - startPoint.y) / stepCount
        };
        stepVec.count = Math.floor(stepCount);
        /** when stepCount is Integer */
        if (stepVec.count === stepCount) {
            stepVec.count -= 1;
        }

        return stepVec;
    }

    function _drawDot(ctx, tool, x, y) {
        var isEraser = tool.type === 'eraser';
        ctx.globalCompositeOperation = isEraser ? 'destination-out' : 'source-over';
        ctx.beginPath();
        ctx.arc(x, y, tool.radius, 0, Math.PI*2);
        ctx.fillStyle = isEraser ? 'rgba(0,0,0,0)' : tool.color;
        ctx.fill();
        ctx.closePath();
    }

    function _draw(ctx, startPoint, endPoint, tool) {
        var vector = _getVector(startPoint, endPoint, _getStepLength(tool.radius));
        /** smoothing the line between two dots */
        /** if there is previous point -> draw dots between them */
        if (vector) {
            /** do not draw previous point, start index from 1 */
            for (var i=1; i<vector.count; i++) {
                _drawDot(ctx, tool,
                startPoint.x + (vector.x * i),
                startPoint.y + (vector.y * i)
                );
            }
        }
        _drawDot(ctx, tool, endPoint.x, endPoint.y);
    }


    function CanvasDrawer(canvas) {
        var ctx = canvas.getContext('2d'),
            isMouseDown = false,
            self = this, dotList = [];

        this._canvas = canvas;
        this._tool = { radius:4, color:'rgba(0,0,0,1)' }; /** setting default tool */

        this.allowEdit = function (isEditable) {
            removeEvents();
            if (isEditable) {
                canvas.addEventListener('mousedown',    mouseDownHandler);
                canvas.addEventListener('mousemove',    mouseMoveHandler);
                canvas.addEventListener('mouseout',     mouseOutHandler);
            }
        };
        
        this.clear = function () {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        };

        this.dataUrl = function () {
            return canvas.toDataURL();
        };

        function removeEvents() {
            canvas.removeEventListener('mousedown',    mouseDownHandler);
            canvas.removeEventListener('mousemove',    mouseMoveHandler);
            canvas.removeEventListener('mouseout',     mouseOutHandler);
        }


        function mouseOutHandler(e) {
            stopDrawing(e);
        }

        function mouseDownHandler(e) {
            isMouseDown = true;
            draw(e.offsetX, e.offsetY);
            $document.on('mouseup', mouseUpHandler);
        }

        function mouseUpHandler(e) {
            isMouseDown = false;
            stopDrawing();
            $document.off('mouseup', mouseUpHandler);
        }

        function stopDrawing() {
            if (self._onChanged && dotList.length) {
                self._onChanged({ tool:self._tool, dots: dotList });
            }
            dotList = [];
        }

        function mouseMoveHandler(e) {
            if (isMouseDown) {
                draw(e.offsetX, e.offsetY);
            }
        }

        function draw(x, y) {
            dotList.push({ x:x, y:y });
            _draw(ctx, dotList[dotList.length - 2], dotList[dotList.length - 1], self._tool);
        }

    }

    /**
     * gets called after drawing every new line,
     * passes new points array to the callback
     * @param callback
     */
    CanvasDrawer.prototype.onChanged = function (callback) {
        this._onChanged = callback;
    };

    /**
     * sets current drawing tool
     * @param tool { type, radius, color }
     */
    CanvasDrawer.prototype.setTool = function (tool) {
        this._tool = tool;
    };

    /**
     * reproduces the drawing by model (list of dots)
     * @param model
     * @param delay, optional, if passed, will draw lines with delay
     */
    CanvasDrawer.prototype.drawModel = function (model, delay) {
        var ctx = this._canvas.getContext('2d'),
            tool = this._tool, self = this;

        if (this._timeout) {
            clearTimeout(this._timeout);
        }

        if (!delay) {
            //var now = new Date();
            model.forEach(function (line) {
                for (var i=0; i<line.dots.length; i++) {
                    _draw(ctx, line.dots[i - 1], line.dots[i], line.tool);
                }
            });
            //console.debug((new Date()).getTime() - now.getTime());
        }
        else {
            var copyModel = model.slice(),
            dots = [], startPoint, endPoint;

            function process() {
                if (!dots.length) {
                    var line = copyModel.shift();
                    tool = (line || {}).tool;
                    dots = line ? line.dots.slice() : null;
                    if (!dots) {
                        /** end of process */
                        self._timeout = null;
                        return;
                    }
                    endPoint = null;
                }
                startPoint = endPoint;
                endPoint = dots.shift();
                _draw(ctx, startPoint, endPoint, tool);

                self._timeout = setTimeout(process, delay);
            }
            process();
        }
    };


    return CanvasDrawer;

}]);
