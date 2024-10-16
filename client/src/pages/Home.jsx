import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import { useEffect, useState } from 'react';
import ListingCard from '../components/ListingCard';

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  SwiperCore.use([Navigation]);
  console.log(saleListings);
  

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch(`/api/listing/get?offer=true&limit=4`);
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch(err){
        console.log(err);
      }
    }

    const fetchRentListings = async () => {
      try {
        const res = await fetch(`/api/listing/get?type=rent&limit=4`);
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch(err){
        console.log(err);
      }
    }

    const fetchSaleListings = async () => {
      try {
        const res = await fetch(`/api/listing/get?type=sale&limit=4`);
        const data = await res.json();
        setSaleListings(data);
      } catch(err){
        console.log(err);
      }
    }
    fetchOfferListings();
  }, []);
  return (
    <div>
      <div className='flex flex-col p-28 px-3 max-w-6xl mx-auto gap-6'>
        <p 
          className='font-bold text-3xl sm:text-6xl text-slate-700'
        >Find your next
        <span className='text-gray-500 ml-3'>
          perfect</span>
        <br/>
        place with ease
        </p>
        <p className='text-gray-400 text-xs sm:text-sm'>Surya Estate will help you find your home fast, easy and comfortable. <br/>
        Our expert support are always available.</p>

        <Link to={`/search`} className='text-blue-800 text-xs sm:text-sm hover:underline font-bold'>
        Let's Start now...
        </Link>
      </div>
      <div>
        <Swiper navigation>
          {offerListings && offerListings.length > 0 && 
          offerListings.map((listing) => (
            <SwiperSlide key={listing._id}>
              <div
                style={{
                    background: `url(${listing.imageUrls[0]}) center no-repeat`,
                    backgroundSize: 'cover',
                  }}
                className='h-[500px]'
              ></div>
            </SwiperSlide>
          ))
          }
        </Swiper>
      </div>
      <div className='max-w-6xl mx-auto flex flex-col my-10 p-3 gap-8'>
        {offerListings && offerListings.length > 0 && 
          <div>
            <div className='my-3'>
              <h2 className='font-semibold text-slate-700 text-2xl'>Recent Offers</h2>
              <Link 
                to={`/search?offer=true`}
                className='text-blue-800 hover:underline text-sm'
              >
                Show more offers
              </Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {offerListings.map((listing) => (
                <ListingCard listing={listing} key={listing._id}/>
              ))}
            </div>
          </div>
        }

        {rentListings && rentListings.length > 0 && 
          <div>
            <div className='my-3'>
              <h2 className='font-semibold text-slate-700 text-2xl'>Recent places for rent</h2>
              <Link 
                to={`/search?type=rent`}
                className='text-blue-800 hover:underline text-sm'
              >
                Show more places for rent
              </Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {rentListings.map((listing) => (
                <ListingCard listing={listing} key={listing._id}/>
              ))}
            </div>
          </div>
        }

        {saleListings && saleListings.length > 0 && 
          <div>
            <div className='my-3'>
              <h2 className='font-semibold text-slate-700 text-2xl'>Recent places for sale</h2>
              <Link 
                to={`/search?type=sale`}
                className='text-blue-800 hover:underline text-sm'
              >
                Show more places for sale
              </Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {saleListings.map((listing) => (
                <ListingCard listing={listing} key={listing._id}/>
              ))}
            </div>
          </div>
        }
      </div>
    </div>
  )
}
