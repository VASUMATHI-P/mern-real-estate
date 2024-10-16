import React, { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from 'react-icons/fa';
import Contact from '../components/Contact';



export default function Listing() {
  SwiperCore.use([Navigation]);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  const params = useParams();
  const {currentUser} = useSelector((state) => state.user)
  useEffect(() => {
    const fetchListing = async () => {
      setLoading(true);
      setError(false);
      try {
        const res = await fetch(`/api/listing/get/${params.listingId}`, {
          method: 'GET',
        })
        const data = await res.json();
        if(data.success === false){
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
      } catch(err){
        setError(true);
        setLoading(false);
      }
    }
    fetchListing();
  }, [params.listingId])
  return (
    <main>
      {loading && <p className='text-center text-2xl'>Loading...</p>}
      {error && (
        <p className='text-center my-7 text-2xl'>Something went wrong!</p>
      )}
      {listing && !loading && !error && (
        <div className='p-3'>
          <Swiper navigation>
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className='h-[400px]'
                  style= {{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: 'cover',
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className='fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer'>
            <FaShare
              className='text-slate-500'
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
          </div>

          {copied && (
            <p className='fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2'>
              Link copied!
            </p>
          )}

          <div className='flex flex-col max-w-4xl mx-auto mt-7 gap-4'>
            <p className='font-semibold text-2xl'>
              {listing.name} - ${' '}
              {listing.offer ?
                 listing.discountPrice :
                 listing.regularPrice
              }
              {listing.type === 'rent' ? ' / month' : ''}
            </p>
            <p className='flex items-center  gap-2 text-slate-600  text-sm mt-2'>
              <FaMapMarkerAlt className='text-green-700' />
              {listing.address}
            </p>
            <div className='flex gap-4'>
              <p className=' border bg-red-900 w-full p-1 max-w-[200px] text-white rounded-md text-center'>
                {listing.type === 'rent' ? 'For Rent' : 'For Rent'}
              </p>
              {listing.offer && <p className=' border bg-green-900 w-full p-1 max-w-[200px] text-white rounded-md text-center'>
                ${+listing.regularPrice - +listing.discountPrice} discount
              </p>
              }
            </div>
            <p className='text-slate-700'>
              <span className='font-semibold text-black'>Description -</span>
              {' '} {listing.description}
            </p>
            <ul className='flex gap-6 text-sm'>
              <li className='flex items-center gap-1 font-semibold text-green-900'>
                <FaBed className='text-lg'/>
                {listing.bedrooms} {listing.bedrooms > 1 ? 'Beds' : 'Bed'}
              </li>
              <li className='flex items-center gap-1 font-semibold text-green-900'>
                <FaBath className='text-lg'/>
                {listing.bathrooms} {listing.bathrooms > 1 ? 'Baths' : 'Bath'}
              </li>
              <li className='flex items-center gap-1 font-semibold text-green-900'>
                <FaParking className='text-lg'/>
                {listing.parking ? 'Parking' : 'No Parking'}
              </li>
              <li className='flex items-center gap-1 font-semibold text-green-900'>
                <FaChair className='text-lg'/>
                {listing.furnished ? 'Furnished' : 'Not furnished'}
              </li>
            </ul>
            {listing && listing.userRef !== currentUser._id && !contact &&
              <button 
                onClick={() => setContact(true)}
                className='uppercase bg-slate-700 text-white p-3 w-full text-center rounded-md'
              >Contact Landlord</button>
            }
            {contact && 
              <Contact listing={listing}/>
            }
            
          </div>
        </div>
      )}
    </main>

  )
}
