import Image from 'next/image'
import React from 'react'

export default function Images({detailImage}: {detailImage: string}) {
  return (
    <div>
      <Image height={1000} width={1000} className='h-auto w-auto' src={detailImage} alt="detail Image" />
    </div>
  )
}
