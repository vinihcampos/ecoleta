import axios from 'axios';
import { API_IBGE } from '../constants';

const ibge = axios.create({
    baseURL: API_IBGE
});

export default ibge;