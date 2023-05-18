solveButton.addEventListener('click', run);

function run(){
    try {
        outputDiv.innerHTML = ' ';
        let data = pointsInput.value;
        data = data.replaceAll('(', '[').replaceAll(')', ']');
        solve(JSON.parse(`[${data}]`));
    } catch (error) {
        display('An error occurred, please check your input', '');
    }
}

function solve(input){

    const points = input;
    display('Input Points: ', JSON.stringify(points));

    /*
    Create a matrix M where row n of M is Rn = xn^3, xn^2, xn, 1, yn
    Submatrix A of columns 1-4 represent matrix coefficients of a,b,c,d respectively such that A*(a,b,c,d)^T = b 
    where b is a vector in R^4 consisting of yn
    Representing yn = a*xn^3 + b*xn^2 + c*xn + d
    Hence M = A|b
    */

    let M = Array(4);
    for (let i = 0; i < 4; i++) {
        let [x,y] = points[i];
        let R = [x**3, x**2, x, 1, y];
        M[i] = R;
    }

    //Handle y-intercepts by interchanging target row with row 4 in matrix
    M.forEach((R,i) => {
        if (!R[0]){
            M[i] = M[3];
            M[3] = R;
            return;
        }
    })
    display('Matrix: ', JSON.stringify(M));

    /*
    Perform Gaussian Elimination to transform M into row-echelon form
    */

    for (let i = 1; i < 4; i++) {
        reduceColumn(i)
    }

    function reduceColumn(column){
        for (let i = 0; i < (4 - column); i++) {
            //Get reference row
            let Rf = M[column - 1];

            //Get row to transform
            let Rn = M[i + column];

            //Get multiplier a where Rn[x] - a*Rf[x] = 0 where x is the index of first non-zero term in Rn
            let a = (Rn[column - 1] / Rf[column - 1]);

            //Perform row transformation on Rn of form Rn = Rn - a*Rf
            Rn = Rn.map((xn, j) => {
                return xn - (a * Rf[j]);
            })

            M[i + column] = Rn;
        }
    }

    display('Row-Echelon Form: ', JSON.stringify(M));

    /*
    Solve simultaneous equations from matrix
    */

    let R;

    R = M[3];
    const d = R[4] / R[3];

    R = M[2];
    const c = (R[4] - (R[3] * d))/R[2];

    R = M[1];
    const b = (R[4] - (R[3] * d) - (R[2] * c))/R[1];

    R = M[0];
    const a = (R[4] - (R[3] * d) - (R[2] * c) - (R[1] * b))/R[0];

    display('Coefficients: ', `a: ${a}, b: ${b}, c: ${c}, d: ${d}`);

    /*
    Obtain cubic equation
    */

    const cubicEquation = `y = ${a}*x^3 + ${b}*x^2 + ${c}*x + ${d}`;
    display('<b>Cubic Equation: </b>', cubicEquation);
}

function display(label, data){
    console.log(label, data);
    outputDiv.innerHTML += `${label}<br>${data}<br><br>`;
}