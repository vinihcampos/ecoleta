import axios from 'axios';

const ibge = axios.create({
    baseURL: process.env.REACT_APP_IBGE
});

export default ibge;