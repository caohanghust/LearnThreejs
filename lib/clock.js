/**
 * @file   canvas 绘制钟表
 * @author caohang (caohanghust@gmail.com)
 * @date   2017/5/18
 */

var Clock = function (canvasId) {
    var canvas = document.getElementById(canvasId);
    var dpr = window.devicePixelRatio || 1;
    canvas.setAttribute('width', canvas.clientWidth * dpr);
    canvas.setAttribute('height', canvas.clientHeight * dpr);
    this.ctx = canvas.getContext('2d');
    this.canvasInfo = {
        width: canvas.width,
        height: canvas.height,
        top: canvas.offsetTop,
        left: canvas.offsetLeft
    };
    this.clockInfo = {
        x: this.canvasInfo.width / 2,
        y: this.canvasInfo.height / 2,
        lineWidth: this.canvasInfo.width / 300 * 5,
        radius: this.canvasInfo.height / 2 - (this.canvasInfo.width / 300 * 5 / 2)
    }
};
Clock.prototype.drawCircle = function () {
    this.ctx.lineWidth = this.clockInfo.lineWidth;
    this.ctx.strokeStyle = "#f36";
    this.ctx.beginPath(); // 开一条新路
    this.ctx.arc(this.clockInfo.x, this.clockInfo.y, this.clockInfo.radius, 0, 2 * Math.PI);
    this.ctx.stroke(); // 画圆
};
Clock.prototype.drawCalibration = function () {
    var baseLength = this.clockInfo.radius / 15;
    this.ctx.lineWidth = this.clockInfo.lineWidth / 2;
    this.ctx.strokeStyle = "#f36";
    var calibrationLength = baseLength;
    for (var i = 1; i <= 60; i++) {
        if (i % 5 === 0) {
            calibrationLength = 2 * baseLength;
        }
        else {
            calibrationLength = baseLength;
        }
        this.ctx.beginPath();
        var startPoint = {
            x: this.clockInfo.x + Math.sin(Math.PI / 30 * i) * this.clockInfo.radius,
            y: this.clockInfo.y + Math.cos(Math.PI / 30 * i) * this.clockInfo.radius,
        };
        var endPoint = {
            x: startPoint.x - Math.sin(Math.PI / 30 * i) * calibrationLength,
            y: startPoint.y - Math.cos(Math.PI / 30 * i) * calibrationLength
        };
        this.ctx.moveTo(startPoint.x, startPoint.y);
        this.ctx.lineTo(endPoint.x, endPoint.y);
        this.ctx.stroke();
    }
    this.ctx.beginPath();
    this.ctx.fillStyle = "#f36";
    this.ctx.arc(this.clockInfo.x, this.clockInfo.y, this.clockInfo.radius / 30, 0, Math.PI * 2);
    this.ctx.fill();
};
Clock.prototype.drawNum = function () {
    var baseLength = this.clockInfo.radius / 15;
    var fontSize = this.clockInfo.radius / 5;
    this.ctx.fillStyle = '#999';
    this.ctx.textAlign = 'center';
    this.ctx.font = fontSize + 'px Airal';
    for (var i = 1; i <= 12; i++) {
        var textPosition = {
            x: this.clockInfo.x - Math.sin(Math.PI / 6 * i - Math.PI) * (this.clockInfo.radius - fontSize),
            y: this.clockInfo.y + Math.cos(Math.PI / 6 * i - Math.PI) * (this.clockInfo.radius - fontSize) + fontSize / 2.5
        };
        this.ctx.fillText(i , textPosition.x, textPosition.y);
    }
};
Clock.prototype.drawPointer = function (time) {
    var self = this;
    var hourPointer = {
        startX: self.clockInfo.x + Math.sin(Math.PI / 6 * time.hour - Math.PI) * self.clockInfo.radius / 15,
        startY: self.clockInfo.y - Math.cos(Math.PI / 6 * time.hour - Math.PI) * self.clockInfo.radius / 15,
        endX: self.clockInfo.x - Math.sin(Math.PI / 6 * time.hour - Math.PI) * self.clockInfo.radius / 3,
        endY: self.clockInfo.y + Math.cos(Math.PI / 6 * time.hour - Math.PI) * self.clockInfo.radius / 3,
        width: self.clockInfo.radius / 30
    };
    var minPointer = {
        startX: self.clockInfo.x + Math.sin(Math.PI / 30 * time.min - Math.PI) * self.clockInfo.radius / 15,
        startY: self.clockInfo.y - Math.cos(Math.PI / 30 * time.min - Math.PI) * self.clockInfo.radius / 15,
        endX: self.clockInfo.x - Math.sin(Math.PI / 30 * time.min - Math.PI) * self.clockInfo.radius / 2,
        endY: self.clockInfo.y + Math.cos(Math.PI / 30 * time.min - Math.PI) * self.clockInfo.radius / 2,
        width: self.clockInfo.radius / 40
    };
    var secPointer = {
        startX: self.clockInfo.x + Math.sin(Math.PI / 30 * time.sec - Math.PI) * self.clockInfo.radius / 10,
        startY: self.clockInfo.y - Math.cos(Math.PI / 30 * time.sec - Math.PI) * self.clockInfo.radius / 10,
        endX: self.clockInfo.x - Math.sin(Math.PI / 30 * time.sec - Math.PI) * self.clockInfo.radius / 1.5,
        endY: self.clockInfo.y + Math.cos(Math.PI / 30 * time.sec - Math.PI) * self.clockInfo.radius / 1.5,
        width: self.clockInfo.radius / 50
    };
    // 时针
    this.ctx.lineWidth = hourPointer.width;
    this.ctx.beginPath();
    this.ctx.moveTo(hourPointer.startX, hourPointer.startY);
    this.ctx.lineTo(hourPointer.endX, hourPointer.endY);
    this.ctx.stroke();
    // 分针
    this.ctx.lineWidth = minPointer.width;
    this.ctx.beginPath();
    this.ctx.moveTo(minPointer.startX, minPointer.startY);
    this.ctx.lineTo(minPointer.endX, minPointer.endY);
    this.ctx.stroke();
    // 秒针
    this.ctx.lineWidth = secPointer.width;
    this.ctx.beginPath();
    this.ctx.moveTo(secPointer.startX, secPointer.startY);
    this.ctx.lineTo(secPointer.endX, secPointer.endY);
    this.ctx.stroke();
};
Clock.prototype.draw = function () {
    this.ctx.clearRect(0, 0, this.canvasInfo.width, this.canvasInfo.height);
    this.drawCircle();
    this.drawCalibration();
    this.drawNum();
    this.drawPointer(this.getTime(new Date()));
};
Clock.prototype.getTime = function (date) {
    if (date instanceof Date) {
        return {
            hour: date.getHours() > 12 ? date.getHours() - 12 : date.getHours(),
            min: date.getMinutes(),
            sec: date.getSeconds()
        }
    }
    return {
        hour: 0,
        min: 0,
        sec: 0
    }
};
Clock.prototype.startTiming = function () {
    var self = this;
    this.timeFlag = setInterval(function () {
        self.draw();
    }, 1000);
};