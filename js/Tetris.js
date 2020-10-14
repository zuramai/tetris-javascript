
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
        this.speed = 1; // In seconds
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
                    id: null,
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
            case 'playing':
                this.drawTetrominoes();
                break;
            default:
                break;
        }
    }
    drawTetrominoes() {
        this.tetrominoes.forEach(piece => {
            // this.ctx.fillStyle = piece.color;
            piece.tetromino[piece.tetrominoN].forEach((shapeRow,rowIndex) => {
                shapeRow.forEach((shapeCol,colIndex) => {
                    if(shapeCol) {
                        let block = this.blocks[rowIndex + piece.y][colIndex + piece.x];
                        block.color = piece.color;
                        block.id = piece.id;
                    }
                })
            })
        })
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
        let shape = this.getRandomTetrominoShape();
        let showInIndex = Math.floor(Math.random() * Math.floor(this.blockCount.x - 4));
        let create = new Tetromino(shape[0], shape[1], showInIndex, this.blockCount, this.speed);

        this.tetrominoes.push(create);
        console.log('tetrominoes ',this.tetrominoes)
    }
    getRandomTetrominoShape() {
        return this.tetrominoShapes[Math.floor(Math.random() * this.tetrominoShapes.length)];
    }
    checkFullRow() {
        for(var i = this.blocks.length; i-- > 0;) {

        }
    }
    update() {
        if(this.gameStatus == 'playing') {
            this.checkFullRow();
        }
    }
    render() {
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
        this.draw();  
        this.update();

        requestAnimationFrame(() => {
            this.render();
        })
    }
    play() {
        if(this.gameStatus !== 'playing') {
            this.gameStatus = "playing";
            this.createTetromino();
        }
        console.log(this.tetrominoes)
    }
    clearTetromino(x, y, shape) {
        shape.forEach((shapeRow,rowIndex) => {
            shapeRow.forEach((shapeCol,colIndex) => {
                if(shapeCol) {
                    let block = this.blocks[rowIndex+y][colIndex+x];
                    block.color = this.blockSettings.emptyColor
                    block.id = null;
                }
            });
        });
    }
    isCollide(direction) {
        let directionMap = {
            right: [0,1],
            left: [0,-1],
            bottom: [1,0],
            top: [-1,0],
            topRight: [-1, 1],
            topLeft: [-1, -1],
            bottomRight: [1, 1],
            bottomLeft: [1, -1]
        }
        let isCollide = false;
        let theDirection = directionMap[direction];
        this.tetrominoes.forEach(tetromino => {
            if(!tetromino.put) {
                tetromino.tetromino[tetromino.tetrominoN].forEach((shapeRow,rowIndex) => {
                    shapeRow.forEach((shapeCol,colIndex) => {
                        if(shapeCol) {
                            let currentBlockIndex = [
                                rowIndex + tetromino.y,
                                colIndex + tetromino.x
                            ];
                            if(this.blocks[currentBlockIndex[0] + theDirection[0]] == undefined) {
                                isCollide = true;
                                tetromino.put = true;
                                return;
                            }
                            let nextBlock = this.blocks[currentBlockIndex[0] + theDirection[0]][currentBlockIndex[1] + theDirection[1]];
                            console.log("nextblockid ",nextBlock.id," tetroid ", tetromino.id);
                            if(direction == 'bottom' && 
                                nextBlock.id !== null &&
                                nextBlock.id !== tetromino.id) {
                                    isCollide = true;
                                    tetromino.put = true;
                                    console.log("YES PUT")
                                    return;
                                }
                            return;
                        }
                    });
                });
            }
        });
        console.log('iscollide ',isCollide);
        if(isCollide) this.createTetromino();
        return isCollide;
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
                    that.play();
                }
        });
        document.addEventListener("keydown", function(event) {
            event.preventDefault();
            that.tetrominoes.forEach(tetromino => {
                if(!tetromino.put && !that.isCollide('bottom')) {
                    that.clearTetromino(tetromino.x,tetromino.y,tetromino.tetromino[tetromino.tetrominoN]);
                    if(event.key == "ArrowRight" || event.key == "d") 
                        tetromino.moveRight();
                    else if(event.key == "ArrowLeft" || event.key == "a") 
                        tetromino.moveLeft();
                    else if(event.key == "ArrowDown" || event.key == "s") 
                        tetromino.moveDown();
                    else if(event.key == " ") 
                        tetromino.rotate();
                }
            })
        });

        setInterval(() => {
            this.tetrominoes.forEach(tetromino => {
                if(!tetromino.put && !this.isCollide('bottom')) {
                    this.clearTetromino(tetromino.x, tetromino.y, tetromino.tetromino[tetromino.tetrominoN]);
                    tetromino.moveDown();
                } ;
            });
        }, this.speed * 1000);
    }
}