"use client"
import { useCurrencyContext } from '@/context/CurrencyProvider'
import {  formatCurrencyFromCents } from '@/lib/formatter'
import React from 'react'

export default function DisplayPrice({price}:{
  price: number}) {
    const {currency} = useCurrencyContext()
  return (
    <>{formatCurrencyFromCents(price,currency)}</>
  )
}
