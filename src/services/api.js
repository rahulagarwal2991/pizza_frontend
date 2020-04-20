import * as axios from 'axios';

const instance = axios.create({
    baseURL: 'https://pizza-backend-app.herokuapp.com',
})

export default instance;
