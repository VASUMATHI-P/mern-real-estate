import Listing from '../models/listing.model.js';
import { errorHandler } from '../utils/error.js';

export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return next(errorHandler(404, 'Listing not found!'));
  }
  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, 'You can only delete your own listings!'));
  }

  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json('Listing has been deleted!');
  } catch (error) {
    next(error);
  }
}

export const updateListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return next(errorHandler(404, 'Listing not found!'));
  }
  if(req.user.id !== listing.userRef){
    return next(errorHandler(401, 'You can only update your own listings!'));
  }

  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
    res.status(200).json(updatedListing);
  } catch(err){
    next(err);
  }
}

export const getListing = async (req, res, next) => {
  try{
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, 'Listing not found'));
    }
    res.status(200).json(listing);
  } catch(err){
    next(err);
  }
}

export const getListings = async (req, res, next) => {
  const limit = parseInt(req.query.limit) || 10;
  const startIndex = parseInt(req.query.startIndex) || 0;
  const sort = req.query.sort || 'createdAt';
  const order = req.query.order || 'desc';
  const searchTerm = req.query.searchTerm || '';

  let offer = req.query.offer;
  if(offer === undefined || offer === 'false'){
    offer = { $in : [true, false]}
  }

  let furnished = req.query.furnished;
  if(furnished === undefined || furnished === 'false'){
    furnished = { $in : [true, false] }
  }

  let parking = req.query.parking;
  if(parking === undefined || parking === 'false'){
    parking = { $in : [true, false] }
  }

  let type = req.query.type;
  if(type === undefined || type === 'all'){
    type = { $in : ['rent', 'sale', 'house', 'penthouse'] }
  }

  try {
    const listings = await Listing.find({
      name : {$regex: searchTerm, $options: 'i'},
      offer,
      parking,
      furnished,
      type
    }).sort({[sort] : order})
      .limit(limit)
      .skip(startIndex)

    res.status(200).json(listings);
  } catch(err){
    next(err);
  }
}