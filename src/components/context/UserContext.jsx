import React, {useState} from "react";

const UserContext = React.createContext();

export const AuthProvider = ({children})=>{
    const [text, setText] = useState('');
    const [token, setToken] = useState('');
    const [label, setLabel] = useState([]);
    const [questions, setQuestion] = useState([]);

    return (
        <UserContext.Provider value={{text, setText, token, setToken, label, setLabel, questions, setQuestion}}>
            {children}
        </UserContext.Provider>
    )
}

export default UserContext;