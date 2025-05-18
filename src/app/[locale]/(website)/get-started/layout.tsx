import React, { type ReactNode } from 'react'

export default function layout({children}:{children:ReactNode}) {
  return (
    <div className='py-20 pt-10 3xl:px-20'>{children}</div>
  )
}
