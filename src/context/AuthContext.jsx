import { useState,createContext,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { verifyJwt } from '../api/axios';
import { jwtDecode } from 'jwt-decode';
import { useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth,setAuth] = useState(null);
  const [isVerifying, setIsVerifying] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const verifyLogin = async () => {
      const jwtToken = JSON.parse(localStorage.getItem('token')) || null;
      const name = JSON.parse(localStorage.getItem('name')) || '';
      if(!jwtToken) {
        setAuth(null)
        setIsVerifying(false)
      } else{
        try{
          await verifyJwt(jwtToken)
          const decoded = jwtDecode(jwtToken)
          const roles = decoded?.authorities || []
          setAuth({ jwtToken, roles, isAuth:true, name}) 
        } catch(err) {
          localStorage.removeItem('token')
          localStorage.removeItem('name')
          setAuth(null)
        } finally{
          setIsVerifying(false)
        }
      }
    }
    verifyLogin()
  }, [])

  const login = (data) => {
    const jwtToken = data?.jwt;
    const name = data?.username;
    const decoded = jwtToken ? jwtDecode(jwtToken) : undefined
    const roles = decoded?.authorities || []
    setAuth({ jwtToken,roles,authenticated:true,name})
    localStorage.setItem('token',JSON.stringify(jwtToken))
    localStorage.setItem('name',JSON.stringify(name))
  }

  const logout = () => {
    setAuth({})
    localStorage.removeItem('token')
    localStorage.removeItem('name')
    navigate('/login', { replace: true })
  }

  return (
    <AuthContext.Provider value={{ auth, setAuth, login, logout, isVerifying,  }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if(!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  const {auth} = context;
  const jwtToken = auth? auth.jwtToken : null;

  return { ...context, jwtToken};
}
