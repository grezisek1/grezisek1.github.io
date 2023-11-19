import { boardNode, autoplaySpeed, piecesTypes} from "./constants.js";
import autoplay, { cancelAutoplay } from "./autoplay.js";
import { ciToDi, ciToXy, isXYUsable } from "./logic.js";

const noFields = [];

function startGame(game) {
    game.state.score.fill(0);
    game.state.currentPlayerIndex = 0;
    game.ui.setTurn(game.state.currentPlayerIndex);
    game.ui.setScore(game.state.score);
    game.pieces.resetAll();
    game.logic.updateAnalysis(game);
}
function endGame(game) {
    game.ui.setWinner(game.state.currentPlayerIndex);
    game.ui.showWinner();
}

const clickFieldSelected = [];
function clickField(game, clickEvent) {
    const ci = game.fields.list.indexOf(clickEvent.target);
    if (!isXYUsable.apply(null, ciToXy(ci))) {
        game.fields.highlightFields(noFields);
        game.fields.selectFields(noFields);
        game.state.selected = null;
        return;
    }
    
    const di = ciToDi(ci);

    if (game.logic.isClickMovement(clickEvent)) {
        const taken = game.logic.getTaken(game.state, ci);
        if (taken) {
            game.state.score[game.state.currentPlayerIndex]++;
            game.pieces.take(taken);
            if (game.logic.isGameOver(game)) {
                endGame(game);
            }
        }
        movePiece(game, di, ci);
        return;
    }

    const availableMoves = game.logic.getAvailableMoves(game, di);
    game.fields.highlightFields(availableMoves);

    if (availableMoves.length) {
        game.state.selected = ci;
        clickFieldSelected[0] = ci;
        game.fields.selectFields(clickFieldSelected);
    } else {
        game.fields.selectFields(noFields);
        game.state.selected = null;
    }
}

function movePiece(game, di, ci) {
    const selectedDi = ciToDi(game.state.selected);
    advanceTurn(game);
    game.pieces.move(selectedDi, di);
    if (game.pieces.data[di]?.dataset?.type == piecesTypes[0]) {
        if (game.logic.getKingCandidates(game).includes(game.state.selected)) {
            game.pieces.promote(di);
        }
    }
    finalizeMovement(game);
}

function advanceTurn(game) {
    game.state.currentPlayerIndex = (game.state.currentPlayerIndex + 1) % 2;
    game.ui.setTurn(game.state.currentPlayerIndex);
}

function finalizeMovement(game) {
    game.ui.setScore(game.state.score);
    game.logic.updateAnalysis(game);
    game.fields.highlightFields(noFields);
    game.fields.selectFields(noFields);
}

export default class Controller {
    initController(game) {
        startGame(game);
        winner.addEventListener("click", () => {
            game.ui.hideWinner();
            startGame(game);
        });

        autoplay_toggler.addEventListener("change", _ => {
            if (autoplay_toggler.checked) {
                autoplay(game, Infinity, autoplaySpeed);
            } else {
                cancelAutoplay();
            }
        });

        boardNode.addEventListener("click", clickEvent => {
            clickField(game, clickEvent);
        }, true);
    }
}