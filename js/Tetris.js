
class Tetris {
    constructor({el,width,height,blockCount, scoreBoardWidth, tetrominoes}) {
        this.canvas = el;
        this.ctx = el.getContext('2d');
        this.canvas.width =  width;
        this.canvas.height =  height;
        this.gameStatus = "home"; // home, playing, over, paused
        this.scoreBoardWidth = !!scoreBoardWidth ? scoreBoardWidth : 320;
        this.score = 0;
        this.boardGameWidth = width - this.scoreBoardWidth;
        this.speed = 0.5;
        this.tetrominoShapes = !!tetrominoes ? tetrominoes : [];
        this.tetrominoes = [];
        this.blockCount = !!blockCount ? blockCount : {
            x: 12,
            y:15
        };
        this.blockSettings = {
            width: (width-this.scoreBoardWidth) / this.blockCount.x,
            height: height / this.blockCount.y,
            emptyColor: '#2c3e50',
            borderColor: "#34495e"
        };
        this.homePopupBox = {
            x: this.boardGameWidth*1/4,
            y: 100,
            w: this.boardGameWidth/2,
            h: 150,
        }
        this.btnStart = {
            text: "Start",
            textX: this.homePopupBox.x + this.homePopupBox.w/2 - this.ctx.measureText("Start").width,
            textY: this.homePopupBox.y + 100,
            background: "#218eff",
            x: this.homePopupBox.x + this.homePopupBox.w*1/4, 
            y: 170, 
            w: this.homePopupBox.w/2, 
            h: 50
        };
        // this.events();
        this.blocks = [];
        console.log(this.blockSettings);
        this.events();
        this.generateBlocks();
        console.log("tetrominoes", this.tetrominoes)
    }

    generateBlocks() {
        for(var i = 0; i < this.blockCount.y; i++){
            let blockCol = [];

            for(var j = 0; j < this.blockCount.x; j++){
                blockCol.push({
                    x: j * this.blockSettings.width,
                    y: i * this.blockSettings.height,
                    color: this.blockSettings.emptyColor,
                })
            }
            this.blocks.push(blockCol);
        }
        console.log(this.blocks);
    }

    start() {
        this.gameStatus = 'playing';
    }

    draw() {
        this.drawScoreBoard();
        this.drawGameScreen();
        
        switch(this.gameStatus) {
            case 'home':
                this.drawHomePopup();
                break;
            case 'over':
                this.drawGameOverPopup();
                break;
            default:
                break;
        }
    }
    drawScoreBoard() {
        let scoreBoardX = this.canvas.width - this.scoreBoardWidth;

        // Background
        this.ctx.fillStyle = "#34495e";
        this.ctx.fillRect(scoreBoardX, 0,this.scoreBoardWidth,this.canvas.height);

        // Title
        this.ctx.fillStyle = "#eee";
        this.ctx.font = "48px Tetris"
        this.ctx.fillText("Tetris",scoreBoardX + this.scoreBoardWidth/2 - this.ctx.measureText("Tetris").width/2,100);
        
        // Score
        this.ctx.fillStyle = "#eee";
        this.ctx.font = "24px Arial"
        this.ctx.fillText("Score : "+this.score,scoreBoardX +  10, 200);

    }
    drawHomePopup(){
        let box = this.homePopupBox;
        let btnStart = this.btnStart;
        this.ctx.fillStyle = "#34495e";
        this.ctx.fillRect(box.x,box.y,box.w,box.h);
        
        this.ctx.fillStyle = "#7f9bb8";
        this.ctx.fillText("Home Screen", box.x + box.w/2 - this.ctx.measureText("Home Screen").width/2, box.y + 40);

        // Button Start
        let buttonStartWidth = box.w/2;

        this.ctx.fillStyle = this.btnStart.background;
        this.ctx.fillRect(this.btnStart.x, this.btnStart.y, this.btnStart.w,  this.btnStart.h);

        this.ctx.fillStyle="#fff";
        this.ctx.fillText(btnStart.text, btnStart.textX, btnStart.textY);
    }
    drawGameScreen() {
        this.blocks.forEach((row, rowIndex) => {
            row.forEach((col,colIndex) => {
                this.ctx.fillStyle = col.color;
                this.ctx.strokeStyle= this.blockSettings.borderColor;
                this.ctx.fillRect(col.x, col.y, this.blockSettings.width, this.blockSettings.height);
                this.ctx.strokeRect(col.x, col.y, this.blockSettings.width, this.blockSettings.height);
            });
        })
    }
    createTetromino() {
        
    }
    getRandomTetrominoShape() {
        return Math.floor(Math.random() * this.tetrominoes.length);
    }
    render() {
        this.draw();  
        requestAnimationFrame(() => {
            this.render();
        })
    }

    events() {
        let that = this;

        // Hover
        this.canvas.addEventListener("mousemove", function(event) {
            let rect = that.canvas.getBoundingClientRect();
            let mouseLocation = {
                x: event.clientX - rect.left,
                y: event.clientY - rect.top
            }
            // Button start hover
            if(mouseLocation.x >= that.btnStart.x &&
                mouseLocation.x < that.btnStart.x + that.btnStart.w &&
                mouseLocation.y >= that.btnStart.y &&
                mouseLocation.y < that.btnStart.y + that.btnStart.h &&
                that.gameStatus == 'home') {
                    console.log('mouse location ada di hover start')
                    that.btnStart.background = "#2980b9";
                    that.canvas.style.cursor = "pointer";
                }else{
                    that.btnStart.background = "#3498db";
                    that.canvas.style.cursor = "auto";
                }
        });

        this.canvas.addEventListener("click", function(event) {
            let rect = that.canvas.getBoundingClientRect();
            let mouseLocation = {
                x: event.clientX - rect.left,
                y: event.clientY - rect.top
            }

            // Button start hover
            if(mouseLocation.x >= that.btnStart.x &&
                mouseLocation.x < that.btnStart.x + that.btnStart.w &&
                mouseLocation.y >= that.btnStart.y &&
                mouseLocation.y < that.btnStart.y + that.btnStart.h) {
                    that.gameStatus = "playing";
                }
        });
    }
}