const matrix = [
    [   'F',   2, 1, 0, 0, 0, 0, 0, 'max' ],
    [ 'базис', 1,  2, 3, 4, 5, 6, 'b', 'q' ],
    [    3,   -4, -6, 1, 0, 0, 0, -20 ],
    [    4,   -2,  5, 0, 1, 0, 0,  27 ],
    [    5,    7,  5, 0, 0, 1, 0,  63 ],
    [    6,    3, -2, 0, 0, 0, 1,  23 ],
    [   'd',   0,  0, 0, 0, 0, 0,  0 ]
]

// const matrix = [
//     [   'F',   2, 1, 0, 0, 0, 0, 0, 'min' ],
//     [ 'базис', 1,  2, 3, 4, 5, 6, 'b', 'q' ],
//     [    3,   -4, -6, 1, 0, 0, 0, -20 ],
//     [    4,   -2,  5, 0, 1, 0, 0,  27 ],
//     [    5,    7,  5, 0, 0, 1, 0,  63 ],
//     [    6,    3, -2, 0, 0, 0, 1,  23 ],
//     [   'd',   0,  0, 0, 0, 0, 0,  0 ]
// ]

// const matrix = [
//     [   'F',   7,  8, 6, 5, 0, 0, 0, 0, 'max' ],
//     [ 'базис', 1,  2, 3, 4, 5, 6, 7, 'b', 'q' ],
//     [    5,    1,  3, 5, 3, 1, 0, 0,  40 ],
//     [    6,    2,  6, 1, 0, 0, 1, 0,  50 ],
//     [    7,    2,  3, 2, 5, 0, 0, 1,  30 ],
//     [   'd',   0,  0, 0, 0, 0, 0, 0,  0 ]
// ]

const INDEX_COL_B = matrix[1].findIndex((value) => value === 'b');
const INDEX_COL_Q = matrix[1].findIndex((value) => value === 'q');
const INDEX_COL_EXTREMUM = matrix[0].findIndex((value) => value === 'max' || value === "min" );
const EXTREMUM = matrix[0][INDEX_COL_EXTREMUM];

simplex(matrix);

function hasBNegative(matrix) {
    for (let row = 2; row < matrix.length - 1; row++) {
        if (matrix[row][INDEX_COL_B] < 0) {
            console.log("В столбце b присутствуют отрицательные значения.")
            return true;
        }
    }
    return false;
}

function getIndexesOfMax(matrix) {
    let rowMaxIndex, colMaxIndex;
    let current, max;

    max = 0;

    for (let i = 2; i < matrix.length - 1; i++) {
        current = matrix[i][INDEX_COL_B];

        if (current < 0 && Math.abs(current) > max) {
            max = current;
            rowMaxIndex = i;
        }
    }

    max = 0;

    for (let i = 1; i < matrix[rowMaxIndex].length - 1; i++) {
        current = matrix[rowMaxIndex][i];

        if (current < 0 && Math.abs(current) > max) {
            max = current;
            colMaxIndex = i;
        }
    }

    return [ rowMaxIndex, colMaxIndex ];
}

function swapBazis(matrix, indexes) {
    let [row, col] = indexes;

    matrix[row][0] = matrix[1][col];
}

function newMatrix(matrix, indexes) {
    let [rowIndex, colIndex] = indexes;

    let bazisRow = matrix[rowIndex].map((element, index) => {
        if (index !== 0 && index !== INDEX_COL_Q) {
            return element /= matrix[rowIndex][colIndex];
        }
        return element;
    });

    matrix.splice(rowIndex, 1, bazisRow);

    let otherRow;

    matrix.forEach((row, index) => {
        if (index !== rowIndex && index > 1) {
            otherRow = row.map((col, index) => {
                if (index > 0 && index !== INDEX_COL_Q) {
                    return col - ( bazisRow[index] * row[colIndex] );
                }
                return col;
            });
            matrix.splice(index, 1, otherRow);
        }
    });
}

function solveD(matrix) {
    let deltas = new Array(INDEX_COL_B + 1).fill(0);

    for (let di = 1; di < INDEX_COL_B; di++) {

        if (di !== INDEX_COL_B) {
            for (let bi = 2; bi < matrix.length; bi++) {
                if (bi === matrix.length - 1) {
                    deltas[di] = deltas[di] - matrix[0][di];
                    
                } else {
                    deltas[di] += matrix[0][matrix[bi][0]] * matrix[bi][di];
                }
            }
        }
        else {
            for (let bi = 2; bi < matrix.length; bi++) {
                if (bi !== matrix.length - 1) {
                    deltas[deltas.length - 1] += matrix[bi][INDEX_COL_B] * matrix[0][matrix[bi][0]];
                } else {
                    deltas[deltas.length - 1] -= matrix[0][INDEX_COL_B];
                }
            }
        }
    }

    matrix[matrix.length - 1].splice(1, 7, ...deltas.slice(1));
}

function checkOptimality(matrix) {
    if (matrix[matrix.length - 1].find((element) => element < 0)) {
        return false;
    }
    return true;
}

function getMinDelta(matrix) {
    return matrix[matrix.length - 1].indexOf(Math.min(...matrix[matrix.length - 1].slice(1)));
}

function calculateQ(matrix) {
    const indexMinDelta = getMinDelta(matrix);
    let Q;

    for (let row = 2; row < matrix.length - 1; row++) {
        Q = matrix[row][INDEX_COL_B] / matrix[row][indexMinDelta];
        matrix[row][INDEX_COL_Q] = Q < 0 ? Infinity : Q;
    }
}

function getMinQ(matrix) {
    let min = Infinity;
    let current, index;

    for (let row = 2; row < matrix.length - 1; row++) {
        current = matrix[row][INDEX_COL_Q];

        if (current < min) {
            min = current;
            index = row;
        }
    }

    return index;
}

function iteration(matrix) {
    let minXi, minYi;

    minYi = getMinDelta(matrix);

    calculateQ(matrix);

    minXi = getMinQ(matrix);

    swapBazis(matrix, [minXi, minYi]);

    newMatrix(matrix, [minXi, minYi]);

    solveD(matrix);
}

function calculateFunc() {
    let f = 0;

    for (let row = 2; row < matrix.length - 1; row++) {
        f += matrix[row][INDEX_COL_B] * matrix[0][matrix[row][0]];
    }

    console.log(`Значение функции F в точке ${matrix[0][INDEX_COL_EXTREMUM]} = ${f}`);
}

function simplex(matrix) {

    if (hasBNegative(matrix)) {
        swapBazis(matrix, getIndexesOfMax(matrix));
        newMatrix(matrix, getIndexesOfMax(matrix));
    }

    solveD(matrix);


    if (EXTREMUM === "max") {
        while (!checkOptimality(matrix)) {
            console.log('before iteration', matrix)
            iteration(matrix);
            console.log('after iteration', matrix)
        }
    } 
    else {
        while (checkOptimality(matrix)) {
            iteration(matrix);
        }
    }

    console.log(matrix);

    calculateFunc();
}