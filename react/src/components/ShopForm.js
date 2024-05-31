import React, { useState, useContext } from 'react'
import { AppContext } from '../context/Context'

export default function ShopForm() {
  const [nameVal,setNameVal] = useState()
  const [amountVal,setAmountVal] = useState(1)

  const {addProduct, resetAllProducts} = useContext(AppContext);

  const onSub = (e) => {
    e.preventDefault();
    const newItem = {
      name: nameVal,
      amount:amountVal,
      id:Date.now()
    }
    console.log(newItem);
    addProduct(newItem);
  }

  return (
    <div className='col-md-6 py-4'>
      <h2>Shop list form</h2>
      <form onSubmit={onSub}>
        <label>Name:</label>
        <input onChange={(e) => setNameVal(e.currentTarget.value)} type="search" className='form-control' />
        <label>Amount:</label>
        <input onChange={(e) => setAmountVal(e.currentTarget.value)} value={amountVal} type="number" className='form-control' />
        <button className='btn btn-success mt-4'>Add product</button>
        {/* type="button" - דואג שהכפתור לא יהיה קשור
         לשיגור הטופס למרות שהוא בתוכו */}
        <button onClick={() => {
          if(window.confirm("Delete all?")){
            resetAllProducts();
          }
        }} type="button" className='btn btn-danger mt-4 ms-2'>Reset all</button>
      </form>
    </div>
  )
}
