import React from 'react'
import { useNavigate } from 'react-router-dom'

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <div>
      <p>You can't</p>
      <button onClick={() => navigate('/')}>
        Go back to home page  
      </button>    
    </div>
  )
}

export default UnauthorizedPage
