import React, {useState} from "react";

const UserContext = React.createContext();

export const AuthProvider = ({children})=>{
    const [text, setText] = useState('');
    const [message, setMessage] = useState([]);
    const [urlData, setUrlData] = useState('');
    const [responseFrom, setResponseFrom] = useState('');
    const [fileCheck, setFileCheck] = useState('')
    const [token, setToken] = useState('');
    const [label, setLabel] = useState([]);
    const [urlHistory, setUrlHistory] = useState([]);
    const [pdfLabel, setPdfLabel] = useState([]);
    const [primaryInput, setPrimaryInput] = useState('');
    const [questions, setQuestion] = useState([]);
    const [pdfData, setPdfData] = useState([]);
    const [newText, setNewText] = useState('');
    const [URL, setUrl] = useState('')
    const [questionId, setQuestionId] = useState([]);

    return (
        <UserContext.Provider value={{questionId, setQuestionId, newText, setNewText, pdfData, setPdfData, pdfLabel, setPdfLabel, urlHistory, setUrlHistory, urlData, setUrlData, URL, setUrl, primaryInput, setPrimaryInput, fileCheck, setFileCheck, responseFrom, setResponseFrom, message, setMessage, text, setText, token, setToken, label, setLabel, questions, setQuestion}}>
            {children}
        </UserContext.Provider>
    )
}

export default UserContext;