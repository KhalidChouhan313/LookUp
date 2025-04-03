// src/Store/Reducer/Store.js
import { configureStore } from "@reduxjs/toolkit";
  import searchReducer from "../searchReducer.js"; 

const store = configureStore({
  reducer: {
    search: searchReducer,
  },
});

export default store;
