import React from 'react'
import ShopForm from '../components/ShopForm'
import ShopList from '../components/ShopList'

export default function ShopPage() {
  return (
    <div className='container'>
      <ShopForm />
      <ShopList />
    </div>
  )
}
