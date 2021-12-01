class App {
    constructor(x, y, r, m, speedX, speedY, color) {
        this.canvas = document.querySelector(".canvas");
        this.ctx = this.canvas.getContext("2d");
        
        this.circle;
        this.x = x;
        this.y = y;
        this.r = r;
        this.m = m;
        this.alpha = 0.2;

        this.speedX = speedX;
        this.speedY = speedY;
        this.color = color;

        this.nowX = 0;
        this.nowY = 0;
        this.nowR = 0;

        this.compX = 0;
        this.compY = 0;
        this.compR = 0;

        this.distX = 0;
        this.distY = 0;
        this.distance = 0;
        this.detectionFlag = false;
        this.detection = -1;

        this.resize();
        window.addEventListener("resize", this.resize.bind(this), false);
    }

    draw() {
        this.ctx.beginPath();
        this.ctx.strokeStyle = this.color;
        this.ctx.fillStyle = this.color;
        this.ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
        this.ctx.globalAlpha = this.alpha;
        this.ctx.stroke();
        this.ctx.fill();
    }
    resize() {
        this.canvas.width = document.body.clientWidth;
        this.canvas.height = document.body.clientHeight;
    }

    getCircle(circle) {
        this.circle = circle;
    }

    animate(t) {
        requestAnimationFrame(this.animate.bind(this));
        this.draw();
        this.collisionCheck();
        this.x += this.speedX;
        this.y += this.speedY;

        if(this.y + this.r > this.canvas.height){ // 바운드 처리
            this.y = this.canvas.height - this.r;
            this.speedY *= -1;
        } else if(this.y - this.r < 0) {
            this.y = this.r;
            this.speedY *= -1;
        }
        if(this.x > this.canvas.width - this.r ) {
            this.x = this.canvas.width - this.r;
            this.speedX *= -1;
        } else if (this.x - this.r < 0){
            this.x = this.r;
            this.speedX *= -1;
        }

    }
    resolveCollision(myCircle, targetCircle) {
        /*
        return [{
            speedX: ((myCircle.m - targetCircle.m) / (myCircle.m + targetCircle.m)) * myCircle.speedX + ((2 * targetCircle.m) / (myCircle.m + targetCircle.m)) * targetCircle.speedX,
            speedY: ((myCircle.m - targetCircle.m) / (myCircle.m + targetCircle.m)) * myCircle.speedY + ((2 * targetCircle.m) / (myCircle.m + targetCircle.m)) * targetCircle.speedY,
        }, {
            speedX: ((2 * myCircle.m) / (myCircle.m + targetCircle.m)) * myCircle.speedX + ((targetCircle.m - myCircle.m) / (myCircle.m + targetCircle.m)) * targetCircle.speedX,
            speedY: ((2 * myCircle.m) / (myCircle.m + targetCircle.m)) * myCircle.speedY + ((targetCircle.m - myCircle.m) / (myCircle.m + targetCircle.m)) * targetCircle.speedY
        }];
        */
       
        let xVelocityDiff = myCircle.speedX - targetCircle.speedX;
        let yVelocityDiff = myCircle.speedY - targetCircle.speedY;
    
        let xDist = targetCircle.x - myCircle.x;
        let yDist = targetCircle.y - myCircle.y;
    
        // Prevent accidental overlap of particles
        if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {
        
            let angle = -Math.atan2(targetCircle.y - myCircle.y, targetCircle.x - myCircle.x);

            let m1 = myCircle.m;
            let m2 = targetCircle.m;

            let u1 = this.rotate(myCircle, angle);
            let u2 = this.rotate(targetCircle, angle);

            let v1 = { speedX: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2), speedY: u1.y };
            let v2 = { speedX: u2.x * (m2 - m1) / (m1 + m2) + u1.x * 2 * m1 / (m1 + m2), speedY: u2.y };
            //console.log(v1, angle);

            let vFinal1 = this.rotate(v1, -angle);
            let vFinal2 = this.rotate(v2, -angle);

            //console.log(vFinal1);
            
            myCircle.speedX = vFinal1.x;
            myCircle.speedY = vFinal1.y;

            targetCircle.speedX = vFinal2.x;
            targetCircle.speedY = vFinal2.y;
        }
        
    }
    rotate(circle, angle) {
        return {
            x: circle.speedX * Math.cos(angle) - circle.speedY * Math.sin(angle),
            y: circle.speedX * Math.sin(angle) + circle.speedY * Math.cos(angle)
        };
    }

    collisionCheck() {
        this.detectionFlag = false;
        for(let i = 0; i < this.circle.length; i ++) {
            if(this.circle[i] == this) continue;
            
            this.nowX = this.x;
            this.nowY = this.y;
            this.nowR = this.r;

            this.compX = this.circle[i].x;
            this.compY = this.circle[i].y;
            this.compR = this.circle[i].r;

            this.distX = this.nowX - this.compX;
            this.distY = this.nowY - this.compY;
            this.distance = Math.pow(this.compX - this.nowX, 2) + Math.pow(this.nowY - this.compY, 2);

            if(this.distance <= Math.pow(this.nowR + this.compR, 2)) {
                this.detection = i;
                this.detectionFlag = true;
                break;
            }
            
        }
        if(this.detectionFlag == true) {
            //console.log("detection");
            this.resolveCollision(this, this.circle[this.detection]);

            
        }
    } 

    circleIn() {
        if(this.alpha <= 0.9) {
            this.alpha += 0.05;
        }
    }

    circleOut() {
        if(this.alpha > 0.2) {
            this.alpha -= 0.05;
        }
        //this.alpha = 0;
    }
}
class Clear {
    constructor() {
        this.canvas = document.querySelector(".canvas");
        this.ctx = this.canvas.getContext("2d");
    }
    animate(t) {
        requestAnimationFrame(this.animate.bind(this));
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
}

class MousePosCheck {
    constructor() {
        this.canvas = document.querySelector(".canvas");
        this.ctx = this.canvas.getContext("2d");
        this.circle;
        this.x = 0;
        this.y = 0;
        this.r = 200;
        this.detection = -1;
        this.detectionFlag = false;
        document.addEventListener("mousemove", this.mousemove.bind(this));
        document.addEventListener("wheel", this.wheel.bind(this));
    }

