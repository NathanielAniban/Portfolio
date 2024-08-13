$(document).ready(function() {
    const cells = [];
    let currentPlayer = 'X';
    let gameActive = true;
    var Player1_wins = 0;
    var Player1_loss = 0;
    var Player2_wins = 0;
    var Player2_loss = 0;

    function initializeBoard() {
        $('#gameBoard').empty();
        cells.length = 0;

        for (let i = 0; i < 9; i++) {
            const cell = $('<div class="border border-dark rounded-3">').addClass('cell').attr('data-index', i);
            $('#gameBoard').append(cell);
            cells.push(cell);
        }

        $('.cell').on('click', handleCellClick);
        $('#resetButton').on('click', resetGame);
        $('#status').text('');
    }

    function handleCellClick() {
        const $cell = $(this);
        if (!$cell.text() && gameActive) {
            $cell.text(currentPlayer).addClass(currentPlayer);
            if (checkWin()) {
                $('#status').text(`Player ${currentPlayer} wins!`);
                $('#term').html("");
                PlayerDashboard(currentPlayer);
                gameActive = false;
            } else if (cells.every(cell => $(cell).text())) {
                $('#status').text('It\'s a tie!');
                $('#term').html("");
                gameActive = false;
            } else {
                currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
                currentPlayer === 'X' ? $('#term').html("Player 1: Your Term") : $('#term').html("Player 2: Your Term");
            }
        }
    }

    function PlayerDashboard(currentPlayer){
        if(currentPlayer === 'X'){    
                Player1_wins++;
                Player2_loss++;
                $('#player-1-Wins').text(Player1_wins);
                $('#player-2-Wins').text(Player2_wins);
                $('#player-1-Loss').text(Player1_loss);
                $('#player-2-Loss').text(Player2_loss);
                }else{
                    Player2_wins++;
                    Player1_loss++;
                    $('#player-1-Wins').text(Player1_wins);
                    $('#player-2-Wins').text(Player2_wins);
                    $('#player-1-Loss').text(Player1_loss);
                    $('#player-2-Loss').text(Player2_loss);
                }
    }

    function checkWin() {
        const winningCombinations = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];


        return winningCombinations.some(combination => {
            const [a, b, c] = combination;
            return cells[a].text() && cells[a].text() === cells[b].text() && cells[a].text() === cells[c].text();
        });
    }

    function resetGame() {
        initializeBoard();
        currentPlayer = 'X';
        gameActive = true;
        $('#term').html("Player 1: Your Term");
    }

    initializeBoard();
});

