function CanvasAnimation(canvas, options) {
  // ============== 辅助函数 =================
  window.requestAnimFrame = (function() {
    return (
      window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function(
        /* function FrameRequestCallback */ callback /* DOMElement Element */,
        element
      ) {
        return window.setTimeout(callback, 1000 / 60);
      }
    );
  })();

  var extend = function(o, n) {
    for (var p in n) {
      if (n.hasOwnProperty(p) && o.hasOwnProperty(p)) {
        o[p] = n[p];
      }
    }
  };

  this.delay = (function() {
    var timer = 0;
    return function(callback, ms) {
      clearTimeout(timer);
      timer = setTimeout(callback, ms);
    };
  })();
  // ========================================
  this.opts = {
    width: document.body.clientWidth,
    height: document.body.clientHeight,
    dt: 1000 / 180
  };
  console.log(this.opts);
  extend(this.opts, options);

  canvas.width = this.opts.width;
  canvas.height = this.opts.height;

  this.objs = {};
  this.objs.canvas = canvas;
  this.objs.context = canvas.getContext("2d");
  this.objs.canvasElement = [];
  this.objs.lastTime = 0;
  this.objs.acc = 0;
  this.objs.isRunning = false;

  var that = this;
  this.mainLoop = function() {
    if (that.objs.isRunning) {
      window.requestAnimationFrame(that.mainLoop);
    }

    var now = Date.now();
    var deltaTime = now - that.objs.lastTime;
    that.objs.lastTime = now;
    that.objs.acc += deltaTime;

    while (that.objs.acc >= that.opts.dt) {
      update(that.opts.dt);
      that.objs.acc -= that.opts.dt;
    }
    draw(deltaTime);
    cleanup();
  };

  function update(deltatime) {
    that.objs.canvasElement.forEach(function(item) {
      item.update(deltatime);
    });
  }

  function draw(deltatime) {
    that.objs.context.clearRect(0, 0, that.opts.width, that.opts.height);
    that.objs.canvasElement.forEach(function(item) {
      item.draw(deltatime, that.objs.context);
    });
  }

  function cleanup() {
    for (var i = that.objs.canvasElement.length - 1; i >= 0; i--) {
      if (that.objs.canvasElement[i].isDead()) {
        that.objs.canvasElement.splice(i, 1);
      }
    }
  }
}

CanvasAnimation.prototype.getHeight = function() {
  return this.opts.height;
};

CanvasAnimation.prototype.getWidth = function() {
  return this.opts.width;
};

CanvasAnimation.prototype.withSize = function(width, height) {
  this.opts.width = width;
  this.opts.height = height;

  this.objs.canvas.width = width;
  this.objs.canvas.height = height;

  var that = this;
  this.delay(function() {
    that.objs.canvasElement.forEach(function(item) {
      item.resize(width, height);
    });
  }, 200);
};

CanvasAnimation.prototype.start = function() {
  this.objs.canvasElement.forEach(function(item) {
    item.init();
  });
  this.objs.isRunning = true;
  this.objs.lastTime = Date.now();
  this.mainLoop();
};

CanvasAnimation.prototype.addSpirit = function(spirit) {
  this.objs.canvasElement.push(spirit);
};

//================管理器=====================

function getRandomColor() {
  var colorArr = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "a",
    "b",
    "c",
    "d",
    "e",
    "f"
  ];
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += colorArr[parseInt(Math.random() * 16)];
  }
  return color;
}

