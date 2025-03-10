import React from 'react'

export default function Background() {
    return (
      <div className="fixed top-0 left-0 w-screen h-screen overflow-hidden -z-10">
        <div className="bg-radial from-primary/50 animate-pulse-slow to-background/0  size-[500px] fixed rounded-full blur-3xl" />
        <div className="bg-radial from-primary/60 to-background/0 size-[500px] fixed rounded-full blur-3xl top-1/2 right-0 animate-pulse-slow  delay-500" />
        <div className="bg-radial from-primary/40 to-background/0 size-[600px] fixed rounded-full blur-3xl bottom-0 translate-y-1/2 left-1/3 animate-pulse-slow delay-1000" />
      </div>
    );
  }