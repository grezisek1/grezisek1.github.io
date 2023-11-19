import {
    fieldClasses,
    kingMoveDirections,
    kingCandidateRows,
    piecesCount,
    fieldsCount,
    dataCount,
    piecesTypes,
    piecesColors
} from "./constants.js";

function updatePlayer(game, playerColor, enemyColor, pieceMovesUpdater, kingCandidatesRow, takeStrategy) {
    game.state.kingCandidates.length = 0;
    let di = -1;

    const size = Math.sqrt(fieldsCount);
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            if (!isXYUsable(x, y)) {
                continue;
            }

            di++;
            game.state.availableMoves[di].length = 0;
            game.state.takes[di].length = 0;

            if (game.pieces.data[di]?.dataset?.color != playerColor) {
                continue;
            }

            if (game.pieces.data[di].dataset.type == piecesTypes[1]) {
                updateKingMoves(game, x, y, di, enemyColor, takeStrategy);
            } else {
                pieceMovesUpdater.call(this, game, x, y, di, takeStrategy);
                if (y == kingCandidatesRow) {
                    game.state.kingCandidates.push(xyToCi(x, y));
                }
            }
        }
    }
}
function updateKingMoves(game, x, y, di, enemyColor, takeStrategy) {
    const nbhd = {
        fl: null, fr: null,
        bl: null, br: null,
    };

    const movesWithoutTake = [];
    const movesWithTake = [];

    for (let dir = 0; dir < 4 * 3; dir += 3) {
        updateNBHD(game.pieces.data, nbhd, x, y);
        updateKingMovesInDirection(
            game, nbhd, x, y,
            kingMoveDirections[dir],
            kingMoveDirections[dir+1],
            kingMoveDirections[dir+2],
            enemyColor,
            movesWithoutTake,
            movesWithTake
        );
    }
    
    if (movesWithTake.length) {
        takeStrategy.updateTakes(x, y, movesWithTake);
        for (let take of movesWithTake) {
            game.state.availableMoves[di].push(take[0]);
        }

    } else {
        Array.prototype.push.apply(game.state.availableMoves[di], movesWithoutTake);
    }
}
function updateKingMovesInDirection(game, nbhd, x, y, dirX, dirY, dirKey, enemyColor, movesWithoutTake, movesWithTake) {
    let nx = x + dirX;
    let ny = y + dirY;
    updateNBHD(game.pieces.data, nbhd, x, y);
    while (nbhd[dirKey] === null) {
        movesWithoutTake.push(xyToCi(nx, ny));
        updateNBHD(game.pieces.data, nbhd, nx, ny);
        nx += dirX;
        ny += dirY;
    }
    
    if (nbhd[dirKey]?.dataset?.color == enemyColor) {
        const takenDi = xyToDi(nx, ny);
        updateNBHD(game.pieces.data, nbhd, nx, ny);
        while (nbhd[dirKey] === null) {
            nx += dirX;
            ny += dirY;
            
            movesWithTake.push([xyToCi(nx, ny), takenDi]);
            updateNBHD(game.pieces.data, nbhd, nx, ny);
        }
    }
}

function updateNBHD(boardData, nbhd, x, y) {
    if (y >= 1) {
        if (x >= 1) {
            nbhd.fl = boardData[xyToDi(x - 1, y - 1)];
        } else {
            nbhd.fl = undefined;
        }
        if (x < 9) {
            nbhd.fr = boardData[xyToDi(x + 1, y - 1)];
        } else {
            nbhd.fr = undefined;
        }
    } else {
        nbhd.fl = undefined;
        nbhd.fr = undefined;
    }
    if (y < 9) {
        if (x >= 1) {
            nbhd.bl = boardData[xyToDi(x - 1, y + 1)];
        } else {
            nbhd.bl = undefined;
        }
        if (x < 9) {
            nbhd.br = boardData[xyToDi(x + 1, y + 1)];
        } else {
            nbhd.br = undefined;
        }
    } else {
        nbhd.bl = undefined;
        nbhd.br = undefined;
    }
}

