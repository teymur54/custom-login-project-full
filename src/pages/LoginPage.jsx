import { useState, useRef } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { signIn } from '../api/axios';
import toast from 'react-hot-toast';
import '../styles/Loginpage.css';
import { useMutation } from '@tanstack/react-query';
import eyeIcon from '../assets/pictures/eye-icon.svg'
import eyeOff from '../assets/pictures/eye-off.svg'

const LoginPage = () => {
  const { auth, login, isVerifying } = useAuth();
  const loginRef = useRef(null);
  const passwordRef = useRef(null);
  const [showPassword, setShowPassword] = useState(null);
  const [toastShown, setToastShown] = useState(false); // Track if toast is shown

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const signInMutation = useMutation({
    mutationFn: ({ username, password }) => signIn({ username, password }),
    onSuccess: (data) => {
      login(data)
      navigate(from, { replace: true })
      toast.success('İstifadəçi daxil oldu',{duration: 1000})
    },
    onError: (error) => {
      if (!toastShown){
        setToastShown(true)
        if (!error?.response) toast.error('Server cavab vermir',{duration:1500})
        else if (error?.response?.status === 400) toast.error('İstifadəçi adı və ya şifrə daxil olunmayıb',{duration:1500})
        else if (error?.response?.status === 401) toast.error('Yalnış istifadəçi adı və ya şifrə',{duration:1500})
        else toast.error('Error, səhifəni yeniləyin',{duration:1500})
        //Delay before allowing next toast
        setTimeout(()=>{setToastShown(false)}, 1600)
      }
    },
  })

  // Form submit handle function
  const handleSubmit = async (e) => {
    e.preventDefault()
    signInMutation.mutate({ username: loginRef.current.value, password: passwordRef.current.value })
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  return (
    <>
      {!isVerifying && auth?.isAuth && <Navigate to="/" />}
      {!isVerifying && !auth?.isAuth && (
        <div className="login-container">
          <form onSubmit={handleSubmit} className="login-form">
            <h2 className="login-title">Sign in</h2>
            <label htmlFor="username" className="login-label">
              Username
            </label>
            <input
              required
              autoComplete="off"
              ref={loginRef}
              id="username"
              type="text"
              placeholder="Enter your username"
              className="login-input"
            />

            <label htmlFor="password" className="login-label">
              Password
            </label>
            <div className='password-input-container'>
              <input
                required
                ref={passwordRef}
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                className="login-input"
              />
              <button type='button' onClick={togglePasswordVisibility} className='toggle-password-button'>
                <img src={showPassword ? eyeOff: eyeIcon}/>
              </button>
            </div>
            <button type="submit" className="login-btn">
              Submit
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default LoginPage;