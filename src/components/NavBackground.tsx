"use client"
import {  useScroll,motion, useTransform } from 'framer-motion'
import React from 'react'

export default function NavBackground() {
    const {scrollYProgress}=useScroll()

    const value=useTransform(scrollYProgress,[0,0.05],[0,1])

  return (
    <motion.div style={{opacity:value }} className="absolute inset-0 bg-linear-to-b from-background from-50% via-80% via-background/80 to-background/0 w-screen left-1/2 -translate-x-1/2 -z-10"/>
)
}
