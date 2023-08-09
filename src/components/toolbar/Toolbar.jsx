import React, {useState, useContext, useEffect} from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.bubble.css';
import { Container } from 'react-bootstrap';
import UserContext from '../context/UserContext';
import axios from 'axios';
import { API } from '../../config/Api';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';

const RichTextEditor = () => {
  const {singleLabelId, selectedValue, setUrlData, urlData, text, setQuestion, message, setMessage, setFileCheck, primaryInput, setPrimaryInput, setText, label, setLabel, responseFrom, setResponseFrom,newText, setNewText,setPdfData, pdfData, setUrl, setQuestionId, predictionQues, setPredictionQues, selectedQuestions, setSelectedQuestions} = useContext(UserContext)
  

  const [loading, setLoading] = useState(false);
  const [isContentVisible, setContentVisible] = useState(false);
  const [isSaveVisible, setIsSaveVisible] = useState(false);
  const [labelDataId, setLabelDataId] = useState(null);
  const [getLabel, setGetLabel] = useState('')
  const checkAdmin = localStorage.getItem("Check_is_admin");
  
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
      setNewText('')
      setResponseFrom('')
      setSelectedQuestions([]);
      const formData = new FormData();
      if(checkAdmin == 'true') {
        formData.append('input',primaryInput);
        formData.append('user_id',user_id);
        formData.append('database_id', selectedValue)
        axios.post(API.BASE_URL + 'finalprediction/', formData, {
          'Content-Type': 'multipart/form-data',
        })
        .then(function (response) {
            console.log("Dataaaaa", response.data);
            setMessage('');
            setText('');
            setResponseFrom('')
            setPrimaryInput('')
            axios.post(API.BASE_URL + 'label/', {
              database_id: selectedValue
          })
          .then(function (response) {
              console.log("Questions", response);
              setQuestion(response.data.data);
          })
          .catch(function (error) {
              console.log(error);
          })
            setText(response.data.Answer);
            setResponseFrom(response.data.AnswerSource)
            setPredictionQues(response.data.Question)
            setGetLabel(response.data.Label)
            console.log("response.data.AnswerSource", response.data.Question)
            setLabel(prevLabels => [...prevLabels, response.data.Label]);
        })
        .catch(function (error) {
            console.log(error)
        })

        .finally(() => setLoading(false))
      }
      else {
        formData.append('user_input',primaryInput);
        formData.append('user_id',user_id);
        axios.post(API.BASE_URL + 'userprediction/', formData, {
          'Content-Type': 'multipart/form-data',
        })
        .then(function (response) {
            console.log("Dataaaaa", response.data);
            setMessage('');
            setText('');
            setResponseFrom('')
            setPrimaryInput('')
            axios.post(API.BASE_URL + 'label/', {
              database_id: selectedValue
          })
          .then(function (response) {
              console.log("Questions", response);
              setQuestion(response.data.data);
          })
          .catch(function (error) {
              console.log(error);
          })
            setText(response.data.Answer);
            setResponseFrom(response.data.AnswerSource)
            setPredictionQues(response.data.Question)
            setGetLabel(response.data.Label)
            console.log("response.data.AnswerSource", response.data.Question)
            setLabel(prevLabels => [...prevLabels, response.data.Label]);
        })
        .catch(function (error) {
            console.log(error)
        })
        .finally(() => setLoading(false))
        }

    }
    else {
      toast.warn("Please select a database", { autoClose: 1000 })
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
        toast.success('Data Saved Successfully', { autoClose: 1000 });
        axios.post(API.BASE_URL + 'label/', {
          database_id: selectedValue
      })
        .then(function (response) {
            console.log("Questions", response);
            setQuestion(response.data.data);
        })
        .catch(function (error) {
            console.log(error);
        })
    })
    .catch(function (error) {
        console.log(error)
        toast.error('Error Saving Data', { autoClose: 1000 })
    })
    .finally(() => setLoading(false))
   }
   else {
    toast.warn("Please select a database", { autoClose: 1000 })
   }
  }

  const handleShowPopup = (e, id) => {
    e.preventDefault()
    console.log("Label Data ID" ,id)
    setLabelDataId(id)
    setContentVisible(true)
  }

  const handleClosePopup = () => {
    setContentVisible(false);
  };

  const handleDelete = () => {
    console.log("Label Data ID" ,labelDataId)
    setContentVisible(false)
    setLoading(true)
    axios.post(API.BASE_URL + 'deletequestion/', {
      question_id: labelDataId,
      database_id: selectedValue,
    },)
    .then(function (response) {
        console.log("Data", response.data);
        toast.success("Data Deleted", { autoClose: 1000 });
        axios.post(API.BASE_URL + 'ShowData/', {
          id: singleLabelId,
          database_id: selectedValue
      })
      .then(function (response) {
          setPrimaryInput('');
          setResponseFrom('');
          setNewText('')
          setMessage('')
          console.log("PDF response Data", response.data);
          setPdfData(response.data)
      })
      .catch(function (error) {
          console.log(error)
      })
    })
    .catch(function (error) {
        console.log(error)
    })
    .finally(() => setLoading(false))
  }

  console.log("URLDATA", urlData);
  console.log("RES", responseFrom)
  console.log("responseFrom", `This Response is Coming From Chatgpt ${selectedValue}`);
  console.log("pdfData", pdfData);
  console.log("message", message)
  console.log("URLDATA", urlData)
  console.log("NewText", newText)
  console.log("predictionQues", predictionQues)
  console.log("selectedQuestions",selectedQuestions)
  
  
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
                const question = ques?.Question;
                const answer = ques?.Answer;
                const label = ques?.Label;
              return(
                <div className="questions" key={i}>
                  <input type="checkbox" onChange={(event) => handleCheckboxChange(event, question, answer, label)} />
                  <div className="question-text">
                    <label htmlFor="">Q. {question}</label>
                    <p className='my-1'>Ans. {answer}</p>
                    <p><strong className='text-white'>Label.</strong> {ques.Label}</p>
                  </div>
                </div>
              )
            })
          )
          :
          newText && newText?.length > 0 && pdfData.length == 0 ? (
            <div className="questions">
              {(responseFrom == 'This Response is Coming From Chatgpt 1' || responseFrom == 'This Response is Coming From Chatgpt 2') && (
                <input type="checkbox" onChange={(event) => handleCheckboxChange(event, predictionQues, newText, getLabel )} />
              )}
              
              <div className="question-text d-flex flex-column">
                <h6 style={{color: '#dfdfdf'}}><strong style={{fontStyle: 'italic',}}>{responseFrom}</strong></h6>
                <label htmlFor="">Q. {predictionQues}</label>
                <p className='my-1'>Ans. {newText}</p>
              </div>
            </div>
          )
          :
            pdfData && pdfData?.length > 0 ? (
              pdfData?.map((data, i) => {
                return(
                  <>
                  <div className="questions">
                    <div className="question-text d-flex flex-column">
                      <label htmlFor="">Q. {data.Question}</label>
                      <p htmlFor="">Ans. {data.Answer}</p>
                      <button className='mt-2' onClick={(e) => handleShowPopup(e, data.id)}>Delete</button>
                    </div>
                  </div>
                  {
                    isContentVisible && (
                      <div className="popup">
                        <div className="popup-content">
                            <h2>Delete Data</h2>
                            <p>Deleting will remove the selected question and answer from database</p>
                            <div className="buttons">
                                <button className="btn" onClick={() => {handleDelete()}}>Delete</button>
                                <button className="btn" onClick={(e) => handleClosePopup(e)}>Cancel</button>
                            </div>
                            <button className="close" onClick={(e) => handleClosePopup(e)}>
                                <FontAwesomeIcon
                                icon={faClose}
                                style={{ color: '#000', width: '25px', height: '25px' }}
                                />
                            </button>
                        </div>
                    </div>
                    )
                  }
                  </>
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
          (urlData && urlData.length > 0 || message && message.length > 0 || responseFrom == `This Response is Coming From Chatgpt ${selectedValue}` ? (
            <div className="save-content">
              <button className='save mb-3' onClick={(e) => handleDataSave(e)}>Save Data</button>
            </div>
          )
          :
          "")
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
