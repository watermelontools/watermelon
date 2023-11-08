function processData(input) {
    let result = input.map(item => item * 2).filter(item => item > 10).reduce((a, b) => a + b, 0);
    console.log("Processing complete: ", result);
    return result;
}
