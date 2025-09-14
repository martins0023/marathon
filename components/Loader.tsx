import React from 'react'

export const Loader = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-slate-900"></div>
      <p className="mt-4 text-slate-700 text-sm font-medium">{message}</p>
    </div>
  )
}