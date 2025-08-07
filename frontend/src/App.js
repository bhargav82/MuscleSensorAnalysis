import { useState } from 'react';
import Chart from './Chart';
import Table from './Table';


function App()
{
  // Global Variables
  const [data, setData] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [AIResponse, setAIResponse] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [ageInput, setAgeInput] = useState("");
  const [muscleInput, setMuscleInput] = useState("");

  // Calls backend, gets routed to start recording values
  const startRecording = async() => 
  {
    try
    {
      const response = await fetch('http://localhost:3001/start', {method: 'POST'});
      console.log(response.status);
      setIsRecording(true);
    }
    catch (err)
    {
      console.log(err);
    }
    
    
    
  };

  // Calls backend, gets routed to retrieve response (emgData list), updates data variable
  const stopRecording = async() =>
  {
    try
    {
      const recordingResponse = await fetch('http://localhost:3001/stop', {method: 'POST'});
      const json = await recordingResponse.json();
      setData(json);
      setIsRecording(false);
    }
    catch (err)
    {
      console.log(err);
    }

  };


  const callGemini = async() =>
  {
    try
    {
      const geminiResponse = await fetch('http://localhost:3001/callGemini', 
        { 
          method: 'POST', 
          headers: {'Content-Type' : 'application/json'
          },
          body: JSON.stringify({name: nameInput, age: ageInput, muscle: muscleInput})
          
        }
      );
      const text = await geminiResponse.text();
      setAIResponse(text);
    }
    catch (err)
    {
      console.log(err);
    }
  };

  
  // Functions to enter User Info
  const enterNameInput = (event) =>
  {
    setNameInput(event.target.value);
  };

  const enterAgeInput = (event) =>
  {
    setAgeInput(event.target.value);
  };

  const enterMuscleInput = (event) =>
  {
    setMuscleInput(event.target.value);
  };




  // Dynamic Table and Chart
  return (
    <div style = {{padding: '20px'}}>
      <h1> Muscle Sensor Information </h1>

      <button onClick = {startRecording} disabled = {isRecording}>  Start Recording! </button>
      <button onClick = {stopRecording} disabled = {!isRecording}> Stop Recording! </button>

      {data.length > 0 ? (
        <>
        <div style = {{display: 'flex', gap: '50px', alignItems: 'flex-start'}}>
          <div style = {{flex: 1}}> 
            <Chart data = {data}/>
          </div>
        
          <div style = {{flex : 1}}> 
            <Table data = {data}/>
          </div>
         </div>
        </>
      ) : <h2> No Data Available. </h2>}

      <button onClick = {callGemini} disabled = {!data.length && !nameInput.length && !ageInput.length && !muscleInput.length}> 
        AI Overview </button>

      <p> {AIResponse} </p>
  
    
      <div>
        <input 
          type="text"
          placeholder="Enter name"
          value={nameInput}
          onChange={enterNameInput}
          />
        <br />
        <input 
          type="number"
          placeholder="Enter age"
          value={ageInput}
          onChange={enterAgeInput}
        />
        <br />
        <input 
          type="text"
          placeholder="Enter muscle group"
          value={muscleInput}
          onChange={enterMuscleInput} 
        />
      </div>
      
    </div>
  );
}



export default App;
