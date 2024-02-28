const matrix1 = [
    [   'F',   2, 1, 0, 0, 0, 0, 0, 'max' ],
    [ 'базис', 1,  2, 3, 4, 5, 6, 'b', 'q' ],
    [    3,   -4, -6, 1, 0, 0, 0, -20 ],
    [    4,   -2,  5, 0, 1, 0, 0,  27 ],
    [    5,    7,  5, 0, 0, 1, 0,  63 ],
    [    6,    3, -2, 0, 0, 0, 1,  23 ],
    [   'd',   0,  0, 0, 0, 0, 0,  0 ]
]

const matrix2 = [
    [   'F',   2, 1, 0, 0, 0, 0, 0, 'min' ],
    [ 'базис', 1,  2, 3, 4, 5, 6, 'b', 'q' ],
    [    3,   -4, -6, 1, 0, 0, 0, -20 ],
    [    4,   -2,  5, 0, 1, 0, 0,  27 ],
    [    5,    7,  5, 0, 0, 1, 0,  63 ],
    [    6,    3, -2, 0, 0, 0, 1,  23 ],
    [   'd',   0,  0, 0, 0, 0, 0,  0 ]
]

const matrix3 = [
    [   'F',   7,  8, 6, 5, 0, 0, 0, 0, 'max' ],
    [ 'базис', 1,  2, 3, 4, 5, 6, 7, 'b', 'q' ],
    [    5,    1,  3, 5, 3, 1, 0, 0,  40 ],
    [    6,    2,  6, 1, 0, 0, 1, 0,  50 ],
    [    7,    2,  3, 2, 5, 0, 0, 1,  30 ],
    [   'd',   0,  0, 0, 0, 0, 0, 0,  0 ]
]

const matrix4 = [
    [   'F',   1,  3, 0, 0, 0,  0, 'max' ],
    [ 'базис', 1,  2, 3, 4, 5, 'b', 'q' ],
    [    3,    1,  2, 1, 0, 0,  8 ],
    [    4,    3,  1, 0, 1, 0,  6 ],
    [    5,   -2, -3, 0, 0, 1, -3 ],
    [   'd',   0,  0, 0, 0, 0,  0 ]
]

const matrix5 = [
    [   'F',   4,  3, 0, 0, 0,  0, 'min' ],
    [ 'базис', 1,  2, 3, 4, 5, 'b', 'q' ],
    [    3,    1,  4, 1, 0, 0,  8 ],
    [    4,    3,  1, 0, 1, 0,  6 ],
    [    5,   -4, -3, 0, 0, 1, -3 ],
    [   'd',   0,  0, 0, 0, 0,  0 ]
]

const matrix6 = [
    [   'F',   3,  3, 0, 0, 0,  0, 'max' ],
    [ 'базис', 1,  2, 3, 4, 5, 'b', 'q' ],
    [    3,    -1,  -2, 1, 0, 0,  -10 ],
    [    4,    -2,  -1, 0, 1, 0,  -6 ],
    [    5,   -2, -3, 0, 0, 1, -3 ],
    [   'd',   0,  0, 0, 0, 0,  0 ]
]

const matrix7 = [
    [   'F',   2,  6, 0, 0, 0,  0, 'min' ],
    [ 'базис', 1,  2, 3, 4, 5, 'b', 'q' ],
    [    3,    1,  2, 1, 0, 0,  8 ],
    [    4,    1,  3, 0, 1, 0,  6 ],
    [    5,   -1, -1, 0, 0, 1, -10 ],
    [   'd',   0,  0, 0, 0, 0,  0 ]
]

const matrixes = [
    matrix1,
    matrix2,
    matrix3,
    matrix4,
    matrix5,
    matrix6,
    matrix7
]

let INDEX_COL_B;
let INDEX_COL_Q;
let INDEX_COL_EXTREMUM;
let EXTREMUM;


for (let matrix of matrixes) {
    INDEX_COL_B = matrix[1].findIndex((value) => value === 'b');
    INDEX_COL_Q = matrix[1].findIndex((value) => value === 'q');
    INDEX_COL_EXTREMUM = matrix[0].findIndex((value) => value === 'max' || value === "min" );
    EXTREMUM = matrix[0][INDEX_COL_EXTREMUM];

    
    simplex(matrix);
    console.log('------------------------');
}

function getColumn(matrix, columnIndex) {
    let column = [];

    for (let i = 2; i < matrix.length; i++) {
        column.push(matrix[i][columnIndex]);
    }

    return column;
}

function hasBNegative(matrix) {
    let bColumn = getColumn(matrix, INDEX_COL_B);

    if (bColumn.find((element) => element < 0)) {
        console.log("В столбце B присутствует отрицательное число!");
        return true;
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



    if (matrix[rowMaxIndex].slice(1, -1).every((element) => element >= 0)) {
        return false;
    }

    for (let i = 1; i < matrix[rowMaxIndex].length - 1; i++) {
        current = matrix[rowMaxIndex][i];

        if (current < 0 && Math.abs(current) > max) {
            max = Math.abs(current);
            colMaxIndex = i;
        }
        
    }

    return [ rowMaxIndex, colMaxIndex ];
}

function swapBazis(matrix, indexes) {
    if (indexes === false) {
        return false;
    }
    let [row, col] = indexes;

    matrix[row][0] = matrix[1][col];
    return true;
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

    for (let di = 1; di < INDEX_COL_B + 1; di++) {

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

    matrix[matrix.length - 1].splice(1, INDEX_COL_B + 1, ...deltas.slice(1));
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
    let array = [];

    for (let row = 2; row < matrix.length - 1; row++) {
        Q = matrix[row][INDEX_COL_B] / matrix[row][indexMinDelta];
        matrix[row][INDEX_COL_Q] = Q < 0 ? Infinity : Q;
        array.push(matrix[row][INDEX_COL_Q]);
    }

    if (array.every((element) => element === Infinity)) {
        return false;
    }
    return true;
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

    if (!calculateQ(matrix)) {
        return false;
    }

    minXi = getMinQ(matrix);

    swapBazis(matrix, [minXi, minYi]);    
    newMatrix(matrix, [minXi, minYi]);
    solveD(matrix);
    return true;
}

function calculateFunc(matrix) {
    let f = 0;

    for (let row = 2; row < matrix.length - 1; row++) {
        f += matrix[row][INDEX_COL_B] * matrix[0][matrix[row][0]];
    }

    console.log(`Значение функции F в точке ${matrix[0][INDEX_COL_EXTREMUM]} = ${f}`);
}

function simplex(matrix) {
    let isInfinitySolve = false;
    let hasSolution = true;

    while (hasBNegative(matrix)) {
        let indexes = getIndexesOfMax(matrix);

        if (indexes === false) {
            hasSolution = false;
            break;
        }

        swapBazis(matrix, indexes) 
        newMatrix(matrix, indexes);
    }

    solveD(matrix);

    if (EXTREMUM === "max") {
        while (!checkOptimality(matrix)) {
            if (!iteration(matrix)) {
                isInfinitySolve = true;
                break;
            }
        }
    } 
    else {
        while (checkOptimality(matrix) && hasSolution) {
            iteration(matrix);
        }
    }

    console.log(matrix);

    if (isInfinitySolve) {
        console.log("Функция не ограничена");
    } 
    else if (!hasSolution) {
        console.log('Нет решений')
    }
    else {
        calculateFunc(matrix);
    }
}