import React,{useContext} from 'react'
import { AppContext } from '../context/Context'

export default function Home() {
  const {counter} = useContext(AppContext)

  return (
    <div className='container'>
      <h1>Home page</h1>
      <h2>Counter: {counter}</h2>
    </div>
  )
}
