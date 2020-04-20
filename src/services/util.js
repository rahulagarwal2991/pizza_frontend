export function brCurrency(value) {
    return parseFloat(value).toLocaleString('nl', { style: 'currency', currency: 'INR' })
}
