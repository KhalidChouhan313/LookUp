// src/Store/Reducer/searchSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  query: "",
  category: [],
  imageURL: null,
  location: { lat: null, lng: null, radius: null, screenShot: null },
  searchResults: [],
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setQuery: (state, action) => {
      state.query = action.payload;
    },
    setCategory: (state, action) => {
      state.category = action.payload;
    },
    setImageURL: (state, action) => {
      state.imageURL = action.payload;
    },
    setLocation: (state, action) => {
      state.location = action.payload;
    },
    setSearchResults: (state, action) => {
      state.searchResults = action.payload;
    },
    removeCategory: (state, action) => {
      state.category = state.category.filter((c) => c !== action.payload);
    },
    removeQuery: (state) => {
      delete state.query;
    },
    removeImageURL: (state) => {
      delete state.imageURL;
    },
    removeLocation: (state) => {
      delete state.location;
    },
  },
});

export const {
  setQuery,
  setCategory,
  setImageURL,
  setLocation,
  setSearchResults,
  removeCategory,
  removeQuery,
} = searchSlice.actions;

export default searchSlice.reducer;
