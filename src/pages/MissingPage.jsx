import React from 'react'
import { useNavigate } from 'react-router-dom'

const MissingPage = () => {
  const navigate = useNavigate();
  return (
    <div>
      <p>This page isn't available</p>
      <button onClick={() => navigate('/')}>
        Go Back to home page
      </button>
    </div>
  )
}

export default MissingPage
