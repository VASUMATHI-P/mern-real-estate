import { useState } from "react"
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import {app} from '../firebase.js'
import {useSelector} from 'react-redux'
import {useNavigate} from 'react-router-dom'

export default function CreateListing() {
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: '',
    description: '',
    address: '',
    type: 'rent',
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  
  const handleUploadImage = () => {
    if(files.length == 0) {
      setImageUploadError('Atleast 1 image should should be chosen');
      return
    }
    if(files.length > 0 && files.length + formData.imageUrls.length < 7){
      setUploading(true);
      setImageUploadError(false)
      let promises = [];
      for(let i=0; i<files.length; i++){
        promises.push(storeImage(files[i]));
      }

      Promise.all(promises).then((url) => {
        setFormData({
          ...formData,
          imageUrls: [...formData.imageUrls, ...url]
        })
        setUploading(false);
      }).catch((err) => {
        setImageUploadError('Image upload failed (2 mb max per image)');
        setUploading(false);
      })
    } else {
      setImageUploadError('You can only upload 6 images per listing');
    }
    
  }

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index)
    });
  };

  const storeImage = (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on('state_changed', 
        (snapshot) => {
          const progress = ((snapshot.bytesTransferred)/(snapshot.totalBytes))*100;
          console.log('Upload is ' + progress + '% done');
        }, (err) => {
          reject(err);
        }, () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
            resolve(downloadUrl);
          })
        }
      )
    })
  }

  const handleChange = (e) => {
    if(e.target.id === 'sale' || e.target.id === 'rent'){
      setFormData({
        ...formData,
        type : e.target.id
      })
    }

    if(e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer'){
      setFormData({
        ...formData,
        [e.target.id] : e.target.checked
      });
    }

    if(e.target.type === 'number' || e.target.type === 'text' || e.target.type === 'textarea'){
      setFormData({
        ...formData,
        [e.target.id]: e.target.value
      });
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(false);
      if(formData.imageUrls.length < 1){
        return setError('You should upload atleast 1 image');
      }
      if(formData.discountPrice > formData.regularPrice){
        return setError('Discount price should be less than the regular price');
      }
      const res = await fetch('/api/listing/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id
        })
      })

      const data = await res.json();
      if(data.success == false){
        setError(data.message);
      }
      setLoading(false);
      navigate(`/listing/${data._id}`)
    } catch(err){
      setError(err.message);
      setLoading(false);
    }
  }
  return (
    <main className="p-3">
      <h1 className="text-3xl font-bold text-center my-7">Create Listing</h1>
      <form className="flex flex-col sm:flex-row max-w-4xl mx-auto gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <input 
            className="p-3 rounded-lg"
            type="text" 
            placeholder="Name" 
            id="name"
            minLength={5}
            maxLength={62}
            required
            onChange={handleChange}
            value={formData.name}
          />
          <textarea 
            className="p-3 rounded-lg"
            type="text" 
            placeholder="Description" 
            id="description"
            required
            onChange={handleChange}
            value={formData.description}
          />
          <input 
            className="p-3 rounded-lg"
            type="text" 
            placeholder="Address" 
            id="address"
            required
            onChange={handleChange}
            value={formData.address}
          />
          <div className="flex gap-6 flex-wrap">
          <div className="flex gap-2">
            <input 
              type="checkbox" 
              id="sale" 
              className="w-5" 
              onChange={handleChange}
              checked={formData.type === 'sale'}
            />
            <span>Sell</span>
          </div>

          <div className="flex gap-2">
            <input 
              type="checkbox" 
              id="rent" 
              className="w-5" 
              onChange={handleChange}
              checked={formData.type === 'rent'}
            />
            <span>Rent</span>
          </div>

          <div className="flex gap-2">
            <input 
              type="checkbox" 
              id="parking" 
              className="w-5"
              onChange={handleChange}
              checked={formData.parking}
            />
            <span>Parking spot</span>
          </div>

          <div className="flex gap-2">
            <input type="checkbox" id="furnished" className="w-5"
              onChange={handleChange}
              checked={formData.furnished}
            />
            <span>Furnished</span>
          </div>

          <div className="flex gap-2">
            <input type="checkbox" id="offer" className="w-5"
              onChange={handleChange}
              checked={formData.offer}
            />
            <span>Offer</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-6">
          <div className='flex items-center gap-2'>
            <input
              type='number'
              id='bedrooms'
              min='1'
              max='10'
              required
              className='p-3 border border-gray-300 rounded-lg'
              onChange={handleChange}
              value={formData.bedrooms}
            />
            <p>Beds</p>
          </div>
          <div className="flex items-center gap-2">
            <input
              type='number'
              id='bathrooms'
              min='1'
              max='10'
              required
              className='p-3 border border-gray-300 rounded-lg'
              onChange={handleChange}
              value={formData.bathrooms}
            />
            <p>Baths</p>
          </div>
          <div className='flex items-center gap-2'>
            <input
              type='number'
              id='regularPrice'
              min='50'
              max='10000000'
              required
              className='p-3 border border-gray-300 rounded-lg'
              onChange={handleChange}
              value={formData.regularPrice}
            />
            <div className='flex flex-col items-center'>
              <p>Regular price</p>
              {formData.type === 'rent' && <span className='text-xs'>($ / month)</span>}
            </div>
          </div>
          {formData.offer &&
            <div className='flex items-center gap-2'>
              <input
                type='number'
                id='discountPrice'
                min='0'
                max='1000000'
                required
                className='p-3 border border-gray-300 rounded-lg'
                onChange={handleChange}
                value={formData.discountPrice}
              />
              <div className='flex flex-col items-center'>
                <p>Discounted price</p>
                {formData.type === 'rent' && <span className='text-xs'>($ / month)</span>}
              </div>
            </div>
          }
          
        </div>
        </div>
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            Images: <span className="font-normal text-slate-700">The first image will be the cover(max 6)</span> 
          </p>

          <div className="flex gap-4">
            <input 
              onChange={(e) => setFiles(e.target.files)}
              className='p-3 border border-gray-300  w-full' 
              type="file" 
              id='images' 
              accept='image/*' 
              multiple 
            />
            <button 
              onClick={handleUploadImage}
              type="button"
              className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'
              disabled={uploading}  
            >
              {uploading ? 'UPLOADING...' : 'UPLOAD'}
            </button>
          </div>

          <p className='text-red-700 text-sm'>
            {imageUploadError && imageUploadError}
          </p>

          {
            formData.imageUrls.length > 0 && formData.imageUrls.map((url, index) => (
              <div key={url} className="flex justify-between p-3 border items-center">
                <img 
                  key={url} 
                  src={url} 
                  alt="listing image" 
                  className="w-20 h-20 object-contain"
                />
                <button 
                  type="button"
                  onClick={() => handleRemoveImage(index)} 
                  className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75'
                >
                  DELETE
                </button>
              </div>
            ))
          }

          <button 
            className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
            onClick={handleSubmit}
            disabled={loading || uploading}
          >Create Listing</button>
          <p className="text-red-700">
          {error && error}
          </p>
        </div>
        
      </form>
    </main>
  )
}
