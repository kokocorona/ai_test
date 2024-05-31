import React,{useContext} from 'react'
import { AppContext } from '../context/Context'

export default function CounterChild() {
  const {setCounter} = useContext(AppContext)

  return (
    <div>
      <button onClick={() => {
        setCounter(counter => counter+1)
      }}>Add 1</button>
    </div>
  )
}
