import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import OAuth from '../components/OAuth';

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if(data.success == false){
        setLoading(false);
        setError(data.message);
        return;
      }
      setLoading(false)
      navigate('/signin');
    }catch(err){
      setLoading(false);
      setError(err.message);
    }
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>

      <form className='flex flex-col gap-4 '>
        <input
          type='text' 
          placeholder='Username' 
          id='username' 
          className='border p-3 rounded-lg' 
          onChange={handleChange}
        />
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
        >{loading ? 'Loading...' : 'Sign Up'}</button>

        <OAuth/>

        <div className='flex gap-2'>
          <p>Have an account?</p>
          <Link to={'/signin'}>
            <span className='text-blue-500'>Sign In</span>
          </Link>
        </div>
        {error && <p className='text-red-500'>{error}</p>}
      </form>
    </div>
  )
}