function Manager(canvasWidth, canvasHeight) {
  // 球球
  this._balls = {
    opts: {
      nums: 20, // 球球数量
      defaultSpeed: 0.3, // 球球运动基础速度
      variantSpeed: 0.3, // 球球运动速度的变量
      defaultRadius: 10, // 球球初始半径
      variantRadius: 10, // 球球变化半径
      protectedAge: 200, // 保护周期
      // G: 0.01, // 万有引力常数
      // colors: [
      //   "rgba(217,182,17, 0.4)",
      //   "rgba(189,221,34, 0.4)",
      //   "rgba(0,224,158, 0.4)",
      //   "rgba(204,164,227, 0.4)",
      //   "rgba(62,237,231, 0.4)",
      //   "rgba(72, 232, 186, 0.4)",
      //   "rgba(224,240,233, 0.3)"
      // ]
      colors: new Array(10).fill().map((v, i) => {
        return getRandomColor();
      })
    },
    list: []
  };
  this._balls.list = [];

  this.width = canvasWidth;
  this.height = canvasHeight;
}
Manager.prototype.newBall = function(x, y, size) {
  var speed =
    this._balls.opts.defaultSpeed +
    this._balls.opts.variantSpeed * Math.random();
  var directionAngle = Math.floor(Math.random() * 360);
  var lsize, radius;
  if (!x) {
    x = Math.random() * this.width;
  }
  if (!y) {
    y = Math.random() * this.height;
  }
  if (!size) {
    radius =
      this._balls.opts.defaultRadius +
      Math.random() * this._balls.opts.variantRadius;
    lsize = radius * radius * Math.PI;
  } else {
    lsize = size;
    radius = Math.sqrt(lsize / Math.PI);
  }
  return {
    type: "ball",
    x: x,
    y: y,
    vx: speed * Math.cos(directionAngle),
    vy: speed * Math.sin(directionAngle),
    size: lsize,
    radius: radius,
    isDead: false,
    age: 0,
    color: this._balls.opts.colors[
      Math.round(Math.random() * this._balls.opts.colors.length)
    ]
  };
};
Manager.prototype.newFood = function() {
  var radius =
    this._foods.opts.defaultRadius +
    Math.random() * this._foods.opts.variantRadius;
  var size = radius * radius * Math.PI;
  return {
    type: "food",
    x: Math.random() * this.width,
    y: Math.random() * this.height,
    size: size,
    radius: radius,
    isDead: false
  };
};
Manager.prototype.newPrick = function() {
  var radius =
    this._prick.opts.defaultRadius +
    Math.random() * this._prick.opts.variantRadius;
  var size = radius * radius * Math.PI;
  return {
    type: "prick",
    x: Math.random() * this.width,
    y: Math.random() * this.height,
    size: size,
    radius: radius,
    isDead: false
  };
};
Manager.prototype.init = function() {
  // 初始化球球
  for (var i = 0; i < this._balls.opts.nums; i++) {
    this._balls.list.push(this.newBall());
  }
};
Manager.prototype.update = function(deltatime) {
  // 更新球球的位置
  for (var i = 0; i < this._balls.list.length; i++) {
    var ball = this._balls.list[i];
    ball.age++;
    ball.x += ball.vx;
    ball.y += ball.vy;
    if (ball.x + ball.radius < 0) {
      ball.x = this.width + ball.radius;
    } else if (ball.x > this.width + ball.radius) {
      ball.x = -ball.radius;
    }
    if (ball.y + ball.radius < 0) {
      ball.y = this.height + ball.radius;
    } else if (ball.y > this.height + ball.radius) {
      ball.y = -ball.radius;
    }
  }

  // 清理球球
  for (var j = 0; j < this._balls.list.length; j++) {
    if (this._balls.list[j].isDead) {
      this._balls.list.splice(j, 1);
    }
  }
};
Manager.prototype.draw = function(deltatime, ctx) {
  // 背景网格
//   ctx.lineWidth = 1;
//   ctx.strokeStyle = "#F2f2f2";
//   ctx.beginPath();
//   for (var i = 0; i <= this.width; i += 25) {
//     ctx.moveTo(i, 0);
//     ctx.lineTo(i, this.height);
//   }
//   for (var l = 0; l <= this.height; l += 25) {
//     ctx.moveTo(0, l);
//     ctx.lineTo(this.width, l);
//   }
//   ctx.stroke();

  for (var k = 0; k < this._balls.list.length; k++) {
    var ball = this._balls.list[k];
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fillStyle = ball.color;
    ctx.fill();
  }
};
Manager.prototype.resize = function(width, height) {
  this.width = width;
  this.height = height;
};
Manager.prototype.isDead = function() {
  return false;
};

document.addEventListener("DOMContentLoaded", function() {
  var canvas = document.createElement("canvas");
  canvas.id = "canvas";
  canvas.className = "canvas"
  var body = document.body;
  var container = document.getElementsByClassName("container")[0];
  body.insertBefore(canvas, container);
  var manager = new Manager(window.innerWidth, window.innerHeight);
  var animator = new CanvasAnimation(document.getElementById("canvas"), {
    width: document.body.offsetWidth ,
    height: parseInt(document.documentElement.scrollHeight)+parseInt(document.body.scrollTop)
  });
  animator.addSpirit(manager);
  animator.start();
  window.addEventListener(
    "resize",
    function() {
      animator.withSize(window.innerWidth, window.innerHeight);
    },
    false
  );
});
