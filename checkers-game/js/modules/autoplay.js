import { fieldClasses } from "./constants.js";
import { isXYUsable, xyToCi } from "./logic.js";

let cancel = false;
export default function autoplay(game, howManyGames, turnDelay) {
    const pickPiece = () => {
        let color = "white";
        if (game.state.currentPlayerIndex) {
            color = "black";
        }

        const moveablePieces = [];
        let di = -1;
        for (let y = 0; y < 10; y++) {
            for (let x = 0; x < 10; x++) {
                if (!isXYUsable(x, y)) {
                    continue;
                }
                di++;

                if (game.pieces.data[di]?.dataset?.color == color) {
                    if (game.logic.getAvailableMoves(game, di).length) {
                        moveablePieces.push(xyToCi(x, y));
                    }
                }
            }
        }

        return moveablePieces[Math.floor(Math.random() * moveablePieces.length)];
    };

    const movePiece = (ci) => {
        game.fields.list[ci].click();
        const moves = Array.from(document
            .querySelectorAll(`.${fieldClasses.highlighted}`));

        moves[Math.floor(Math.random() * moves.length)].click();
        return true;
    };

    const turn = () => {
        const piece = pickPiece();
        if (!piece) {
            return false;
        }
        return movePiece(piece);
    };

    const nextGame = () => {
        winner.click();
        doTurns();
    };

    let remainingGames = howManyGames;
    const doTurns = () => {
        if (cancel) {
            cancel = false;
            return;
        }
        if (turn()) {
            setTimeout(doTurns, turnDelay);
            return;
        }
        remainingGames--;
        if (remainingGames) {
            setTimeout(nextGame, 1000);
        }
    };
    doTurns();
}

export function cancelAutoplay() {
    cancel = true;
}