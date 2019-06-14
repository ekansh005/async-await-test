const axios = require('axios');

const getExchangeRate = async (fromCurrency, toCurrency) => {
    //http://apilayer.net/api/live?access_key=ffdbece3d2135f450c80443a1820356d&currencies=USD,AUD,CAD,PLN,MXN,EUR,INR&format=1
    try {
        const response = await axios.get('http://data.fixer.io/api/latest?access_key=eecdc789fbeaff5bdf213d88e512c5d4&format=1');
        const rate = response.data.rates;
        const euro = 1 / rate[fromCurrency];
        const exchangeRate = euro * rate[toCurrency];

        return exchangeRate;
    } catch (error) {
        throw new Error(`Unable to get currency ${fromCurrency} and ${toCurrency}`);
    }
};

const getCountries = async (currencyCode) => {
    try {
        const response = await axios.get(`https://restcountries.eu/rest/v2/currency/${currencyCode}`);

        return response.data.map(country => country.name);
    } catch (error) {
        throw new Error(`Unable to get countries that use ${currencyCode}`);
    }
};

const convert = async (fromCurrency, toCurrency, amount) => {
    const exchangeRate = await getExchangeRate(fromCurrency, toCurrency);
    const countries = await getCountries(toCurrency);
    const convertedAmount = (amount * exchangeRate).toFixed(2);

    return `${amount} ${fromCurrency} is worth of ${convertedAmount} ${toCurrency}. 
            You can spend this in following countries: ${countries}`;
}

convert('EUR', 'INR', 1000)
    .then((message) => {
        console.log(message);
    }).catch((error) => {
        console.log(error.message);
    });