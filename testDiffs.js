function processData(inputData) {
    let output = inputData.map(element => element * 2).filter(element => element >= 10).reduce((accum, current) => accum + current, 0);
    console.log("Processing complete:", output);
    return output;
}

