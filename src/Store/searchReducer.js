// src/Store/Reducer/searchSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  query: "",
  category: [],
  imageURL: {
    url: null,
    name: null,
  },
  location: { lat: null, lng: null, radius: 0 },
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
      state.imageURL = {
        url: action.payload.url,
        name: action.payload.name,
      };
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
      state.imageURL = {
        url: null,
        name: null,
      };
    },
    removeLocation: (state) => {
      delete state.location;
    },
    removeRadious: (state) => {
      state.location.radius = 0;
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
  removeLocation,
  removeRadious,
} = searchSlice.actions;

export default searchSlice.reducer;