function updateP1PieceMoves(game, x, y, di, takeStrategy) {
    const nbhd = {
        fl: null, fr: null,
        bl: null, br: null,
    };
    updateNBHD(game.pieces.data, nbhd, x, y);
    const movesWithoutTake = [];
    const movesWithTake = [];
    
    const _nbhd = Object.create(nbhd);
    if (nbhd.fl === null) {
        movesWithoutTake.push(xyToCi(x - 1, y - 1));
    } else if (nbhd.fl?.dataset?.color == piecesColors[1]) {
        updateNBHD(game.pieces.data, _nbhd, x - 1, y - 1);
        if (_nbhd.fl === null) {
            movesWithTake.push([
                xyToCi(x - 2, y - 2),
                xyToDi(x - 1, y - 1)
            ]);
        }
    }
    if (nbhd.fr === null) {
        movesWithoutTake.push(xyToCi(x + 1, y - 1));
    } else if (nbhd.fr?.dataset?.color == piecesColors[1]) {
        updateNBHD(game.pieces.data, _nbhd, x + 1, y - 1);
        if (_nbhd.fr === null) {
            movesWithTake.push([
                xyToCi(x + 2, y - 2),
                xyToDi(x + 1, y - 1)
            ]);
        }
    }

    if (nbhd.bl?.dataset?.color == piecesColors[1]) {
        updateNBHD(game.pieces.data, _nbhd, x - 1, y + 1);
        if (_nbhd.bl === null) {
            movesWithTake.push([
                xyToCi(x - 2, y + 2),
                xyToDi(x - 1, y + 1)
            ]);
        }
    }
    if (nbhd.br?.dataset?.color == piecesColors[1]) {
        updateNBHD(game.pieces.data, _nbhd, x + 1, y + 1);
        if (_nbhd.br === null) {
            movesWithTake.push([
                xyToCi(x + 2, y + 2),
                xyToDi(x + 1, y + 1)
            ]);
        }
    }

    if (movesWithTake.length) {
        takeStrategy.updateTakes(x, y, movesWithTake);
        for (let take of movesWithTake) {
            game.state.availableMoves[di].push(take[0]);
        }
    } else {
        Array.prototype.push.apply(game.state.availableMoves[di], movesWithoutTake);
    }
}
function updateP2PieceMoves(game, x, y, di, takeStrategy) {
    const nbhd = {
        fl: null, fr: null,
        bl: null, br: null,
    };
    updateNBHD(game.pieces.data, nbhd, x, y);
    const movesWithoutTake = [];
    const movesWithTake = [];

    const _nbhd = Object.create(nbhd);
    if (nbhd.bl === null) {
        movesWithoutTake.push(xyToCi(x - 1, y + 1));

    } else if (nbhd.bl?.dataset?.color == piecesColors[0]) {
        updateNBHD(game.pieces.data, _nbhd, x - 1, y + 1);
        if (_nbhd.bl === null) {
            movesWithTake.push([
                xyToCi(x - 2, y + 2),
                xyToDi(x - 1, y + 1)
            ]);
        }
    }

    if (nbhd.br === null) {
        movesWithoutTake.push(xyToCi(x + 1, y + 1));
            
    } else if (nbhd.br?.dataset?.color == piecesColors[0]) {
        updateNBHD(game.pieces.data, _nbhd, x + 1, y + 1);
        if (_nbhd.br === null) {
            movesWithTake.push([
                xyToCi(x + 2, y + 2),
                xyToDi(x + 1, y + 1)
            ]);
        }
    }
    
    if (nbhd.fl?.dataset?.color == piecesColors[0]) {
        updateNBHD(game.pieces.data, _nbhd, x - 1, y - 1);
        if (_nbhd.fl === null) {
            movesWithTake.push([
                xyToCi(x - 2, y - 2),
                xyToDi(x - 1, y - 1)
            ]);
        }
    }
    if (nbhd.fr?.dataset?.color == piecesColors[0]) {
        updateNBHD(game.pieces.data, _nbhd, x + 1, y - 1);
        if (_nbhd.fr === null) {
            movesWithTake.push([
                xyToCi(x + 2, y - 2),
                xyToDi(x + 1, y - 1)
            ]);
        }
    }

    if (movesWithTake.length) {
        takeStrategy.updateTakes(x, y, movesWithTake);
        for (let take of movesWithTake) {
            game.state.availableMoves[di].push(take[0]);
        }
    } else {
        Array.prototype.push.apply(game.state.availableMoves[di], movesWithoutTake);
    }
}

export function isXYUsable(x, y) {
    return !Boolean((y + 1) % 2 - x % 2);
}

export function xyToCi(x, y) {
    return y * 10 + x;
}
export function ciToDi(ci) {
    return Math.floor(ci / 2);
}
export function xyToDi(x, y) {
    return Math.floor(y * 5 + x / 2);
}
export function ciToXy(ci) {
    const y = Math.floor(ci / 10);
    const x = ci % 10;
    return [x, y];
}
export function diToXy(di) {
    const y = Math.floor(di / 5);
    const x = (di % 5) * 2 + (y + 1) % 2;
    return [x, y];
}
export function diToCi(di) {
    const y = Math.floor(di / 5);
    const x = (di % 5) * 2 + (y + 1) % 2;
    return y * 10 + x;
}

export default class Logic {
    #takeStrategyClass = null;
    #takeStrategy = null;
    constructor(takeStrategyClass) {
        this.#takeStrategyClass = takeStrategyClass;
    }
    initLogic(game) {
        this.#takeStrategy = new this.#takeStrategyClass(game);
        this.updateAnalysis(game);
    }

    getAvailableMoves(game, di) {
        return game.state.availableMoves[di];
    }
    getKingCandidates(game) {
        return game.state.kingCandidates;
    }

    isClickMovement(clickEvent) {
        return clickEvent.target.classList.contains(fieldClasses.highlighted);
    }
    isFieldUsable(fieldNode) {
        return Boolean(fieldNode.dataset.state);
    }
    isGameOver(game) {
        return game.state.score[game.state.currentPlayerIndex] == piecesCount;
    }
    isDiDefaultPositionOf(di, playerIndex) {
        if (playerIndex) {
            return di < piecesCount;
        }

        return di >= piecesCount + dataCount - 2 * piecesCount;
    }
    getTaken(state, ci) {
        const fromDi = ciToDi(state.selected);
        for (let take of state.takes[fromDi]) {
            if (take.root[0] === ci) {
                return take.root[1];
            }
        }

        return null;
    }
    updateAnalysis(game) {
        if (game.state.currentPlayerIndex) {
            updatePlayer(game, piecesColors[1], piecesColors[0], updateP2PieceMoves, kingCandidateRows[1], this.#takeStrategy);
        } else {
            updatePlayer(game, piecesColors[0], piecesColors[1], updateP1PieceMoves, kingCandidateRows[0], this.#takeStrategy);
        }
    }
}