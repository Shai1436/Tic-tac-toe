//player0 is O and player1 is X
let board;
class Game {
    constructor() {
        this.player = 0;
        this.setTurnText(this.player + 1);
        this.setResultText();
    }

    togglePlayer() {
        if (this.player === 1)
            this.player = 0;
        else
            this.player = 1;
        this.setTurnText(this.player + 1);
    }

    setTurnText(player) {
        const ele = document.getElementById('turn-text');
        ele.innerText = 'Player ' + player + ' turn';
    }

    setResultText() {
        const ele = document.getElementById('result-text');
        ele.innerText = ' ';
    }

    declareWinner(player) {
        const ele = document.getElementById('result-text');
        ele.innerText = 'Player ' + player + ' won';
        console.log("player " + player + " won ");
    }

    declareDraw() {
        const ele = document.getElementById('result-text');
        ele.innerText = ' Draw ';
    }
}

class Board {
    constructor() {
        this.gameBoard = new Array(new Array(3), new Array(3), new Array(3));
        this.gameStatus = null; // 0: player0 wins, 1: player1 wins, 2: draw, null: undecided
        this.cellsFilled = 0;
        this.findGameStatus = this.findGameStatus.bind(this);
        this.game = new Game();
        this.boardCanvas = new BoardCanvas('canvas');
        this.gameHistory = new Array();
    }

    updateBoard(indices) {
        if (!this.canDraw(indices))
            return;
        this.gameBoard[indices.x][indices.y] = this.game.player;
        this.gameHistory.push(indices);
        this.cellsFilled++;
        this.updateBoardCanvas();
        this.findGameStatus(indices);
        if (this.gameStatus === 0 || this.gameStatus === 1)
            this.game.declareWinner(this.gameStatus + 1);
        else if (this.gameStatus === 2)
            this.game.declareDraw();
        this.game.togglePlayer();
    }

    updateBoardCanvas() {
        this.boardCanvas.drawBoard(this.gameBoard);
    }

    undo() {
        const indices = this.gameHistory.pop();
        this.gameBoard[indices.x][indices.y] = undefined;
        this.updateBoardCanvas();
        this.game.togglePlayer();
        this.cellsFilled--;
    }

    canDraw(indices) {
        const iscellEmpty = this.gameBoard[indices.x][indices.y] === undefined;
        const isGameInProgress = this.gameStatus === null;
        return iscellEmpty && isGameInProgress;
    }

    findGameStatus(indices) {
        if (this._checkRow(indices) ||
            this._checkColumn(indices) ||
            this._checkDiagonal() ||
            this._checkReverseDiagonal()) {
            this.gameStatus = this.game.player;
        }
        else if (this.cellsFilled === 9) {
            this.gameStatus = 2;
        }
    }

    _checkRow(indices) {
        const row = indices.x;
        for (let i = 0; i < 3; i++) {
            if (this.gameBoard[row][i] !== this.game.player)
                return false;
        }
        return true;
    }

    _checkColumn(indices) {
        const col = indices.y;
        for (let i = 0; i < 3; i++) {
            if (this.gameBoard[i][col] !== this.game.player)
                return false;
        }
        return true;
    }

    _checkDiagonal() {
        for (let i = 0; i < 3; i++) {
            if (this.gameBoard[i][i] !== this.game.player)
                return false;
        }
        return true;
    }

    _checkReverseDiagonal() {
        for (let i = 0; i < 3; i++) {
            if (this.gameBoard[i][2 - i] !== this.game.player)
                return false;
        }
        return true;
    }
}

class BoardCanvas {
    constructor(id) {
        this.canvas = document.getElementById(id);
        this.ctx = this.canvas.getContext('2d');
        this.drawBoard();
        this.addClickListener();
    }

    mapIndicesToCanvasCells(x, y) {
        var bbox = this.canvas.getBoundingClientRect();
        const loc = {
            x: x - bbox.left * (canvas.width / bbox.width),
            y: y - bbox.top * (canvas.height / bbox.height)
        };
        loc.x = Math.floor(loc.x / 100) * 100;
        loc.y = Math.floor(loc.y / 100) * 100;
        return loc;
    }

    drawCross(y, x) {
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.beginPath();
        this.ctx.moveTo(20, 20);
        this.ctx.lineTo(80, 80);
        this.ctx.moveTo(80, 20);
        this.ctx.lineTo(20, 80);
        this.ctx.stroke();
        this.ctx.restore();
    }

    drawCircle(y, x) {
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.beginPath();
        this.ctx.arc(50, 50, 30, 0, Math.PI * 2, true);
        this.ctx.stroke();
        this.ctx.restore();
    }

    drawBoard(board) {
        this.clearBoard();
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                this.ctx.strokeRect(100 * i, 100 * j, 100, 100);
                if (board && board[i][j] === 0)
                    this.drawCircle(100 * i, 100 * j);
                else if (board && board[i][j] === 1)
                    this.drawCross(100 * i, 100 * j);
            }
        }
    }

    addClickListener() {
        this.canvas.onclick = (e) => {
            const loc = this.mapIndicesToCanvasCells(e.clientX, e.clientY);
            const indices = {};
            let temp = loc.x;
            indices.x = Math.floor(loc.y / 100);
            indices.y = Math.floor(temp / 100);
            board.updateBoard(indices);
        }
    }

    clearBoard() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

const init = () => {
    board = new Board();
}

init();

const undo = () => {
    board.undo();
}
// class Move {
//     constructor(cell, player) {
//         this.cell = cell;
//         this.player = player;
//         this.getIndicesFromCell = this.getIndicesFromCell.bind(this);
//     }
//     getIndicesFromCell(cell) {
//         const x = Math.floor(cell / 3);
//         const y = cell % 3;
//         return {
//             x,
//             y
//         };
//     }
// }
