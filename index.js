//player0 is O and player1 is X

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
    }

    updateBoard(indices, player) {
        this.gameBoard[indices.x][indices.y] = player;
        this.cellsFilled++;
        this.findGameStatus(indices, player);
        return this.gameStatus;

    }

    canDraw(indices) {
        const iscellEmpty = this.gameBoard[indices.x][indices.y] === undefined;
        const isGameInProgress = this.gameStatus === null;
        return iscellEmpty && isGameInProgress;
    }

    findGameStatus(indices, player) {
        if (this._checkRow(indices, player) ||
            this._checkColumn(indices, player) ||
            this._checkDiagonal(player) ||
            this._checkReverseDiagonal(player)) {
            this.gameStatus = player;
        }
        else if (this.cellsFilled === 9) {
            this.gameStatus = 2;
        }
    }

    _checkRow(indices, player) {
        const row = indices.x;
        for (let i = 0; i < 3; i++) {
            if (this.gameBoard[row][i] !== player)
                return false;
        }
        return true;
    }

    _checkColumn(indices, player) {
        const col = indices.y;
        for (let i = 0; i < 3; i++) {
            if (this.gameBoard[i][col] !== player)
                return false;
        }
        return true;
    }

    _checkDiagonal(player) {
        for (let i = 0; i < 3; i++) {
            if (this.gameBoard[i][i] !== player)
                return false;
        }
        return true;
    }

    _checkReverseDiagonal(player) {
        for (let i = 0; i < 3; i++) {
            if (this.gameBoard[i][2 - i] !== player)
                return false;
        }
        return true;
    }
}

class CanvasBoard {
    constructor(id) {
        this.canvas = document.getElementById(id);
        this.ctx = this.canvas.getContext('2d');
        this.board = new Board();
        this.game = new Game();
        this.clearBoard();
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

    drawCross(loc) {
        this.ctx.save();
        this.ctx.translate(loc.x, loc.y);
        this.ctx.beginPath();
        this.ctx.moveTo(20, 20);
        this.ctx.lineTo(80, 80);
        this.ctx.moveTo(80, 20);
        this.ctx.lineTo(20, 80);
        this.ctx.stroke();
        this.ctx.restore();
    }

    drawCircle(loc) {

        this.ctx.save();
        this.ctx.translate(loc.x, loc.y);
        this.ctx.beginPath();
        this.ctx.arc(50, 50, 30, 0, Math.PI * 2, true);
        this.ctx.stroke();
        this.ctx.restore();
    }

    drawBoard() {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                this.ctx.strokeRect(100 * i, 100 * j, 100, 100);
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
            if (!this.board.canDraw(indices))
                return;
            if (this.game.player === 0)
                this.drawCircle(loc);
            else
                this.drawCross(loc);
            const gameStatus = this.board.updateBoard(indices, this.game.player);
            if (gameStatus === 0 || gameStatus === 1)
                this.game.declareWinner(gameStatus + 1);
            else if (gameStatus === 2)
                this.game.declareDraw();
            this.game.togglePlayer();
        }
    }
    clearBoard() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

const init = () => {
    new CanvasBoard('canvas');
}

init();


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
