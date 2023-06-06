import React, {useState, useContext, useEffect} from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.bubble.css';
import { Container } from 'react-bootstrap';
import UserContext from '../context/UserContext';
import axios from 'axios';
import { API } from '../../config/Api';

const RichTextEditor = () => {
  const [comments, setComments] = useState('');
  const {setUrlData, urlData, text, setQuestion, message, setMessage, setFileCheck, primaryInput, setPrimaryInput, setText, setLabel, responseFrom, setResponseFrom, URL, setUrl} = useContext(UserContext)
  const [newText, setNewText] = useState('');
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const user_id = localStorage.getItem("User_ID");
  const formData = new FormData();
  formData.append('input',primaryInput);
  formData.append('user_id',user_id);

  const modules = {
    toolbar: [
      [{ 'font': [] }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'align': [] }],
      [{ 'color': [] }, { 'background': [] }],
      ['clean']
    ],
  };

  const formats = [
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'list',
    'bullet',
    'align',
    'color',
    'background'
  ];
  
  useEffect(() => {
    setNewText(text != null && text.length > 0 ? text : comments)
  })

  const getContent = (e) => {
    setLoading(true);
    e.preventDefault();
    setUrl('');
    setFileCheck('')
    setMessage('');
    setUrlData('');
    axios.post(API.BASE_URL + 'prediction/', formData, {
      'Content-Type': 'multipart/form-data',
    },)
    .then(function (response) {
        console.log("Data", response.data);
        setMessage('');
        setText('');
        setText(response.data.Answer);
        setResponseFrom(response.data.AnswerSource)
        setLabel(prevLabels => [...prevLabels, response.data.Label])
        axios.get(API.BASE_URL + 'label/' + user_id)
        .then(function (response) {
            console.log("Questions", response);
            const filteredLabels = response.data.labels.filter(label => label !== "");
            setQuestion(filteredLabels);
        })
        .catch(function (error) {
            console.log(error);
        })
    })
    .catch(function (error) {
        console.log(error)
    })
    .finally(() => setLoading(false))
  }
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      getContent(e);
    }
  };

  const handleCheckboxChange = (event, question, answer, label) => {
    if (event.target.checked) {
      setSelectedQuestions((prevSelectedQuestions) => [
        ...prevSelectedQuestions,
        { question, answer, label }
      ]);
    } else {
      setSelectedQuestions((prevSelectedQuestions) =>
        prevSelectedQuestions.filter((q) => q.question !== question)
      );
    }
  };

  const handleDataSave = (e) => {
    axios.post(API.BASE_URL + 'SaveData/', {
      Response: selectedQuestions,
    })
    .then(function (response) {
        console.log("Save Data", response.data);
    })
    .catch(function (error) {
        console.log(error)
    })
  }

  console.log("Message", message);
  console.log("selectedQuestions", selectedQuestions)
  
  
  return (
      <Container className='d-flex flex-column justify-content-between' style={{height: '95vh', minHeight: '95%'}}>
       {loading && <div className='d-flex loader-container flex-column'><div className='loader'><span></span></div> <p className='text-white'>Processing...</p></div>}
       <div className="questions-main">
       {
        message && message.length > 0 ?(
            message.map((ques, i) => {
              const question = ques?.Question;
              const answer = ques?.Answer;
              const label = ques?.Label;
            return(
              <div className="questions" key={i}>
                <input type="checkbox" onChange={(event) => handleCheckboxChange(event, question, answer, label)} />
                <div className="question-text">
                  <label htmlFor="">Q. {question}</label>
                  <p>Ans. {answer}</p>
                  <p><strong className='text-white'>Label.</strong> {label}</p>
                </div>
              </div>
            )
          })
        )
        :
        urlData && urlData.length > 0 ?(
            urlData.map((ques, i) => {
            return(
              <div className="questions" key={i}>
                <input type="checkbox" name="" id="" />
                <div className="question-text">
                  <label htmlFor="">{ques}</label>
                </div>
              </div>
            )
          })
        )
        :
        newText?.length > 0 && (
          
              <div className="questions">
                <input type="checkbox" name="" id="" />
                <div className="question-text d-flex flex-column">
                  <label htmlFor="">Q. {primaryInput}</label>
                  <p htmlFor="">Ans. {newText + " " + responseFrom}</p>
                </div>
              </div>
        )
        
       }

</div>
      {
        message && message.length > 0 && (
          <div className="save-content">
            <button className='save mb-3' onClick={(e) => {handleDataSave(e)}}>Save Data</button>
          </div>
        )}
        
        <div className="search-bar input-container w-100 position-relative">
          <input type="text" placeholder='AI writing assistant' value={primaryInput} onChange={(e) => {setPrimaryInput(e.target.value)}} onKeyDown={handleKeyPress} />
          <button type='button' className='button button-fill' onClick={(e) => {getContent(e)}}>
            <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 mr-1" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
          </button>
          <span className='mt-3 d-flex justify-content-center text-center' style={{fontSize: 12, color: '#6c6c72 '}}>© 2023 Chatbot, All rights reserved</span>
        </div>
       
      </Container>
  );
};

export default RichTextEditor;
