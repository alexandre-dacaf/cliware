// masks.ts
import { Mask, MaskFunction } from 'types';

interface CurrencyFormat {
    symbol: string;
    decimal: string;
    thousand: string;
}

export const getMaskFunction = (mask: Mask): MaskFunction => {
    if (typeof mask === 'string' && mask.startsWith('currency-')) {
        return maskCurrency(mask);
    }

    switch (mask) {
        case 'cpf':
            return maskCPF;
        case 'cnpj':
            return maskCNPJ;
        case 'phone':
            return maskPhone;
        case 'cep':
            return maskCEP;
        case 'date':
            return maskDate;
        case 'time':
            return maskTime;
        case 'datetime':
            return maskDatetime;
        case 'credit-card':
            return maskCreditCard;
        case 'ipv4-address':
            return maskIPv4Address;
        case 'ipv6-address':
            return maskIPv6Address;
        case 'hex-color':
            return maskHexColor;

        default:
            if (typeof mask === 'function') {
                return mask;
            } else {
                return (value: string) => value; // Identity function
            }
    }
};

// Function to remove all non-digit characters
const onlyNumbers = (value: string) => value.replace(/\D/g, '');

// Function to remove all non-hexadecimal characters
const onlyHexChars = (value: string) => value.replace(/[^a-fA-F0-9]/g, '');

// CPF Mask: 000.000.000-00
const maskCPF = (value: string): string => {
    const numbers = onlyNumbers(value).slice(0, 11); // CPF has 11 digits
    return numbers
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
};

// CNPJ Mask: 00.000.000/0000-00
const maskCNPJ = (value: string): string => {
    const numbers = onlyNumbers(value).slice(0, 14); // CNPJ has 14 digits
    return numbers
        .replace(/(\d{2})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2');
};

// Phone Mask: (00) 00000-0000 or (00) 0000-0000
const maskPhone = (value: string): string => {
    const numbers = onlyNumbers(value).slice(0, 11); // Phone can have 10 or 11 digits
    return numbers
        .replace(/^(\d{2})(\d)/, '($1) $2')
        .replace(/^(\(\d{2}\)) (\d{4})(\d{1,4})$/, '$1 $2-$3')
        .replace(/^(\(\d{2}\)) (\d{5})(\d{4})$/, '$1 $2-$3');
};

// CEP Code Mask: 00000-000
const maskCEP = (value: string): string => {
    const numbers = onlyNumbers(value).slice(0, 8); // CEP has 8 digits
    return numbers.replace(/(\d{5})(\d)/, '$1-$2');
};

// Date Mask: DD/MM/YYYY
const maskDate = (value: string): string => {
    const numbers = onlyNumbers(value).slice(0, 8); // Date has 8 digits
    return numbers.replace(/^(\d{2})(\d)/, '$1/$2').replace(/^(\d{2})\/(\d{2})(\d)/, '$1/$2/$3');
};

// Time Mask: HH:MM or HH:MM:SS
const maskTime = (value: string): string => {
    const numbers = onlyNumbers(value).slice(0, 6); // Up to HHMMSS
    return numbers.replace(/^(\d{2})(\d)/, '$1:$2').replace(/^(\d{2}):(\d{2})(\d)/, '$1:$2:$3');
};

// Datetime Mask: DD/MM/YYYY HH:mm:ss
const maskDatetime = (value: string): string => {
    const numbers = onlyNumbers(value).slice(0, 14); // Datetime has 14 digits: 8 for date, 6 for time
    return numbers
        .replace(/^(\d{2})(\d)/, '$1/$2') // Format day/month
        .replace(/^(\d{2})\/(\d{2})(\d)/, '$1/$2/$3') // Format year
        .replace(/^(\d{2})\/(\d{2})\/(\d{4})(\d)/, '$1/$2/$3 $4') // Add space for time
        .replace(/^(\d{2})\/(\d{2})\/(\d{4}) (\d{2})(\d)/, '$1/$2/$3 $4:$5') // Add minutes
        .replace(/^(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})(\d)/, '$1/$2/$3 $4:$5:$6'); // Add seconds
};

// Credit Card Mask: 0000 0000 0000 0000
const maskCreditCard = (value: string): string => {
    const numbers = onlyNumbers(value).slice(0, 16); // Credit card has up to 16 digits
    return numbers
        .replace(/(\d{4})(\d)/, '$1.$2')
        .replace(/(\d{4})\.(\d{4})(\d)/, '$1.$2.$3')
        .replace(/(\d{4})\.(\d{4})\.(\d{4})(\d)/, '$1.$2.$3.$4');
};

