import React, {useState, useContext, useEffect} from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.bubble.css';
import { Container } from 'react-bootstrap';
import UserContext from '../context/UserContext';

const RichTextEditor = () => {
  const [comments, setComments] = useState('');
  const {text} = useContext(UserContext)
  const [newText, setNewText] = useState('');

  const modules = {
    toolbar: [
      [{ 'font': [] }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'align': [] }],
      [{ 'color': [] }, { 'background': [] }],
      ['clean']
    ]
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

  const rteChange = (content, delta, source, editor) => {
    console.log(editor.getHTML()); 
    console.log(editor.getText());
    console.log(editor.getLength());
  };

  // console.log("text:", text);
  // console.log("defaultValue:", text != null && text.length > 0 ? text.join("\n \n \n") : comments);
  useEffect(() => {
    setNewText(text != null && text.length > 0 ? text.join("<br/><br/>") : comments)
    console.log("New Text", newText)

  })
  return (
      <Container>
        <ReactQuill
            theme="snow"
            modules={modules}
            formats={formats}
            onChange={(content, delta, source, editor) => {
            setComments(text !=null || "" ? text : editor.getHTML());
            rteChange(content, delta, source, editor);
            }}
            defaultValue={text != null && text.length > 0 ? text.join("\n \n \n") : comments}
            value={newText}
        />
      </Container>
  );
};

export default RichTextEditor;
