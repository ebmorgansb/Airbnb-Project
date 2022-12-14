import {csrfFetch} from './csrf'

const GETONESPOT = 'spot/getSpot'
const CREATEONESPOT = 'spot/createSpot'
const RECEIVE = 'spots/getAllSpots'
const DELETESPOT = 'spots/deleteSpot'
const EDITSPOT = 'spots/editSpot'
const CLEARSPOT = 'spot/clearSpot'

export const clearSpotAction = () => {
  return {
    type: CLEARSPOT,
  };
};

export const receiveSpots = (spots) => {
  return {
    type: RECEIVE,
    spots,
  };
};
//action creator for getting one spot
export const receiveSpot = (spot) => {
  return {
    type: GETONESPOT,
    spot,
  };
};

//action creator for creating one spot
export const createSpotAction = (spot) => {
  return {
    type: CREATEONESPOT,
    spot,
  };
};

//action creator for deleting one spot
export const deleteSpotAction = (spotId) => {
  return {
    type: DELETESPOT,
    spotId,
  };
};

//action creator for editting one spot
export const editSpotAction = (spot) => {
  return {
    type: EDITSPOT,
    spot,
  };
};

//Thunk for Creating a Spot
export const createSpotThunk = (spot) => async (dispatch) => {
  const { address, city, state, country, name, description, price, previewImage } = spot;
  const response = await csrfFetch('/api/spots',
  {
 method: 'POST',
 headers: {'Content-Type':'application/json'},
 body: JSON.stringify({
  address,
  city,
  state,
  country,
  name,
  description,
  price,
})
 })

 if (response.ok) {
   const newSpot = await response.json();
   console.log('newSpot in the thunk', newSpot)
   const spotId = newSpot.id
   console.log('spotId in create', spotId)
   const image = await csrfFetch(`/api/spots/${spotId}/images`, {
   method: 'POST',
    body: JSON.stringify({
      url: previewImage,
      preview: true
    })
   }
   )
   if (image.ok) {
    const addImage = await image.json()
    newSpot.previewImage = addImage.url
    newSpot.avgRating = 0
    dispatch(createSpotAction(newSpot));
    return newSpot
   }
 }
};


//Thunk for getting all spots
export const getSpotsThunk = () => async (dispatch) => {
  const res = await fetch(`/api/spots`);
  if (res.ok) {
    const data = await res.json();
    dispatch(receiveSpots(data.Spots));
  }
};

//Thunk for getting a spot
export const getSpotThunk = (spotId) => async (dispatch) => {
  const res = await fetch(`/api/spots/${spotId}`);
  if (res.ok) {
    const spot = await res.json();
    dispatch(receiveSpot(spot));
  }
};

//Thunk for deleting a spot
export const deleteSpotThunk = (spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}`, {method: 'DELETE'});
  if (res.ok) {
    dispatch(deleteSpotAction(spotId));
  }
};

//Thunk for editting a spot
export const editSpotThunk = (spotId, payload) => async (dispatch) => {
  const { address, city, state, country, name, description, price, previewImage } = payload
  const res = await csrfFetch(`/api/spots/${spotId}`, {method: 'PUT',
  body: JSON.stringify({
    address,
    city,
    state,
    country,
    name,
    description,
    price,
    previewImage
  })});
  if (res.ok) {
    const editSpot = await res.json()
    dispatch(editSpotAction(editSpot));
    return editSpot
  }
};



// const CLEARSPOT = 'spot/clearSpot'

// export const clearSpotAction = () => {
//   return {
//     type: CLEARSPOT,
//
//   };
// };


//Reducer

export default function spotReducer(state = {}, action){
    let newState = {}
  switch(action.type){
    case CLEARSPOT:
      return newState
    case RECEIVE:
      action.spots.forEach(spot => {
        newState[spot.id] = spot
      })
      return newState
      case GETONESPOT:
        newState[action.spot.id] = action.spot
        return newState
      case CREATEONESPOT:
        newState = {...state}
        newState[action.spot.id] = action.spot
        return newState
      case DELETESPOT:
      newState = {...state}
      delete newState[action.spotId]
        return newState
      case EDITSPOT:
      newState = {...state}
      newState[action.spot.id] = {...newState[action.spot.id], ...action.spot}
      return newState
    default:
      return state
  }
}

//