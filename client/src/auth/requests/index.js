/*
    This is our http api for all things auth, which we use to 
    send authorization requests to our back-end API. Note we`re 
    using the Axios library for doing this, which is an easy to 
    use AJAX-based library. We could (and maybe should) use Fetch, 
    which is a native (to browsers) standard, but Axios is easier
    to use when sending JSON back and forth and it`s a Promise-
    based API which helps a lot with asynchronous communication.
    
    @author McKilla Gorilla
*/

const BASE_URL = 'http://localhost:4000/auth';

export async function api(path, options = {}) {
    const url = `${BASE_URL}${path}`;

    const res = await fetch(url, {
        credentials: 'include',
        ...options,
    });

    return res;
}

// THESE ARE ALL THE REQUESTS WE`LL BE MAKING, ALL REQUESTS HAVE A
// REQUEST METHOD (like get) AND PATH (like /register). SOME ALSO
// REQUIRE AN id SO THAT THE SERVER KNOWS ON WHICH LIST TO DO ITS
// WORK, AND SOME REQUIRE DATA, WHICH WE WE WILL FORMAT HERE, FOR WHEN
// WE NEED TO PUT THINGS INTO THE DATABASE OR IF WE HAVE SOME
// CUSTOM FILTERS FOR QUERIES

export async function getLoggedIn() {
    const res = await api(`/loggedIn/`, {
        method: 'GET'
    });

    let data = { success: false };
    try {
        data = await res.json();
    } catch (err) { }

    return { data: data, status: res.status, statusText: res.statusText };
}

export async function loginUser(email, password) {
    const res = await api(`/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: email,
            password: password
        })
    });

    let data = { success: false };
    try {
        data = await res.json();
    } catch (err) { }

    return { data: data, status: res.status, statusText: res.statusText };
}

export async function loginGuest() {
    const res = await api(`/loginGuest/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    });

    let data = { success: false };
    try {
        data = await res.json();
    } catch (err) { }

    return { data: data, status: res.status, statusText: res.statusText };
}


export async function logoutUser() {
    const res = await api(`/logout/`, {
        method: 'GET'
    });

    let data = { success: false };
    try {
        data = await res.json();
    } catch (err) { }

    return { data: data, status: res.status, statusText: res.statusText };
}

export async function registerUser(username, avatarPng, email, password, passwordVerify) {
    const res = await api(`/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username: username,
            avatarPng: avatarPng,
            email: email,
            password: password,
            passwordVerify: passwordVerify
        })
    });

    let data = { success: false };
    try {
        data = await res.json();
    } catch (err) { }

    return { data: data, status: res.status, statusText: res.statusText };
}

export async function updateUser(email, username, avatarPng, password, passwordVerify) {
    const res = await api(`/updateAccount/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: email,
            username: username,
            avatarPng: avatarPng,
            password: password,
            passwordVerify: passwordVerify
        })
    });

    let data = { success: false };
    try {
        data = await res.json();
    } catch (err) { }

    return { data: data, status: res.status, statusText: res.statusText };
}

const apis = {
    getLoggedIn,
    registerUser,
    loginUser,
    loginGuest,
    logoutUser,
    updateUser
}

export default apis
