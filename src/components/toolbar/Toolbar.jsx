import React, {useState, useContext, useEffect} from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.bubble.css';
import { Container } from 'react-bootstrap';
import UserContext from '../context/UserContext';
import axios from 'axios';
import { API } from '../../config/Api';
import { toast } from 'react-toastify';

const RichTextEditor = () => {
  const {selectedValue, setUrlData, urlData, text, setQuestion, message, setMessage, setFileCheck, primaryInput, setPrimaryInput, setText, label, setLabel, responseFrom, setResponseFrom,newText, setNewText,setPdfData, pdfData, setUrl, setQuestionId} = useContext(UserContext)
  
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isContentVisible, setContentVisible] = useState(false);
  const [isSaveVisible, setIsSaveVisible] = useState(false);
  
  const user_id = localStorage.getItem("User_ID");
  
  
  useEffect(() => {
    setNewText(text != null && text.length > 0 ? text : '')
  })

  const getContent = (e) => {
    if(selectedValue !=null) {
      setLoading(true);
    e.preventDefault();
    setUrl('');
    setFileCheck('')
    setMessage('');
    setUrlData('');
    setPdfData('')
    const formData = new FormData();
    formData.append('input',primaryInput);
    formData.append('user_id',user_id);
    formData.append('database_id', selectedValue)
    axios.post(API.BASE_URL + 'finalprediction/', formData, {
      'Content-Type': 'multipart/form-data',
    },)
    .then(function (response) {
        console.log("Data", response.data);
        setMessage('');
        setText('');
        setText(response.data.Answer);
        setResponseFrom(response.data.AnswerSource)
        setLabel(prevLabels => [...prevLabels, response.data.Label]);
    })
    .catch(function (error) {
        console.log(error)
    })
    .finally(() => setLoading(false))
    }
    else {
      toast.warn("Please select a database")
    }
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
   if(selectedValue != null) {
    setIsSaveVisible(false)
    setLoading(true);
    axios.post(API.BASE_URL + 'SaveData/', {
      Response: selectedQuestions,
      database_id: selectedValue,
    })
    .then(function (response) {
        console.log("Save Data", response.data);
        toast.success('Data Saved Successfully');
        axios.get(API.BASE_URL + 'label/' + user_id + '/')
        .then(function (response) {
            console.log("Questions", response);
            setQuestion(response.data.unique_label);
            setQuestionId(response.data.unique_id);
        })
        .catch(function (error) {
            console.log(error);
        })
    })
    .catch(function (error) {
        console.log(error)
        toast.error('Error Saving Data')
    })
    .finally(() => setLoading(false))
   }
   else {
    toast.warn("Please select a database")
   }
  }

  console.log("Message", message);
  console.log("selectedQuestions", selectedQuestions);
  console.log("pdfData", pdfData);
  console.log("isSaveVisible", isSaveVisible)
  
  
  return (
      <Container className='d-flex flex-column justify-content-between' style={{height: '95vh', minHeight: '95%'}}>
       {loading && <div className='d-flex loader-container flex-column'><div className='loader'><span></span></div> <p className='text-white'>Processing...</p></div>}
       <div className={message?.length > 0 || urlData?.length > 0 || newText?.length > 0 ? "questions-main" : "questions-main scroll"}>
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
          newText && newText?.length > 0 && pdfData.length == 0 ? (
            <div className="questions">
              {(responseFrom == 'This Response is Coming From Chatgpt 1' || responseFrom == 'This Response is Coming From Chatgpt 2') && (
                <input type="checkbox" onChange={(event) => handleCheckboxChange(event, primaryInput, newText, label[0])} />
              )}
              
              <div className="question-text d-flex flex-column">
              <h6 style={{color: '#dfdfdf'}}><strong style={{fontStyle: 'italic',}}>{responseFrom}</strong></h6>
                <label htmlFor="">Q. {primaryInput}</label>
                <p className='my-1'>Ans. {newText}</p>
                
              </div>
            </div>
          )
          :
            pdfData && pdfData?.length > 0 ? (
              pdfData?.map((data, i) => {
                return(
                  <div className="questions">
                    <div className="question-text d-flex flex-column">
                      <label htmlFor="">Q. {data.Question.question}</label>
                      <p htmlFor="">Ans. {data.Answer.answer}</p>
                    </div>
                  </div>
                )
              })
            ) :
            pdfData && pdfData?.message ? (
              <div className="questions no-data">
                    <div className="question-text d-flex flex-column">
                      <label htmlFor="">{pdfData.message}</label>
                    </div>
                  </div>
            ) :
            (
            <div className='empty'>
              <h1>Frontend Classification</h1>
              <p>Enter your Question</p>
            </div>
          )
        }
      </div>
        {
          (message && message.length > 0 || newText && newText.length > 0 && pdfData.length === 0) && (responseFrom === 'This Response is Coming From Chatgpt 1' || responseFrom === 'This Response is Coming From Chatgpt 2') && (
            <div className="save-content">
              <button className='save mb-3' onClick={(e) => handleDataSave(e)}>Save Data</button>
            </div>
          )
        }
        
        <div className="search-bar input-container w-100 position-relative">
          <input type="text" placeholder='AI writing assistant' value={primaryInput} onChange={(e) => {setPrimaryInput(e.target.value)}} onKeyDown={handleKeyPress} />
          <button type='button' className='button button-fill' onClick={(e) => getContent(e)}>
            <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 mr-1" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
          </button>
          <span className='mt-3 d-flex justify-content-center text-center' style={{fontSize: 12, color: '#6c6c72 '}}>© 2023 Chatbot, All rights reserved</span>
        </div>
       
      </Container>
  );
};

export default RichTextEditor;
