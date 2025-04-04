import { Search, UploadIcon, Scan, MapIcon, MapPin } from "lucide-react";
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
      toast("Unauthorized access! Please login first.");
      setShowModal("login");
      return;
    }
    try {
      const response = await axios.post(
        "https://temp-production-e067.up.railway.app/api/search/query",
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
  const handleCategoryChange = (e) => {
    const newCategory = e.target.value;
    dispatch(setCategory([...category, newCategory]));
  };
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
    console.log("category selected", category);

    if (step === 1 && (!Array.isArray(category) || category.length === 0)) {
      toast.error("Please select a category!");
      return;
    }
    if (
      step === 3 &&
      (location.lat === null ||
        location.lng === null ||
        location.radius === null)
    ) {
      toast.error("Please allow location access!");
      return;
    }

    setStep(step + 1);
  };

  const handleClick = () => {
    if (!hasClickedOnce) {
      setIsActive(true);
      setHasClickedOnce(true);
    }
  };

  const handleSearchClick = async () => {
   

    if (searchValue.trim() !== "") {
      setSearchClicked(true);
    
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
        <div className={`flex items-center justify-center flex-col  ${step === 4 ? "p-3" : "gap-6 md:p-0 p-3"}`}>
          <h1 className="text-text-color font-dm-sans text-[8vw] md:text-[2.5rem] font-extrabold leading-normal">
            Look Up
          </h1>
          <div className="w-full flex  flex-col">
            {step == 4 ? null : (
              <div
                className=" -mb-[1vh] w-full md:w-[29rem] h-[4.6875rem] flex items-center
             p-4 rounded-t-lg border border-gray-300 bg-gradient-to-b from-white to-[#f1f1f1]/95 shadow-md"
              >
                <h6 className="text-[#1F1F1F] font-dm-sans text-[4vw] md:text-[1rem] font-normal leading-normal">
                  Search Item
                </h6>
              </div>
            )}

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
                    {Array.isArray(category) &&
                      category.map((item, index) => {
                        return (
                          <div
                            key={index}
                            className="border text-[#5A81FA] flex items-center justify-center gap-2 p-1 rounded-lg shadow-sm text-[4vw] md:text-base bg-white"
                          >
                            <input
                              type="radio"
                              className="m-1 transform scale-150"
                              name="category"
                              id={`category-${index}`}
                              value={item}
                            />
                            {item.charAt(0).toUpperCase() + item.slice(1)}
                          </div>
                        );
                      })}
                  </div>
                </div>
                {step === 3 && image && (
                  <div className="w-full -mt-2 md:w-[29rem] h-[4.6875rem] flex items-center p-3 rounded-t-lg border border-gray-300 bg-gradient-to-b from-white to-[#f1f1f1]/95 shadow-md translate-y-0 opacity-100 scale-100">
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
                    className="m-1 transform scale-150"
                    name="category"
                    id="support"
                    value="  Quality meal choices
"
                    onChange={handleCategoryChange}
                  />
                  Quick and easy onboarding
                </div>
                <div className="border text-[#5A81FA] flex items-center justify-center gap-2 md:p-3 p-2 rounded-lg shadow-sm text-[4vw] md:text-base">
                  <input
                    type="radio"
                    className="m-1 transform scale-150"
                    name="category"
                    id="support"
                    value="electronics
"
                    onChange={handleCategoryChange}
                  />
                  Quality meal choices
                </div>
                <div className="border text-[#5A81FA] flex items-center justify-center gap-2 md:p-3 p-2 rounded-lg shadow-sm text-[4vw] md:text-base">
                  <input
                    type="radio"
                    className="m-1 transform scale-150"
                    name="category"
                    id="support"
                    value="electronics
"
                    onChange={handleCategoryChange}
                  />
                  Live updates on order
                </div>
                <div className="border text-[#5A81FA] flex items-center justify-center gap-2 md:p-3 p-2 rounded-lg shadow-sm text-[4vw] md:text-base">
                  <input
                    type="radio"
                    className="m-1 transform scale-150"
                    name="category"
                    id="support"
                    value="electronics
"
                    onChange={handleCategoryChange}
                  />
                  Electronics{" "}
                </div>
                <div className="col-span-2 md:col-span-2 border text-[#5A81FA] flex items-center justify-center gap-2 p-3 rounded-lg shadow-sm text-[4vw] md:text-base">
                  <input
                    type="radio"
                    className="m-1 transform scale-150"
                    name="category"
                    id="support"
                    value="electronics
"
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
                      <MapPin
                        className="w-8 h-8 cursor-pointer"
                        onClick={getLocation}
                      />
                    </div>
                  </div>

                  <p className="text-blue-500 text-sm mt-2">
                    Share your Location
                  </p>
                </div>
              </div>
            </div>
          )}
          {step === 4 && (
            <div className={`  ${searchClicked ? "block" : "hidden"}`}>
              <h4 className="">Search</h4>
              <div className="w-full flex  flex-col">
                <div
                  className=" -mb-[1vh] w-full md:w-[29rem] h-[4rem] flex items-center
                   p-4 rounded-2xl border border-gray-300 bg-gradient-to-b from-white to-[#f1f1f1]/95 shadow-md"
                >
                  <h6 className="ml-1 text-[#1F1F1F] font-dm-sans text-[4vw] md:text-[1rem] font-normal leading-normal">
                    Search Item
                  </h6>
                </div>
              </div>

              <div className="mt-3">
                <h4 className="">Search Category</h4>
                <div
                  className={`  w-full md:w-[29rem] h-[4rem] flex items-center p-3 rounded-2xl
                 border border-gray-300 bg-gradient-to-b from-white to-[#f1f1f1]/95 shadow-md
                 ${
                   step === 2 || step === 3 || step === 4
                     ? "translate-y-0 opacity-100 scale-100"
                     : "translate-y-full opacity-0 scale-90"
                 }`}
                >
                  <div className="grid grid-cols-2 md:grid-cols-2 gap-2 mt-1 w-full items-center ">
                    {Array.isArray(category) &&
                      category.map((item, index) => {
                        return (
                          <div
                            key={index}
                            className="border text-[#5A81FA] flex items-center justify-center gap-2 p-1 rounded-lg shadow-sm text-[4vw] md:text-base bg-white"
                          >
                            <input
                              type="radio"
                              className="m-1 transform scale-150"
                              name="category"
                              id={`category-${index}`}
                              value={item}
                            />
                            {item.charAt(0).toUpperCase() + item.slice(1)}
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
              {image && (
                <div className="mt-3">
                  <h4 className="">Search Category</h4>
                  <div
                    className={`  w-full flex items-center justify-center p-2 rounded-2xl
               border border-gray-300 bg-gradient-to-b from-white to-[#f1f1f1]/95 shadow-md
               ${
                 step === 2 || step === 3 || step === 4
                   ? "translate-y-0 opacity-100 scale-100"
                   : "translate-y-full opacity-0 scale-90"
               }`}
                  >
                    <img
                      src={image}
                      alt="img"
                      className="w-[20vw] md:w-[10vw]  h-[20vw] md:h-[8vw] rounded-xl border-2 border-dashed  p-1"
                    />
                  </div>
                </div>
              )}

              <div className="mt-3">
                <div
                  className={`  w-full  flex items-center p-3 rounded-2xl

                 border border-gray-300 bg-gradient-to-b from-white to-[#f1f1f1]/95 shadow-md
                 ${
                   step === 2 || step === 3 || step === 4
                     ? "translate-y-0 opacity-100 scale-100"
                     : "translate-y-full opacity-0 scale-90"
                 }`}
                >
                  <div className=" flex flex-row gap-2 font-bold text-center ">
                    <p>Latitude: {location.lat}</p>
                    <p> Longitude: {location.lng}</p>
                  </div>
                </div>
              </div>
              <div className="mt-1">
                <div
                  className={`  w-full md:w-[29rem] h-[4rem] flex items-center p-3 rounded-full
                 border border-gray-300 bg-gradient-to-b from-white to-[#f1f1f1]/95 shadow-md
                 ${
                   step === 2 || step === 3 || step === 4
                     ? "translate-y-0 opacity-100 scale-100"
                     : "translate-y-full opacity-0 scale-90"
                 }`}
                >
                  <div className=" flex flex-row ">
                    <p className="font-bold">Your selected radius: {location.radius}km</p>
                  </div>
                </div>
              </div>

              <div className=" w-full flex items-center justify-center mt-3">
                <button className="border-2 border-gray-300 bg-white rounded-full px-4 py-2 w-full " style={{ borderRadius: "50px" }}
                 onClick={SearchResult}>
                  Submit Search
                </button>
              </div>
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
            {step === 4 ? null : (
              <button
                className="mt-6 inline-flex px-[25px] py-[10px]   
        text-gray-700 font-medium shadow-md text-[4vw] md:text-base 
        justify-center items-center gap-[10px] border-[1px]  border-[rgba(31,31,31,0.30)] bg-white"
                style={{ borderRadius: "50px" }}
                onClick={nextStep}
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
