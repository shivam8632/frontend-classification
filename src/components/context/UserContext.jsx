import React, {useState} from "react";

const UserContext = React.createContext();

export const AuthProvider = ({children})=>{
    const [text, setText] = useState([]);
    const [token, setToken] = useState('');

    return (
        <UserContext.Provider value={{text, setText, token, setToken}}>
            {children}
        </UserContext.Provider>
    )
}

export default UserContext;