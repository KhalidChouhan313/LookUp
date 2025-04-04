// src/Store/Reducer/searchSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  query: "",
  category: [],
  imageURL: null,
  location: { lat: null, lng: null, radius: null },
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
  },
});

export const { setQuery, setCategory, setImageURL, setLocation, setSearchResults } = searchSlice.actions;

export default searchSlice.reducer;
