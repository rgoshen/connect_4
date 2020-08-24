/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
const board = []; // array of rows, each row is array of cells  (board[y][x])
let gameOver = false;
const statusSpan = document.querySelector(".status");

statusSpan.classList.toggle("red");

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  for (let r = 0; r < HEIGHT; r++) {
    let row = [];
    for (let c = 0; c < WIDTH; c++) {
      row.push(null);
    }
    board.push(row);
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  const htmlBoard = document.getElementById("board");

  // This makes the top row for players to drop "puck" and adds
  // click event listener
  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.classList.add("column-top");
  top.addEventListener("click", handleClick);

  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  // This creates the playing board table
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
  // update status area
  statusSpan.textContent = `Player ${currPlayer}'s turn`;
}

// Reset Toggle
const label = document.createElement("label");
label.setAttribute("for", "resetToggle");
label.classList.add("switch");
const reset = document.createElement("INPUT");
reset.setAttribute("type", "checkbox");
reset.setAttribute("id", "resetToggle");
const toggleSpan = document.createElement("span");
toggleSpan.classList.add("slider");
label.append(reset);
label.append(toggleSpan);
document.body.append(label);

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  for (let y = HEIGHT - 1; y >= 0; y--) {
    if (!board[y][x]) {
      return y;
    }
  }
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  const piece = document.createElement("div");
  piece.classList.add("piece", `p${currPlayer}`);

  let spot = document.getElementById(`${y}-${x}`);
  spot.append(piece);
}

/** endGame: announce game end */

function endGame(msg) {
  gameOver = true;
  statusSpan.textContent = `${msg}`;
  statusSpan.classList.add("game-over");
  // setTimeout(() => {
  //   alert(msg);
  // }, 500);
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  if (gameOver) return;
  const x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  const y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  board[y][x] = currPlayer;
  placeInTable(y, x);

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie
  if (board.every((row) => row.every((cell) => cell))) {
    return endGame("Tie!");
  }

  // switch players
  currPlayer = currPlayer === 1 ? 2 : 1;

  // update status area
  statusSpan.textContent = `Player ${currPlayer}'s turn`;
  statusSpan.classList.toggle("red");
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      // starts checking of 4 cells are in a row in each possible direction
      const horiz = [
        [y, x],
        [y, x + 1],
        [y, x + 2],
        [y, x + 3],
      ];
      const vert = [
        [y, x],
        [y + 1, x],
        [y + 2, x],
        [y + 3, x],
      ];
      const diagDR = [
        [y, x],
        [y + 1, x + 1],
        [y + 2, x + 2],
        [y + 3, x + 3],
      ];
      const diagDL = [
        [y, x],
        [y + 1, x - 1],
        [y + 2, x - 2],
        [y + 3, x - 3],
      ];
      // find a winner (stops when first direction is detected of a win)
      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

/** handleClick: handle click reset toggle */
reset.addEventListener("click", () => {
  setTimeout(() => {
    window.location.reload();
  }, 700);
});

makeBoard();
makeHtmlBoard();
