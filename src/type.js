import {useState, useEffect, useRef} from 'react';
import "./App.css";
// import Navabar from './Navabar';
import randomWords from 'random-words'
const NUMB_OF_WORDS = 100
// const SECONDS = 60




function Type() {
  const [time, setTime] = useState(60);
  const [words, setWords] = useState([])
  const [countDown, setCountDown] = useState(time)
  const [currInput, setCurrInput] = useState("")
  const [currWordIndex, setCurrWordIndex] = useState(0)
  const [currCharIndex, setCurrCharIndex] = useState(-1)
  const [currChar, setCurrChar] = useState("")
  const [correct, setCorrect] = useState(0)
  const [incorrect, setIncorrect] = useState(0)
  const [status, setStatus] = useState("waiting")
  const textInput = useRef(null)


const on30 = ()=>{
      setTime(30); 
}   
  
const on60 = ()=>{
      setTime(60);
}

const refresh = (e)=>{
  
    window.location.reload(false);
      
  
}

  useEffect(() => {
    setWords(generateWords())
  }, [])

  useEffect(() => {
    if (status === 'started') {
      textInput.current.focus()
    }
  }, [status])

  function generateWords() {
    return new Array(NUMB_OF_WORDS).fill(null).map(() => randomWords())
  }

  function start() {

    if (status === 'finished') {
      setWords(generateWords())
      setCurrWordIndex(0)
      setCorrect(0)
      setIncorrect(0)
      setCurrCharIndex(-1)
      setCurrChar("")
    }

    if (status !== 'started') {
      setStatus('started')
      let interval = setInterval(() => {
        setCountDown((prevCountdown) => {
          if (prevCountdown === 0) {
            clearInterval(interval)
            setStatus('finished')
            setCurrInput("")
            return countDown
          } else {
            return prevCountdown - 1
          }
        }  )
      } ,  1000 )
    }
    
  }

  function handleKeyDown({keyCode, key}) {
    // space bar 
    if (keyCode === 32) {
      checkMatch()
      setCurrInput("")
      setCurrWordIndex(currWordIndex + 1)
      setCurrCharIndex(-1)
    // backspace
    } else if (keyCode === 8) {
      setCurrCharIndex(currCharIndex - 1)
      setCurrChar("")
    } else {
      setCurrCharIndex(currCharIndex + 1)
      setCurrChar(key)
    }
  }

  function checkMatch() {
    const wordToCompare = words[currWordIndex]
    const doesItMatch = wordToCompare === currInput.trim()
    if (doesItMatch) {
      setCorrect(correct + 1)
    } else {
      setIncorrect(incorrect + 1)
    }
  }

  function getCharClass(wordIdx, charIdx, char) {
    if (wordIdx === currWordIndex && charIdx === currCharIndex && currChar && status !== 'finished') {
      if (char === currChar) {
        return 'has-background-success'
      } else {
        return 'has-background-danger'
      }
    } else if (wordIdx === currWordIndex && currCharIndex >= words[currWordIndex].length) {
      return 'has-background-danger'
    } else {
      return ''
    }
  }


  return (
    // [
    <div>
    <nav className = "nav">
            
            <button onClick = {refresh} className = " rbutton">Rabittype</button>
            <ul>
                <h3 className = "time">time</h3>
                <span className = "gap">
                <button onClick = {()=>{
                  if(status!=='started'){
                    on30()
                    setCountDown(time)
                  }
                  
                  
                }}  className = "tbutton">30</button>
                <button onClick={()=>{
                  if(status!=='started'){
                    on60()
                    setCountDown(time)
                  }
                  
                  
                }} className = "tbutton">60</button>
                </span>
                
            </ul>
        </nav>
    <div className="type">
      {/* <Navabar/> */}
      <div className="section">
        <div className="is-size-1 has-text-centered has-text-primary">
          <h2>{countDown}</h2>
        </div>
      </div>
      <div className="control is-expanded section">
        <input ref={textInput} disabled={status !== "started"} type="text" className="input" onKeyDown={handleKeyDown} value={currInput} onChange={(e) => setCurrInput(e.target.value)}  />
      </div>
      <div className="section">
        <button className="button is-info is-fullwidth" onClick={start}>
          Start
        </button>
      </div>
      {status === 'started' && (
        <div className="section" >
          <div className="card">
            <div className="card-content">
              <div className="content">
                {words.map((word, i) => (
                  <span key={i}>
                    <span>
                      {word.split("").map((char, idx) => (
                        <span className={getCharClass(i, idx, char)} key={idx}>{char}</span>
                      )) }
                    </span>
                    <span> </span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      {status === 'finished' && (
        <div className="section">
          <div className="columns">
            <div className="column has-text-centered">
              <p className="is-size-5">Words per minute:</p>
              <p className="has-text-primary is-size-1">
                {correct}
              </p>
            </div>
            <div className="column has-text-centered">
              <p className="is-size-5">Accuracy:</p>
              {correct !== 0 ? (
                <p className="has-text-info is-size-1">
                  {Math.round((correct / (correct + incorrect)) * 100)}%
                </p>
              ) : (
                <p className="has-text-info is-size-1">0%</p>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
    </div>
    // ,on30,on60]
    
  );
}

export default Type;

