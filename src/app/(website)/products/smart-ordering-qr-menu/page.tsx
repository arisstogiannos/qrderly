import React from 'react'
import ProductPage from '../_components/ProductPage'
import { productsData } from '@/data'

export default function page() {
  const smMenu = {...productsData[1]}
  smMenu.title = "Smart QR Menu – Seamless & Effortless Ordering"
  return (
    <ProductPage product={smMenu}/>
  )
}
