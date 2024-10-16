import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {Link} from 'react-router-dom'
import {getStorage, ref, uploadBytesResumable, getDownloadURL} from 'firebase/storage';
import { app } from '../firebase.js';
import { updateUserStart, updateUserSuccess, updateUserFailure, signInFailure, deleteUserStart, deleteUserFailure, deleteUserSuccess, signoutFailure, signoutStart, signoutSuccess } from '../../redux/user/userSlice.js';


export default function Profile() {
  const {currentUser, loading, error} = useSelector((state) => state.user)
  const fileRef = useRef(null);
  const [file, setFile] = useState(null);
  const [fileProgress, setFileProgress] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const [showListingsError, setShowListingsError] = useState(false);
  const dispatch = useDispatch();
  
  const handleChange = (e) => {
    setFormData({...formData, [e.target.id] : e.target.value})
  }

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setFileProgress(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({...formData, avatar: downloadURL})
        );
      }
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(updateUserStart());
    setUpdateSuccess(false);
    
    const id = currentUser._id;
    try {
      const res = await fetch(`/api/user/update/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      const data = await res.json();
      if(data.success === false){
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch(err) {
      dispatch(signInFailure(err.message));
    }
  }

  const handleUserDelete = async () => {
    const id = currentUser._id;
    dispatch(deleteUserStart());
    try {
      const res = await fetch(`/api/user/delete/${id}`, {
        method: 'DELETE'
      })
      const data = await res.json();
      if(data.success === false){
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    }catch(err){
      dispatch(deleteUserFailure(err.message));
    }
  }

  const handleUserSignout = async () => {
    try{
      dispatch(signoutStart());
      const res = await fetch(`/api/auth/signout`, {
        method: 'GET'
      })
      const data = await res.json();
      if(data.success === false){
        dispatch(signoutFailure(data.message));
        return;
      }
      dispatch(signoutSuccess());
    } catch(err){
      dispatch(signoutFailure(err.message));
    }
  }

  const handleShowListings = async () => {
    setShowListingsError(false);
    const res = await fetch(`/api/user/listings/${currentUser._id}`, {
      method : 'GET'
    })
    const data = await res.json();
    if(data.success === false){
      setShowListingsError(true);
      return;
    }
    setUserListings(data);
  }

  const handleDeleteListing = async (listingId) => {
    const confirmed = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");

    if (!confirmed) {
      return;
    }
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: 'DELETE'
      })
      const data = res.json();
      if(data.success === false){
        console.log(data.message);
        return;
      }
      setUserListings((prev) => prev.filter((listing) => listing._id !== listingId));
    } catch(err){
      console.log(err.message);
    }
    
  }

  useEffect(() => {
    if(file){
      handleFileUpload(file);
    }
  }, [file])

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold my-7 text-center' >Profile</h1>

      <form className='flex flex-col gap-4'>
        <input 
          onChange={(e) => setFile(e.target.files[0])}
          type='file' 
          ref={fileRef} 
          hidden 
          accept='image/*'
        />
        <img 
          onClick={() => fileRef.current.click()} 
          src={formData.avatar || currentUser.avatar} 
          alt='Profile' 
          className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2 '
        />
        <p className='text-sm self-center'>
          {fileUploadError ? (
            <span className='text-red-700'>
              Error Image upload (image must be less than 2 mb)
            </span>
          ) : fileProgress > 0 && fileProgress < 100 ? (
            <span className='text-slate-700'>{`Uploading ${fileProgress}%`}</span>
          ) : fileProgress === 100 ? (
            <span className='text-green-700'>Image successfully uploaded!</span>
          ) : (
            ''
          )}
        </p>
        <input
          onChange={handleChange}
          type='text' 
          name='username' 
          id='username' 
          placeholder='Username'
          defaultValue={currentUser.username}
          className='p-3 border rounded-lg'
        />

        <input
          onChange={handleChange}
          type='text' 
          name='email' 
          id='email' 
          placeholder='Email'
          defaultValue={currentUser.email}
          className='p-3 border rounded-lg'
        />

        <input
          onChange={handleChange}
          type='password' 
          name='password' 
          id='password' 
          placeholder='Password'
          className='p-3 border rounded-lg'
        />

        <button 
          type='button' 
          onClick={handleSubmit}
          className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
          disabled={loading}
        >
          {loading ? 'LOADING...': 'UPDATE'}
        </button>

        <Link 
          to={'/create-listing'}
          className='bg-green-700 p-3 text-white text-center rounded-lg hover:opacity-90'
        >
          CREATE LISTING
        </Link>

        <p>
          {error ? <span className='text-red-500'>{error}</span> : ''}
        </p>

        <p>
          {updateSuccess ? <span className='text-green-500'>User is updated successfully !</span> : ''}
        </p>
      </form>
      <div className='flex justify-between mt-5'>
        <span 
          onClick={handleUserDelete}
          className='text-red-500 cursor-pointer'
        >
          Delete Account
        </span>
        <span 
          onClick={handleUserSignout}
          className='text-red-500 cursor-pointer'
        >
          Sign out
        </span>
      </div>

      <button type='button' onClick={handleShowListings} className='text-green-600 w-full mt-5'>
        Show Listings
      </button>

      <p className='text-red-700 mt-5'>
        {showListingsError ? 'Error showing listings' : ''}
      </p>


      {userListings && userListings.length > 0 && 
        <div className='flex flex-col gap-4'>
          <h2 className='text-2xl font-semibold text-center mt-7'>Listings</h2>
          {userListings.map((listing) => (
          <div key={listing._id} className='border p-3 flex justify-between items-center gap-4'>
            <Link 
              to={`/listing/${listing._id}`} 
            >
              <img src={listing.imageUrls[0]} alt='listing image' className='h-20 w-20 object-contain'/>
            </Link>
            <Link 
              to={`/listing/${listing._id}`}
              className='flex-1 truncate hover:underline font-semibold'
            >
              <p className='truncate'>{listing.name}</p>
            </Link>
            <div className='flex flex-col'>
              <button 
                onClick={() => handleDeleteListing(listing._id)} 
                className='text-red-700 uppercase'
              >
                Delete
              </button>

              <Link to={`/edit-listing/${listing._id}`} className='text-green-700 uppercase'>
                Edit
              </Link>
            </div>
          </div>
        ))}
        </div>
      }
    </div>
  )
}
