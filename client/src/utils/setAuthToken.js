import axios from 'axios'

// Sets a global header, not make requests.

const setAuthToken = token => {
    
    // This sends a token with every request.
    if(token) {
        axios.defaults.headers.common['x-auth-token'] = token
    } else {
        delete axios.defaults.headers.common['x-auth-token']
    }
}

export default setAuthToken;