import React, { useContext } from 'react'
import { AppContext } from '../context/Context'

export default function ShopList() {
  const { shop_ar, deleteProduct } = useContext(AppContext)

  return (
    <div>
      <h2>List of added product:</h2>
      <div className='row'>
        {shop_ar.map(item => {
          return (
            <div key={item.id} className='col-md-8 border my-1 py-2 shadow-sm'>
              <button className='float-end bg-danger' onClick={() => {
                deleteProduct(item.id)
              }}>X</button>
              <h5>{item.name} - {item.amount}</h5>
            </div>
          )
        })}
        {/* <div className='col-md-8 border my-3 py-2'>
          <button className='float-end bg-danger'>X</button>
          <h5>Bamba - 5</h5>
        </div> */}
      </div>
    </div>
  )
}
