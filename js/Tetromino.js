class Tetromino {
    constructor(tetromino, color, x, blockCount, speed) {
        this.tetromino = tetromino;
        this.color = color;
        this.x = x;
        this.y = 0;
        this.put = false;
        this.tetrominoN = 0; // Start from the first rotation angle
        this.blockCount = blockCount;
        this.speed = speed;
        this.id = Math.random().toString(36).substring(7);
    }
    moveRight(){
        if(this.x + this.tetromino[this.tetrominoN][0].length != this.blockCount.x)
            this.x++;
    }
    moveLeft(){
        if(this.x > 0)
            this.x--;
    }
    moveDown(){
        this.y++;
    }
    rotate() {
        if(this.tetrominoN < this.tetromino.length-1) {
            this.tetrominoN++;
        }else{
            this.tetrominoN = 0;
        }
    }
    
}