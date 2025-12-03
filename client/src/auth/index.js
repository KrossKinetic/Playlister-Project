import React, { createContext, useEffect, useState } from "react";
import { useHistory } from 'react-router-dom'
import authRequestSender from './requests'

const AuthContext = createContext();
console.log("create AuthContext: " + AuthContext);

// THESE ARE ALL THE TYPES OF UPDATES TO OUR AUTH STATE THAT CAN BE PROCESSED
export const AuthActionType = {
    GET_LOGGED_IN: "GET_LOGGED_IN",
    LOGIN_USER: "LOGIN_USER",
    LOGOUT_USER: "LOGOUT_USER",
    REGISTER_USER: "REGISTER_USER",
    UPDATE_USER: "UPDATE_USER",
    GUEST_LOGIN: "GUEST_LOGIN",
    RESET_ERROR: "RESET_ERROR"
}

function AuthContextProvider(props) {
    const [auth, setAuth] = useState({
        user: null,
        loggedIn: false,
        guestLoggedIn: false,
        errorMessage: null
    });
    const history = useHistory();

    useEffect(() => {
        auth.getLoggedIn();
    }, []);

    useEffect(() => {
        history.listen((location) => {
            authReducer({
                type: AuthActionType.RESET_ERROR,
                payload: null
            });
        });
    }, [history]);

    const authReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            case AuthActionType.GET_LOGGED_IN: {
                return setAuth({
                    user: payload.user,
                    loggedIn: payload.loggedIn,
                    guestLoggedIn: payload.guestLoggedIn,
                    errorMessage: null
                });
            }
            case AuthActionType.LOGIN_USER: {
                return setAuth({
                    user: payload.user,
                    loggedIn: payload.loggedIn,
                    guestLoggedIn: payload.guestLoggedIn,
                    errorMessage: payload.errorMessage
                })
            }
            case AuthActionType.GUEST_LOGIN: {
                return setAuth({
                    user: payload.user,
                    loggedIn: payload.loggedIn,
                    guestLoggedIn: payload.guestLoggedIn,
                    errorMessage: payload.errorMessage
                })
            }
            case AuthActionType.LOGOUT_USER: {
                return setAuth({
                    user: null,
                    loggedIn: false,
                    guestLoggedIn: false,
                    errorMessage: null
                })
            }
            case AuthActionType.REGISTER_USER: {
                return setAuth({
                    user: payload.user,
                    loggedIn: payload.loggedIn,
                    guestLoggedIn: payload.guestLoggedIn,
                    errorMessage: payload.errorMessage
                })
            }
            case AuthActionType.UPDATE_USER: {
                return setAuth({
                    user: payload.user,
                    loggedIn: payload.loggedIn,
                    guestLoggedIn: payload.guestLoggedIn,
                    errorMessage: payload.errorMessage
                })
            }
            case AuthActionType.RESET_ERROR: {
                return setAuth((prevAuth) => ({
                    ...prevAuth,
                    errorMessage: null
                }));
            }
            default:
                return auth;
        }
    }

    auth.getLoggedIn = async function () {
        const response = await authRequestSender.getLoggedIn();
        if (response.status === 200) {
            authReducer({
                type: AuthActionType.GET_LOGGED_IN,
                payload: {
                    loggedIn: response.data.loggedIn,
                    user: response.data.user,
                    guestLoggedIn: response.data.user?.email === "h7g2f9d4s1@guest.playlister.com"
                }
            });
        }
    }

    auth.updateUser = async function (username, avatarPng, password, passwordVerify) {
        console.log("UPDATING USER");
        try {
            const response = await authRequestSender.updateUser(auth.user.email, username, avatarPng, password, passwordVerify);
            if (response.status === 200) {
                console.log("Updated Sucessfully");
                authReducer({
                    type: AuthActionType.UPDATE_USER,
                    payload: {
                        user: response.data.user,
                        loggedIn: true,
                        guestLoggedIn: false,
                        errorMessage: null
                    }
                })
                history.goBack();
            } else {
                authReducer({
                    type: AuthActionType.UPDATE_USER,
                    payload: {
                        user: auth.user,
                        loggedIn: false,
                        guestLoggedIn: false,
                        errorMessage: response.data.errorMessage
                    }
                })
            }
        } catch (error) {
            authReducer({
                type: AuthActionType.UPDATE_USER,
                payload: {
                    user: auth.user,
                    loggedIn: false,
                    guestLoggedIn: false,
                    errorMessage: error.message
                }
            })
        }
    }

    auth.registerUser = async function (username, avatarPng, email, password, passwordVerify) {
        console.log("REGISTERING USER");
        try {
            const response = await authRequestSender.registerUser(username, avatarPng, email, password, passwordVerify);
            if (response.status === 200) {
                console.log("Registered Sucessfully");
                authReducer({
                    type: AuthActionType.REGISTER_USER,
                    payload: {
                        user: response.data.user,
                        loggedIn: true,
                        guestLoggedIn: false,
                        errorMessage: null
                    }
                })
                history.push("/login");
                console.log("NOW WE LOGIN");
                auth.loginUser(email, password);
                console.log("LOGGED IN");
            } else {
                authReducer({
                    type: AuthActionType.REGISTER_USER,
                    payload: {
                        user: auth.user,
                        loggedIn: false,
                        guestLoggedIn: false,
                        errorMessage: response.data.errorMessage
                    }
                })
            }
        } catch (error) {
            console.log("ERROR REGISTERING USER");
            authReducer({
                type: AuthActionType.REGISTER_USER,
                payload: {
                    user: auth.user,
                    loggedIn: false,
                    guestLoggedIn: false,
                    errorMessage: error.message
                }
            })
        }
    }

    auth.loginUser = async function (email, password) {
        try {
            const response = await authRequestSender.loginUser(email, password);
            if (response.status === 200) {
                authReducer({
                    type: AuthActionType.LOGIN_USER,
                    payload: {
                        user: response.data.user,
                        loggedIn: true,
                        guestLoggedIn: false,
                        errorMessage: null
                    }
                })
                history.push("/playlists");
            } else { // Note to self, catch does not catch http errors and thus we need to check the response status
                authReducer({
                    type: AuthActionType.LOGIN_USER,
                    payload: {
                        user: auth.user,
                        loggedIn: false,
                        guestLoggedIn: false,
                        errorMessage: response.data.errorMessage
                    }
                })
            }
        } catch (error) {
            authReducer({
                type: AuthActionType.LOGIN_USER,
                payload: {
                    user: auth.user,
                    loggedIn: false,
                    guestLoggedIn: false,
                    errorMessage: error.message
                }
            })
        }
    }

    auth.loginGuest = async function () {
        try {
            const response = await authRequestSender.loginGuest();
            if (response.status === 200) {
                authReducer({
                    type: AuthActionType.GUEST_LOGIN,
                    payload: {
                        user: response.data.user,
                        loggedIn: true,
                        guestLoggedIn: true,
                        errorMessage: null
                    }
                })
                history.push("/playlists");
            } else {
                authReducer({
                    type: AuthActionType.GUEST_LOGIN,
                    payload: {
                        user: auth.user,
                        loggedIn: false,
                        guestLoggedIn: false,
                        errorMessage: response.data.errorMessage
                    }
                })
            }
        } catch (error) {
            authReducer({
                type: AuthActionType.GUEST_LOGIN,
                payload: {
                    user: auth.user,
                    loggedIn: false,
                    guestLoggedIn: false,
                    errorMessage: error.message
                }
            })
        }
    }

    auth.logoutUser = async function () {
        const response = await authRequestSender.logoutUser();
        if (response.status === 200) {
            authReducer({
                type: AuthActionType.LOGOUT_USER,
                payload: null
            })
            history.push("/");
        }
    }

    auth.logoutGuest = async function () {
        const response = await authRequestSender.logoutUser();
        if (response.status === 200) {
            authReducer({
                type: AuthActionType.LOGOUT_USER,
                payload: null
            })
        }
    }

    auth.getUserAvatar = function () {
        if (auth.user) {
            return auth.user.avatarPng;
        }
        return "";
    }

    return (
        <AuthContext.Provider value={{
            auth
        }}>
            {props.children}
        </AuthContext.Provider>
    );
}

export default AuthContext;
export { AuthContextProvider };