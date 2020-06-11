import axios from 'axios';
import { ROOT_SERVER } from '../constants';

const api = axios.create({
    baseURL: ROOT_SERVER
});

export default api;