import React from 'react'

const LoadingPage = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-dark-background z-50">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-dark-primary"></div>
  </div>
  )
}

export default LoadingPage