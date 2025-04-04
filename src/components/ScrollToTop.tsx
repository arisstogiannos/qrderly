"use client"
import React from 'react'
import { Button } from './ui/button'
import { ArrowUp } from 'lucide-react'
import { useMotionValueEvent, useScroll } from 'framer-motion'

export default function ScrollToTop() {
    const {scrollY} = useScroll()
    const [visible, setVisible] = React.useState(false)
    useMotionValueEvent(scrollY, "change", (latest) => {
        if (latest > 200) {
            setVisible(true)
        } else {
            setVisible(false)
        }
    })
  return (
    <Button className='rounded-full bg-foreground text-background fixed bottom-5 transition-all duration-1000 text-xl size-10 lg:size-14' style={{right:visible?20:-100}} onClick={()=>scrollTo({top:0})}><ArrowUp className='size-8'/></Button >
  )
}
