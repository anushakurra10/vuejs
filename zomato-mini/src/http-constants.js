import axios from 'axios';

let baseURL;

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    baseURL = 'https://developers.zomato.com/api/v2.1/';
} else {
    baseURL = 'https://developers.zomato.com/api/v2.1/';
}

export const HTTP = axios.create({
    baseURL: baseURL,
    headers: {
        'user-key': '4e98cde9ee71c705ff4012ba5f7caaab'
    }
});
