import React from 'react'
import { Link } from 'react-router-dom'
import { MdLocationOn} from 'react-icons/md'

export default function ListingCard({listing}) {
  return (
    <div className='bg-white shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden rounded-lg w-full sm:w-[330px]'>
      <Link to={`/listing/${listing._id}`}>
        <img 
          src={listing.imageUrls[0]} 
          alt ='listing_image'
          className='h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300'
        />
        <div className='flex flex-col gap-2 p-3'>
          <p className='font-semibold text-slate-700 truncate text-lg'>{listing.name}</p>

          <div className='flex w-full items-center gap-1'>
            <MdLocationOn className='h-4 w- 4 text-green-700'/>
            <p className='text-sm text-gray-600 truncate w-full'>{listing.address}</p>
          </div>

          <p className='line-clamp-2'>{listing.description}</p>

          <p className='font-semibold text-slate-500'>
            $
            {listing.offer ? listing.discountPrice.toLocaleString('en-us') : listing.regularPrice.toLocaleString('en-us')}
            
            {listing.type === 'rent' ? ' / month' : ''}
          </p>

          <div className='flex gap-4 text-xs font-bold text-slate-600'>
            <div>
              {listing.bedrooms > 1 ? `${listing.bedrooms} Beds` : `${listing.bedrooms} Beds`}
            </div>
            <div>
              {listing.bathrooms > 1 ? `${listing.bathrooms} Baths` : `${listing.bathrooms} Baths`}
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}
