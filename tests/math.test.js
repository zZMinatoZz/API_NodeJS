const { calculateTip, celsiusToFahrenheit, fahrenheitToCelsius, add } = require('../src/math');


test('should calculate total with tip', () => {
    const total = calculateTip(10, .3);
    expect(total).toBe(13);
});

test('should calculate total with default tip', () => {
    const total = calculateTip(10);
    expect(total).toBe(12.5);
});

test('should convert 32 F to 0 C', () => {
    const result = fahrenheitToCelsius(32);
    expect(result).toBe(0);
});

test('should convert 0 C to 32 F', () => {
    const result = celsiusToFahrenheit(0);
    expect(result).toBe(32);
});

// test promise
// passing 'done' parameter to let jest know that something asynchronous is happening
test('should add two numbers', (done) => {
    add(2, 3).then((sum) => {
        expect(sum).toBe(5);
        done();
    })
});

// test async/await
test('should add two numbers async/await', async () => {
    const sum = await add(10, 11);
    expect(sum).toBe(21);
});