// Currency Mask: Supports multiple currencies
const maskCurrency = (maskType: string): MaskFunction => {
    const currencyFormats: { [key: string]: CurrencyFormat } = {
        'currency-BRL': { symbol: 'R$', decimal: ',', thousand: '.' },
        'currency-USD': { symbol: '$', decimal: '.', thousand: ',' },
        'currency-EUR': { symbol: '€', decimal: ',', thousand: '.' },
        'currency-GBP': { symbol: '£', decimal: '.', thousand: ',' },
        'currency-JPY': { symbol: '¥', decimal: '', thousand: ',' }, // No decimal for JPY
        // Add more currencies as needed
    };

    return (value: string) => {
        const format = currencyFormats[maskType];
        if (!format) {
            // If the currency format is not defined, return the value unformatted
            return value;
        }

        const { symbol, decimal, thousand } = format;

        let numbers = onlyNumbers(value);

        // Handle currencies without decimal (e.g., JPY)
        const hasDecimal = decimal !== '';

        if (hasDecimal) {
            // Insert decimal separator before the last two digits
            numbers = numbers.slice(0, -2) + decimal + numbers.slice(-2);
        }

        // Add thousand separators
        const regex = /\B(?=(\d{3})+(?!\d))/g;
        numbers = hasDecimal ? numbers.replace(regex, thousand) : numbers.replace(regex, thousand);

        // Prepend the currency symbol
        return `${symbol} ${numbers}`;
    };
};

// IPv4 Address Mask: 192.168.0.1
const maskIPv4Address = (value: string): string => {
    const numbers = onlyNumbers(value).slice(0, 12); // Max 12 digits for IP
    return numbers
        .replace(/(\d{1,3})(\d)/, '$1.$2')
        .replace(/(\d{1,3})\.(\d{1,3})(\d)/, '$1.$2.$3')
        .replace(/(\d{1,3})\.(\d{1,3})\.(\d{1,3})(\d)/, '$1.$2.$3.$4');
};

// IPv6 Address Mask: 2001:0db8:85a3:0000:0000:8a2e:0370:7334
const maskIPv6Address = (value: string): string => {
    const hex = onlyHexChars(value).slice(0, 32); // Max 32 hex characters for IPv6
    return hex
        .replace(/^([a-fA-F0-9]{4})([a-fA-F0-9])/g, '$1:$2') // After first 4
        .replace(/^([a-fA-F0-9]{4}:[a-fA-F0-9]{4})([a-fA-F0-9])/g, '$1:$2') // After second 4
        .replace(/^([a-fA-F0-9]{4}:[a-fA-F0-9]{4}:[a-fA-F0-9]{4})([a-fA-F0-9])/g, '$1:$2') // After third 4
        .replace(
            /^([a-fA-F0-9]{4}:[a-fA-F0-9]{4}:[a-fA-F0-9]{4}:[a-fA-F0-9]{4})([a-fA-F0-9])/g,
            '$1:$2'
        ) // After fourth 4
        .replace(
            /^([a-fA-F0-9]{4}:[a-fA-F0-9]{4}:[a-fA-F0-9]{4}:[a-fA-F0-9]{4}:[a-fA-F0-9]{4})([a-fA-F0-9])/g,
            '$1:$2'
        ) // After fifth 4
        .replace(
            /^([a-fA-F0-9]{4}:[a-fA-F0-9]{4}:[a-fA-F0-9]{4}:[a-fA-F0-9]{4}:[a-fA-F0-9]{4}:[a-fA-F0-9]{4})([a-fA-F0-9])/g,
            '$1:$2'
        ) // After sixth 4
        .replace(
            /^([a-fA-F0-9]{4}:[a-fA-F0-9]{4}:[a-fA-F0-9]{4}:[a-fA-F0-9]{4}:[a-fA-F0-9]{4}:[a-fA-F0-9]{4}:[a-fA-F0-9]{4})([a-fA-F0-9])/g,
            '$1:$2'
        ); // After seventh 4
};

// Hex Color Code Mask: #77bcfb
const maskHexColor = (value: string): string => {
    const hex = onlyHexChars(value).slice(0, 6);
    return hex ? `#${hex}` : '';
};
