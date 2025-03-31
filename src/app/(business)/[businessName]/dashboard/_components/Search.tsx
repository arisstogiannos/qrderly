"use client"
import { Input } from '@/components/ui/input'
import { useFiltersContext } from '@/context/FiltersProvider'
import React from 'react'

export default function Search() {
    const {searchQuery,setSearchQuery} = useFiltersContext()
  return (
    <Input value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)} placeholder='Search'/>
  )
}
