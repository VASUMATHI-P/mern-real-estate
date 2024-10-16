import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import ListingCard from '../components/ListingCard';

export default function Search() {
  const navigate = useNavigate();
  const [sidebardata, setSidebardata] = useState({
    searchTerm: '',
    type: 'all',
    parking: false,
    furnished: false,
    offer: false,
    sort: 'created_at',
    order: 'desc',
  });

  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMorebutton, setShowMoreButton] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const typeFromUrl = urlParams.get('type');
    const parkingFromUrl = urlParams.get('parking');
    const furnishedFromUrl = urlParams.get('furnished');
    const offerFromUrl = urlParams.get('offer');
    const sortFromUrl = urlParams.get('sort');
    const orderFromUrl = urlParams.get('order');

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebardata({
        searchTerm: searchTermFromUrl || '',
        type: typeFromUrl || 'all',
        parking: parkingFromUrl === 'true' ? true : false,
        furnished: furnishedFromUrl === 'true' ? true : false,
        offer: offerFromUrl === 'true' ? true : false,
        sort: sortFromUrl || 'created_at',
        order: orderFromUrl || 'desc',
      });
    }

    const fetchListings = async () => {
      setLoading(true);
      setShowMoreButton(false)
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/listing/get?${searchQuery}`);
      const data = await res.json();
      setListings(data);
      if(data.length > 8){
        setShowMoreButton(true)
      } else{
        setShowMoreButton(false);
      }
      setLoading(false);
    };

    fetchListings();
  }, [location.search]);
  

  const handleChange = (e) => {
    if (
      e.target.id === 'all' ||
      e.target.id === 'rent' ||
      e.target.id === 'sale'
    ) {
      setSidebardata({ ...sidebardata, type: e.target.id });
    }

    if (e.target.id === 'searchTerm') {
      setSidebardata({ ...sidebardata, searchTerm: e.target.value });
    }

    if (
      e.target.id === 'parking' ||
      e.target.id === 'furnished' ||
      e.target.id === 'offer'
    ) {
      setSidebardata({
        ...sidebardata,
        [e.target.id]:
          e.target.checked || e.target.checked === 'true' ? true : false,
      });
    }

    if (e.target.id === 'sort_order') {
      const sort = e.target.value.split('_')[0] || 'createdAt';

      const order = e.target.value.split('_')[1] || 'desc';

      setSidebardata({ ...sidebardata, sort, order });
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set('searchTerm', sidebardata.searchTerm);
    urlParams.set('type', sidebardata.type);
    urlParams.set('parking', sidebardata.parking);
    urlParams.set('furnished', sidebardata.furnished);
    urlParams.set('offer', sidebardata.offer);
    urlParams.set('sort', sidebardata.sort);
    urlParams.set('order', sidebardata.order);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const onShowMoreClick = async () => {
    const noOfListings = listings.length;
    const startIndex = noOfListings;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/listing/get?${searchQuery}`);
    const data = await res.json();
    setListings([...listings, ...data]);
    if(data.length > 8){
      setShowMoreButton(true);
    } else{
      setShowMoreButton(false);
    }
  }

  return (
    <div className='flex flex-col md:flex-row'>
      <div className='p-7  border-b-2 md:border-r-2 md:min-h-screen'>
        <form className='flex flex-col gap-8' onSubmit={handleSubmit}>
          <div className='flex gap-2 items-center'>
            <label>Search Term: </label>
            <input
              type='text'
              name='searchTerm'
              placeholder='Search...'
              id='searchTerm'
              className='p-3 rounded-lg'
              value={sidebardata.searchTerm}
              onChange={(e) => handleChange(e)}
            />
          </div>
          <div className='flex gap-2'>
            <label>Type: </label>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                name='all'
                id='all'
                className='w-5'
                checked={sidebardata.type === 'all'}
                onChange={(e) => handleChange(e)}
              />
              <span>Rent & Sale</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                name='rent'
                id='rent'
                className='w-5'
                checked={sidebardata.type === 'rent'}
                onChange={(e) => handleChange(e)}
              />
              <span>Rent</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                name='sale'
                id='sale'
                className='w-5'
                checked={sidebardata.type === 'sale'}
                onChange={(e) => handleChange(e)}
              />
              <span>Sale</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                name='offer'
                id='offer'
                className='w-5'
                checked={sidebardata.offer}
                onChange={(e) => handleChange(e)}
              />
              <span>Offer</span>
            </div>
          </div>

          <div className='flex gap-2'>
            <label>Amenities: </label>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                name='parking'
                id='parking'
                className='w-5'
                checked={sidebardata.parking}
                onChange={(e) => handleChange(e)}
              />
              <span>Parking</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                name='furnished'
                id='furnished'
                className='w-5'
                checked={sidebardata.furnished}
                onChange={(e) => handleChange(e)}
              />
              <span>furnished</span>
            </div>
          </div>

          <div className='flex items-center gap-2'>
              <label className='font-semibold'>Sort:</label>
              <select 
                id='sort_order' 
                className='border rounded-lg p-3' onChange={(e) => handleChange(e)}
                defaultValue={'createdAt_desc'}
              >
                <option value='regularPrice_desc'>Price high to low</option>
                <option value='regularPrice_asc'>Price low to hight</option>
                <option value='createdAt_desc'>Latest</option>
                <option value='createdAt_asc'>Oldest</option>
              </select>
          </div>
          <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-90'>Search</button>
        </form>
      </div>
      <div className='flex-1 p-3'>
        <h1 className='text-3xl font-semibold border-b-2 p-3 text-slate-700'>Listing results:</h1>

        <div className='p-7 flex flex-wrap gap-4'>
          {!loading && listings.length === 0 && (
            <p className='text-xl text-slate-700'>No listing found!</p>
          )}
          {loading && (
            <p className='text-xl text-slate-700 text-center w-full'>
              Loading...
            </p>
          )}

          {!loading &&
            listings &&
            listings.map((listing) => (
              <ListingCard key={listing._id} listing={listing} />
            ))}

            {showMorebutton &&
              <button 
              className='text-green-700 underline text-center w-full'
              onClick={onShowMoreClick}
            >
              Show more
            </button>}
        </div>
      </div>
    </div>
  )
}
