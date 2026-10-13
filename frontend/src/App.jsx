import { useState,useEffect } from 'react'
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

function App() {
   const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchAllNotes(){
      setLoading(true);
      try{
        const response = await axios.get(`${API_URL}/notes`);
        // const result = await response.json();
        if(response.status != 200){
          setError(result.message||"something is error");
        }
        // console.log(result.data)
        setNotes(response.data.data)
      }catch(error){
        setError(error.message||"something is error");
      }finally{
        setLoading(false);
      }
    }
  
    fetchAllNotes();
  }, [])
  

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
   <div>
    <h1>Notes</h1>
    {notes.length === 0 ? (
      <p>No notes found.</p>
    ):(
      notes.map((note)=>(
        <div key={note._id} className="mb-4 rounded border p-4">
            <h2 className="font-bold">{note.title}</h2>
            <p>{note.content}</p>
          </div>
      ))
    )}
   </div>
  )
}

export default App
