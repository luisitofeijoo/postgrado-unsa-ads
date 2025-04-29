import { createContext, useContext, useState} from 'react';
const AuthContent = createContext({
    user: null,
    setUser: () => {},
});

export const AuthProvider = ({children}) => {

    const [user, _setUser] = useState(
        JSON.parse(localStorage.getItem('user')) || null
    );
    const setUser = (user) => {
        if(user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
        _setUser(user);
    }

    return <AuthContent.Provider value={{user, setUser }}>
        {children}
    </AuthContent.Provider>
}

export const useAuth = () => {
    return useContext(AuthContent);
}
