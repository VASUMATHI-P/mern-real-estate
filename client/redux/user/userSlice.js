import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  error: null,
  loading: false,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
      state.error = null;
    }, 
    signInSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
    },
    signInFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    updateUserStart: (state) => {
      state.loading = true;
    },
    updateUserSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = false;
    },
    updateUserFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    deleteUserStart: (state) => {
      state.loading = true;
      state.error = false;
    },
    deleteUserSuccess: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = false;
    },
    deleteUserFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    signoutStart: (state) => {
      state.loading = true;
      state.error = false;
    },
    signoutSuccess: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = false;
    },
    signoutFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    }
  }
})

export const {
  signInStart, 
  signInSuccess, 
  signInFailure, 
  updateUserFailure, 
  updateUserSuccess, 
  updateUserStart,
  deleteUserFailure,
  deleteUserSuccess,
  deleteUserStart,
  signoutStart,
  signoutSuccess,
  signoutFailure
} = userSlice.actions;
export default userSlice.reducer;