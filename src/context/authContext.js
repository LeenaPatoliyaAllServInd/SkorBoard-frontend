import { createContext, useState } from 'react'
export const authContext = createContext({})


export const AuthContextProvider = (props) => {
    const [user, setUser] = useState("")
    const loginUser = (userData) => {
        setUser(userData);
    };
    return (
        <authContext.Provider value={{ user, loginUser }}>
            {props.children}
        </authContext.Provider >
    )
}