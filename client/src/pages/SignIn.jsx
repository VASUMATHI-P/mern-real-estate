import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signInFailure, signInStart, signInSuccess } from '../../redux/user/userSlice.js'
import { useDispatch, useSelector } from 'react-redux';
import OAuth from '../components/OAuth.jsx';

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const {loading, error} = useSelector(state => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(signInStart());
    try {
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if(data.success == false){
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      navigate('/');
    }catch(err){
      dispatch(signInFailure(err.message));
    }
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>

      <form className='flex flex-col gap-4 '>
        <input 
          type='email' 
          placeholder='Email' 
          id='email' 
          className='border p-3 rounded-lg' 
          onChange={handleChange}
        />
        <input 
          type='password' 
          placeholder='Password' 
          id='password' 
          className='border p-3 rounded-lg' 
          onChange={handleChange}
        />

        <button 
          disabled = {loading}
          className='max-w-lg bg-slate-700 p-3 uppercase rounded-lg text-white hover:opacity-90 disabled:opacity-80' 
          onClick={handleSubmit}
        >{loading ? 'Loading...' : 'Sign In'}</button>

        <OAuth/>

        <div className='flex gap-2'>
          <p>Dont have an account?</p>
          <Link to={'/signup'}>
            <span className='text-blue-500'>Sign Up</span>
          </Link>
        </div>
        {error && <p className='text-red-500'>{error}</p>}
      </form>
    </div>
  )
}