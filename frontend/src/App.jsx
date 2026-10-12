import { useState,useEffect } from 'react'
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [notes, setNotes] = useState([])
  const [content, setContent] = useState("")
  const [title, setTitle] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchAllNotes(){
      setLoading(true);
      try{
        const response = await axios.get(`${API_URL}/notes`);
      const result = await response.json()
      if(!response.ok){
        setError(result.message||"something is error");
      }
      setNotes(result.data)
      }catch(error){
        setError(error.message||"something is error");
      }finally{
        setLoading(false);
      }
    }
  
    fetchAllNotes();
  }, [])
  

  return (
   <div>
    {
    notes.map((note)=>(
      <div>
            <p>{note.title}</p>
            <p>{note.content}</p>
          </div>
    ))
   }
   </div>
  )
}

export default App
