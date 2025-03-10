import React, { ReactNode } from 'react'

export default function layout({children}:{children:ReactNode}) {
  return (
    <div className='py-20 3xl:px-20'>{children}</div>
  )
}
