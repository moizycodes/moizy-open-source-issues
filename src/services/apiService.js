// src/services/apiServices.js
const { NetworkError, ServerError, handleError } = require("../utils/errorHandler");

const fetchData = async (url) => {
    try {
        const response = await fetch(url);

        if(!response.ok){
            throw new ServerError(response.status, response.statusText);
        }

        const data = await response.json();
        return data;
    
    } catch (error) {
        if(error instanceof TypeError) {
            // fetch throws TypeError for network failures
            handleError(new NetworkError(error.message));
        } else {
            handleError(error);
        }
    }
};

module.exports = fetchData;