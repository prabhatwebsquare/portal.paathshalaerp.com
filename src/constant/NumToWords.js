export const NumberToWords = (n) => {
    if (n < 0)
        return false;
    const single_digit = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const double_digit = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const below_hundred = ['Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    if (n === 0) return <p>Zero.</p>;

    function translate(n) {
        let word = "";
        if (n < 10) {
            word = single_digit[n] + ' ';
        }
        else if (n < 20) {
            word = double_digit[n - 10] + ' ';
        }
        else if (n < 100) {
            const rem = translate(n % 10);
            word = below_hundred[(n - n % 10) / 10 - 2] + ' ' + rem;
        }
        else if (n < 1000) {
            word = single_digit[Math.trunc(n / 100)] + ' Hundred ' + translate(n % 100);
        }
        else if (n < 100000) {
            word = translate(parseInt(n / 1000)).trim() + ' Thousand ' + translate(n % 1000);
        }
        else if (n < 10000000) {
            word = translate(parseInt(n / 100000)).trim() + ' Lakh ' + translate(n % 100000);
        }
        else if (n < 1000000000) {
            word = translate(parseInt(n / 10000000)).trim() + ' Crore ' + translate(n % 10000000);
        }
        else {
            word = translate(parseInt(n / 1000000000)).trim() + ' Billion ' + translate(n % 1000000000);
        }
        return word;
    }

    const result = translate(n);
    return result.trim()
}