    getCircle(circle) {
        this.circle = circle;
    }

    draw() {
        this.ctx.beginPath();
        this.ctx.globalAlpha = 0.2;
        this.ctx.strokeStyle = "black";
        this.ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
        this.ctx.stroke();

    }
    mouseInCircle() {
        for(let i = 0; i < this.circle.length; i ++) {
            this.nowX = this.x;
            this.nowY = this.y;
            this.nowR = this.r;

            this.compX = this.circle[i].x;
            this.compY = this.circle[i].y;
            this.compR = this.circle[i].r;

            this.distX = this.nowX - this.compX;
            this.distY = this.nowY - this.compY;
            this.distance = Math.pow(this.compX - this.nowX, 2) + Math.pow(this.nowY - this.compY, 2);

            if(this.distance <= Math.pow(this.nowR + this.compR, 2)) {
                this.circle[i].circleIn();
            }
            else {
                this.circle[i].circleOut();
            }
        }
    }
    wheel(e) {
        if (e.wheelDelta > 0 || e.detail < 0) {
            // scroll up
            if(this.r > 10) {
                this.r -= 5;
            }
        }
        else {
            // scroll down
            if(this.r < 750) {
                this.r += 5;
            }
        }

    }

    animate(t) {
        requestAnimationFrame(this.animate.bind(this));
        this.draw();
        this.mouseInCircle();
        //console.log("animated", this.x, this.y);
    }

    mousemove(e) {
        this.x = e.clientX;
        this.y = e.clientY;
    }
}

class CollisionDetection {
    constructor(circle) {
        this.circle = circle;
        this.nowX = 0;
        this.nowY = 0;
        this.nowR = 0;

        this.compX = 0;
        this.compY = 0;
        this.compR = 0;

        this.distX = 0;
        this.distY = 0;
        this.distance = 0;

        this.detectionFlag = false;
        this.c1 = -1;
        this.c2 = -1;
    }

    animate(t) {
        requestAnimationFrame(this.animate.bind(this));
        this.detectionFlag = false;
        this.c1 = -1;
        this.c2 = -1;

      
    }
}

window.onload = () => {
    let gap = 200;
    let radius = 100;
    let circle = [];
    let colors = ["#EC7063", "#F5B7B1", "#3498DB", "#EB984E", "#82E0AA", "#C39BD3"]
    let canvas = document.querySelector(".canvas");
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;
    
    let ctx = canvas.getContext("2d");

    console.log(canvas.width);
    for(let j = 1; j <= Math.floor(canvas.height / (radius * 2 + gap)); j ++) {
        for(let i = 1; i <= Math.floor(canvas.width / (radius * 2 + gap)); i ++) {
            let xSpeed = getRandomInt(-5, 5);
            let ySpeed = getRandomInt(-5, 5);
            let mass = 5;
            let randomColor = getRandomInt(0, colors.length);

            circle.push(new App(i * radius * 2 + gap * i, j * radius * 2 + gap * j, radius, mass, xSpeed, ySpeed, colors[randomColor]));
        }
    }
    

    let clearCanvas = new Clear();
    clearCanvas.animate();


    circle.forEach(c => {
        c.getCircle(circle);
        c.animate(); 
    });

    let mousePosCheck = new MousePosCheck();
    mousePosCheck.getCircle(circle);
    mousePosCheck.animate();

    myTest();

}
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //최댓값은 제외, 최솟값은 포함
  }
function myTest() {
    //질량
    let m1 = 10;
    let m2 = 5;

    //충돌 전 속도
    let u1 = 10;
    let u2 = 0;

    console.log("충돌 전 속도 :", u1, u2);
    
    //충돌 후 속도
    let v1 = ((m1 - m2) / (m1 + m2)) * u1 + ((2 * m2) / (m1 + m2)) * u2;
    let v2 = ((2 * m1) / (m1 + m2)) * u1 + ((m2 - m1) / (m1 + m2)) * u2;

    console.log("충돌 후 속도 :", v1, v2);
    

    let an = Math.atan2(100, 200) * 180 / Math.PI;
    console.log("angle", an);
}