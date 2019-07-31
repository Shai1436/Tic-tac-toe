//player0 is O and player1 is X
let player = 0;
let board;
// const box = document.getElementsByClassName('box')[0];
// box.addEventListener('click', (e) => {
//     const targetEle = e.target.firstElementChild;
//     console.log(targetEle);
//     const cell = parseInt(targetEle.getAttribute('data-cell-id'), 10);
//     const move = new Move(cell, player);
//     const indices = move.getIndicesFromCell(cell);
//     if (targetEle.hasAttribute('data-cell-id')) {
//         if (player === 0)
//             targetEle.innerText = 'O';
//         else
//             targetEle.innerText = 'X';
//         board.updateBoard(indices, player);
//         togglePlayer();
//     }
// });

const togglePlayer = () => {
    if (player === 1)
        player = 0;
    else
        player = 1;
    setTurnText(player + 1);
}

const setTurnText = (player) => {
    const ele = document.getElementById('turn-text');
    ele.innerText = 'Player ' + player + ' turn';
}

const declareWinner = (player) => {
    const ele = document.getElementById('result-text');
    ele.innerText = 'Player ' + player + ' won';
    console.log("player " + player + " won ");
}

const declareDraw = () => {
    const ele = document.getElementById('result-text');
    ele.innerText = ' Draw ';
}

class Move {
    constructor(cell, player) {
        this.cell = cell;
        this.player = player;
        this.getIndicesFromCell = this.getIndicesFromCell.bind(this);
    }
    getIndicesFromCell(cell) {
        const x = Math.floor(cell / 3);
        const y = cell % 3;
        return {
            x,
            y
        };
    }
}
class Board {
    constructor() {
        this.game = new Array(new Array(3), new Array(3), new Array(3));
        this.gameStatus = null; // 0: player0 wins, 1: player1 wins, 2: draw, null: undecided
        this.cellsFilled = 0;
        this.findGameStatus = this.findGameStatus.bind(this);
    }

    updateBoard(indices, player) {
        this.game[indices.x][indices.y] = player;
        this.cellsFilled++;
        const result = this.findGameStatus(indices, player);
        if (result === 0 || result === 1)
            declareWinner(result + 1);
        else if (result === 2)
            declareDraw();
    }

    findGameStatus(indices, player) {
        if (this._checkRow(indices, player) ||
            this._checkColumn(indices, player) ||
            this._checkDiagonal(indices, player) ||
            this._checkReverseDiagonal(indices, player)) {
            this.gameStatus = player;
            return this.gameStatus;
        }
        if (this.cellsFilled === 9) {
            this.gameStatus = 2;
            return this.gameStatus;
        }
    }

    _checkRow(indices, player) {
        const row = indices.x;
        for (let i = 0; i < 3; i++) {
            if (this.game[row][i] !== player)
                return false;
        }
        return true;
    }

    _checkColumn(indices, player) {
        const col = indices.y;
        for (let i = 0; i < 3; i++) {
            if (this.game[i][col] !== player)
                return false;
        }
        return true;
    }

    _checkDiagonal(indices, player) {
        for (let i = 0; i < 3; i++) {
            if (this.game[i][i] !== player)
                return false;
        }
        return true;
    }

    _checkReverseDiagonal(indices, player) {
        for (let i = 0; i < 3; i++) {
            if (this.game[i][2 - i] !== player)
                return false;
        }
        return true;
    }
}

const mapIndicesToCanvasCells = (canvas, x, y) => {
    var bbox = canvas.getBoundingClientRect();
    const loc = {
        x: x - bbox.left * (canvas.width / bbox.width),
        y: y - bbox.top * (canvas.height / bbox.height)
    };
    loc.x = Math.floor(loc.x / 100) * 100;
    loc.y = Math.floor(loc.y / 100) * 100;
    return loc;
}

const drawCross = (canvas, x, y) => {
    const loc = mapIndicesToCanvasCells(canvas, x, y);
    const ctx = canvas.getContext('2d');
    ctx.save();
    ctx.translate(loc.x, loc.y);
    ctx.beginPath();
    ctx.moveTo(20, 20);
    ctx.lineTo(80, 80);
    ctx.moveTo(80, 20);
    ctx.lineTo(20, 80);
    ctx.stroke();
    ctx.restore();
}

const drawCircle = (canvas, x, y) => {
    const loc = mapIndicesToCanvasCells(canvas, x, y);
    const ctx = canvas.getContext('2d');
    ctx.save();
    ctx.translate(loc.x, loc.y);
    ctx.beginPath();
    ctx.arc(50, 50, 30, 0, Math.PI * 2, true);
    ctx.stroke();
    ctx.restore();
}

const drawBoard = (id) => {
    const canvas = document.getElementById(id);
    const ctx = canvas.getContext('2d');
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            ctx.strokeRect(100 * i, 100 * j, 100, 100);
        }
    }
    canvas.onclick = (e) => {
        if (player === 0)
            drawCircle(canvas, e.clientX, e.clientY);
        else
            drawCross(canvas, e.clientX, e.clientY);
        const indices = mapIndicesToCanvasCells(canvas, e.clientX, e.clientY);
        let temp = indices.x;
        indices.x = Math.floor(indices.y / 100);
        indices.y = Math.floor(temp / 100);
        board.updateBoard(indices, player);
        togglePlayer();
    }
}

const clearBoard = (id) => {
    const canvas = document.getElementById(id);
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
}

const init = () => {
    board = new Board();
    player = 0;
    setTurnText(player + 1);
    drawBoard('canvas');
}

init();

const reset = () => {
    clearBoard('canvas');
    init();
    const ele = document.getElementById('result-text');
    ele.innerText = ' ';
}

