import { piecesColors } from "./constants.js";

export default class UI {
    setTurn(playerIndex) {
        turn.dataset.color = piecesColors[playerIndex];
    }
    setScore(score) {
        white_score.textContent = score[0].toString();
        red_score.textContent = score[1].toString();
    }
    setWinner(playerIndex) {
        winner_piece.dataset.color = piecesColors[playerIndex];
    }
    showWinner() {
        winner.showModal();
    }
    hideWinner() {
        winner.close();
    }
}