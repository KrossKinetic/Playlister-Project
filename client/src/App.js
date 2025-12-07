import './App.css';
import { React } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { AuthContextProvider } from './auth';
import { GlobalStoreContextProvider } from './store'
import {
    AppBanner,
    LoginScreen,
    RegisterScreen,
    EditAccount,
    PlaylistsScreen,
    SongsCatalog,
    HomeWrapper
} from './components'

const App = () => {
    return (
        <BrowserRouter>
            <AuthContextProvider>
                <GlobalStoreContextProvider>
                    <AppBanner />
                    <Switch>
                        <Route path="/" exact component={HomeWrapper} />
                        <Route path="/login/" exact component={LoginScreen} />
                        <Route path="/register/" exact component={RegisterScreen} />
                        <Route path="/updateAccount/" exact component={EditAccount} />
                        <Route path="/playlists" exact component={PlaylistsScreen} />
                        <Route path="/songs" exact component={SongsCatalog} />
                    </Switch>
                </GlobalStoreContextProvider>
            </AuthContextProvider>
        </BrowserRouter>
    )
}

export default App