import { Search, UploadIcon, Scan, MapIcon } from "lucide-react";
import React, { useState } from "react";
import Modal from "../Components/Modal";
import axios from "axios";

import { useDispatch, useSelector } from "react-redux";
import {
  setQuery,
  setCategory,
  setImageURL,
  setLocation,
  setSearchResults,
} from "../Store/searchReducer.js";
import { useEffect } from "react";
import { toast } from "react-toastify";
const Home = () => {
  //#region   State Variables
  const [isActive, setIsActive] = useState(false);
  const [hasClickedOnce, setHasClickedOnce] = useState(false);
  const [searchClicked, setSearchClicked] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [step, setStep] = useState(1);
  const [image, uploadImage] = useState(null);
  const [showModal, setShowModal] = useState(null);

  //#endregion

  //#region Redux State Variables
  const dispatch = useDispatch();
  const { query, category, imageURL, location } = useSelector(
    (state) => state.search
  );

  //#endregion

  const SearchResult = async () => {
    if (!query.trim() || !category || !location.lat || !location.lng) {
      toast("Please complete all steps before searching!");
      return;
    }
    const token = localStorage.getItem("token"); 
    if (!token) {
      toast.error("User not logged in! No token found.");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:8000/pi/search/query",
        {
          query,
          searchCategory: category,
          longitude: parseFloat(location.lng),
          latitude: parseFloat(location.lat),
          radius: parseFloat(location.radius),
        },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch(setSearchResults(response.data));
    } catch (error) {
      console.error("Error fetching search results:", error);
      toast.error("Failed to fetch search results. Please try again.");
    }
  };

  //#region Functions
  const handleQueryChange = (e) => {
    dispatch(setQuery(e.target.value));
  };
  const handleCategoryChange = (e) => dispatch(setCategory(e.target.value));
  const handleImageUpload = (e) => {
    const file = event.target.files[0];
    if (file) {
      const uploadFile = URL.createObjectURL(file);
      uploadImage(uploadFile);
      dispatch(setImageURL(uploadFile));
      toast("success uploaded image");
    }
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          dispatch(setLocation({ lat: latitude, lng: longitude, radius: 10 }));
          toast("siccess");
          console.log(latitude, longitude);
        },

        () => toast.error("Geolocation access denied")
      );
    } else {
      toast.error("Geolocation is not supported by this browser.");
    }
  };

  const nextStep = () => {
    // if (step === 1 && !searchState.category) {
    //   alert("Please  select a category!");
    //   return;
    // }
    // if (
    //   step === 3 &&
    //   (!searchState.location.lat || !searchState.location.lng)
    // ) {
    //   alert("Please allow location access!");
    //   return;
    // }
    setStep(step + 1);
  };

  const handleClick = () => {
    if (!hasClickedOnce) {
      setIsActive(true);
      setHasClickedOnce(true);
    }
  };

  const handleSearchClick = async () => {
    const savedToken = localStorage.getItem("token");
    if (!savedToken) {
      toast("Unauthorized access! Please login first.");
      setShowModal("login");
      return;
    }

    if (searchValue.trim() !== "") {
      setSearchClicked(true);
      if (!savedToken) {
        showModal(true);
      }
    }
  };
  //#endregion

  return (
    <div className="flex justify-center items-center h-screen flex-col overflow-y-hidden ">
      <div
        className={`flex items-center justify-center flex-col gap-[20px] 
          transition-all duration-500 ease-in-out h-full ${
            searchClicked ? " hidden  " : "block"
          }`}
      >
        <h1 className="text-text-color font-dm-sans text-[40px] font-extrabold leading-normal">
          Look Up
        </h1>

        <div
          className={`flex items-center border rounded-full px-4 py-3 transition-all duration-300 relative ${
            isActive
              ? "md:w-[30vw] w-[100vw] border-gray-400 shadow-lg"
              : "md:w-[30vw] w-full border-gray-300 md:p-10 p-[10vw]"
          }`}
          onClick={handleClick}
        >
          <Search
            onClick={handleSearchClick}
            className={`cursor-pointer transition-transform duration-300 absolute ${
              searchValue.trim() === ""
                ? "text-gray-400 cursor-not-allowed"
                : "text-black hover:text-black"
            } ${
              isActive
                ? "md:left-[90%] left-80 rotate-90 scale-110 ease-in duration-300"
                : "rotate-0"
            }`}
            size={24}
          />
          <span
            className={`ml-10 whitespace-nowrap text-[rgba(31,31,31,0.60)] font-dmSans text-[16px] font-normal leading-normal ${
              isActive ? "hidden" : "block"
            }`}
          >
            Search products or services
          </span>
          <input
            type="text"
            className={`ml-2 w-full bg-transparent outline-none  transition-opacity duration-300 ${
              isActive ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            value={searchValue || query}
            onChange={(e) => {
              setSearchValue(e.target.value);
              handleQueryChange(e);
            }}
            placeholder="Search Here..."
          />
        </div>
      </div>
      <Modal showModal={showModal} setShowModal={setShowModal} />
      <div
        className={`w-full h-full flex flex-col items-center transition-all duration-[1500ms] ease-in-out 
    ${
      searchClicked || step === 2
        ? "translate-y-0 opacity-100 scale-100"
        : "translate-y-full opacity-0 scale-90"
    }
  `}
      >
        <div className="flex items-center justify-center flex-col gap-6 md:p-0 p-3 ">
          <h1 className="text-text-color font-dm-sans text-[8vw] md:text-[2.5rem] font-extrabold leading-normal">
            Look Up
          </h1>
          <div className="w-full flex items-center justify-center flex-col">
            <div
              className=" -mb-[1vh] w-full md:w-[29rem] h-[4.6875rem] flex items-center
             p-4 rounded-t-lg border border-gray-300 bg-gradient-to-b from-white to-[#f1f1f1]/95 shadow-md"
            >
              <h6 className="text-[#1F1F1F] font-dm-sans text-[4vw] md:text-[1rem] font-normal leading-normal">
                Search Item
              </h6>
            </div>
            {(step === 2 || step === 3) && (
              <>
                <div
                  className={`-mt-2 w-full md:w-[29rem] h-[4.6875rem] flex items-center p-3 rounded-t-lg
                 border border-gray-300 bg-gradient-to-b from-white to-[#f1f1f1]/95 shadow-md
        ${
          step === 2 || step === 3
            ? "translate-y-0 opacity-100 scale-100"
            : "translate-y-full opacity-0 scale-90"
        }`}
                >
                  <div className="grid grid-cols-2 md:grid-cols-2 gap-2 mt-1 w-full md:w-[30rem]">
                    <div
                      className="border text-[#5A81FA] flex items-center justify-center gap-2
                           p-1 rounded-lg shadow-sm text-[4vw] md:text-base bg-white"
                    >
                      <Scan />
                      Quality meal choices
                    </div>
                    <div
                      className="border text-[#5A81FA] flex items-center justify-center gap-1 md:gap-2
           bg-white rounded-lg shadow-sm text-[4vw] md:text-base"
                    >
                      <Scan />
                      Highly rated riders
                    </div>
                  </div>
                </div>

                {step === 3 && (
                  <div
                    className={`w-full -mt-2 md:w-[29rem] h-[4.6875rem] flex items-center p-3 rounded-t-lg
                   border border-gray-300 bg-gradient-to-b from-white to-[#f1f1f1]/95 shadow-md
          translate-y-0 opacity-100 scale-100`}
                  >
                    <img
                      src={image}
                      alt="Meal Image"
                      className="w-16 h-16 object-fill border-dotted border-2 rounded-lg p-1"
                    />
                  </div>
                )}
              </>
            )}
          </div>

          {step === 1 && (
            <div
              className={`mt-8 text-center ${
                searchClicked ? "block" : "hidden"
              } `}
            >
              <h2 className="text-blue-400 font-dm-sans text-[6vw] md:text-[1.5rem] font-bold">
                Categories
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-2 gap-2 mt-1 w-full md:w-[30rem]">
                <div className="border text-[#5A81FA] flex items-center justify-center md:p-3 p-2 rounded-lg shadow-sm text-[4vw] md:text-base">
                  <input
                    type="radio"
                    name="category"
                    id="onboarding"
                    value="Quick and easy onboarding"
                    onChange={handleCategoryChange}
                  />
                  Quick and easy onboarding
                </div>
                <div className="border text-[#5A81FA] flex items-center justify-center gap-2 md:p-3 p-2 rounded-lg shadow-sm text-[4vw] md:text-base">
                  <input
                    type="radio"
                    name="category"
                    id="mealChoices"
                    value="Quality meal choices"
                    onChange={handleCategoryChange}
                  />
                  Quality meal choices
                </div>
                <div className="border text-[#5A81FA] flex items-center justify-center gap-2 md:p-3 p-2 rounded-lg shadow-sm text-[4vw] md:text-base">
                  <input
                    type="radio"
                    name="category"
                    id="liveUpdates"
                    value="Live updates on order"
                    onChange={handleCategoryChange}
                  />
                  Live updates on order
                </div>
                <div className="border text-[#5A81FA] flex items-center justify-center gap-2 md:p-3 p-2 rounded-lg shadow-sm text-[4vw] md:text-base">
                  <input
                    type="radio"
                    name="category"
                    id="riders"
                    value="electronics"
                    onChange={handleCategoryChange}
                  />
                  Electronics{" "}
                </div>
                <div className="col-span-2 md:col-span-2 border text-[#5A81FA] flex items-center justify-center gap-2 p-3 rounded-lg shadow-sm text-[4vw] md:text-base">
                  <input
                    type="radio"
                    name="category"
                    id="support"
                    value="24/7 support for customers and vendors"
                    onChange={handleCategoryChange}
                  />
                  24/7 support for customers and vendors
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div
              className={`mt-8 text-center ${
                searchClicked ? "block" : "hidden"
              }`}
            >
              <h2 className="text-black font-dm-sans text-[6vw] md:text-[1.5rem] font-bold">
                Product Image
              </h2>

              <div className="border-2 border-dashed border-gray-400 rounded-lg w-[20rem] md:w-[30rem] h-[12rem] flex flex-col justify-center items-center bg-gray-50 shadow-sm mt-4">
                <div className="flex flex-col items-center">
                  <div className="relative w-10 h-10">
                    <div className="w-10 h-10 bg-blue-100 text-blue-500 flex justify-center items-center rounded-full cursor-pointer">
                      <UploadIcon className="w-6 h-6 cursor-pointer" />
                    </div>

                    <input
                      type="file"
                      id="fileUpload"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={handleImageUpload}
                      accept="image/*"
                    />
                  </div>

                  <p className="text-blue-500 text-sm mt-2">
                    Drag & Drop file here or
                    <span className="text-blue-500 cursor-pointer font-bold">
                      Choose File
                    </span>
                  </p>
                </div>
              </div>
            </div>
          )}
          {step === 3 && (
            <div
              className={` text-center ${searchClicked ? "block" : "hidden"}`}
            >
              <h3 className="text-black font-dm-sans text-[6vw] md:text-[1.5rem] font-bold">
                Select Location & Search Radius{" "}
              </h3>

              <div className="border-2 border-dashed border-gray-400 rounded-lg w-[20rem] md:w-[29rem] h-[10rem] flex flex-col justify-center items-center bg-gray-50 shadow-sm mt-4">
                <div
                  className="flex 
                flex-col items-center"
                >
                  <div className="relative w-10 h-10">
                    <div className="w-10 h-10 bg-blue-100 text-blue-500 flex justify-center items-center rounded-full cursor-pointer">
                      <MapIcon
                        className="w-6 h-6 cursor-pointer"
                        onClick={getLocation}
                      />
                    </div>
                  </div>

                  <p className="text-blue-500 text-sm mt-2">
                    Share your Location
                  </p>
                </div>
              </div>
              <button
                onClick={SearchResult}
                className="mt-4 border-2 p-2 bg-red-500 "
              >
                submit Search
              </button>
            </div>
          )}

          <div className=" flex items-center justify-center gap-4">
            {step === 2 && (
              <button
                className="mt-6 inline-flex px-[25px] py-[10px]   
          text-gray-700 font-medium shadow-md text-[4vw] md:text-base 
          justify-center items-center gap-[10px] border-[1px]  border-[rgba(31,31,31,0.30)] bg-white"
                style={{ borderRadius: "50px" }}
                onClick={nextStep}
              >
                Skip
              </button>
            )}
            <button
              className="mt-6 inline-flex px-[25px] py-[10px]   
          text-gray-700 font-medium shadow-md text-[4vw] md:text-base 
          justify-center items-center gap-[10px] border-[1px]  border-[rgba(31,31,31,0.30)] bg-white"
              style={{ borderRadius: "50px" }}
              onClick={nextStep}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
