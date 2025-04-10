import axios from "axios";
import { Search, UploadIcon } from "lucide-react";
import React, { useRef, useState } from "react";
import Modal from "../Components/Modal";
import { motion, AnimatePresence, m, color } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import MapComponent from "../Components/SearchComponents/Map.jsx";
import {
  removeCategory,
  removeQuery,
  setImageURL,
  setQuery,
  setSearchResults,
  removeLocation,
  setLocation,
  removeRadious,
} from "../Store/searchReducer.js";
import CategoryComponents from "../Components/SearchComponents/CategoryComponents.jsx";

const Home = () => {
  //#region   State Variables

  const [searchClicked, setSearchClicked] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [step, setStep] = useState(1);
  const [image, uploadImage] = useState(null);
  const [showModal, setShowModal] = useState(null);
  const [lastCategoryStep, setLastCategoryStep] = useState(null);
  const searchInputRef = useRef(null);
  //#endregion

  //#region Redux State Variables
  const dispatch = useDispatch();
  const { query, category, imageURL, location } = useSelector(
    (state) => state.search
  );

  //#endregion

  const SearchResult = async () => {
    if (!query.trim() || !category || !location.lat || !location.lng) {
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
    if (lastCategoryStep) {
      setStep(lastCategoryStep);
      setLastCategoryStep(null);
    }
  };
  const RemoveLocation = () => {};
  const RemoveCategory = (e, item) => {
    e.preventDefault();
    setLastCategoryStep(step);
    dispatch(removeCategory(item));
    setStep(1);
  };
  const RemoveQuery = (e, item) => {
    e.preventDefault();
    dispatch(removeQuery(item));
    setSearchValue("");
    setLastCategoryStep(step);
    setSearchClicked(false);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };
  const RemoveImage = (e, item) => {
    e.preventDefault();
    uploadImage(null);
    dispatch(removeCategory(item));
    setLastCategoryStep(step);
    setStep(2);
  };

  const removeMap = () => {
    setLastCategoryStep(step);
    dispatch(removeLocation());
    setStep(3);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      const imageName = file.name;
      dispatch(setImageURL({ url: imageUrl, name: imageName }));
      uploadImage(imageUrl);
      if (lastCategoryStep) {
        setStep(lastCategoryStep);
        setLastCategoryStep(null);
      } else {
        setTimeout(() => {
          setStep(step + 1);
        }, 1000);
      }
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

  const handleSearchClick = async () => {
    if (searchValue.trim() !== "") {
      setSearchClicked(true);
    }
  };
  const handleChange = (e) => {
    const value = parseInt(e.target.value);
    dispatch(setLocation({ ...location, radius: value }));
  };
  const removeRadius = () => {
    setStep(3);
    dispatch(removeRadious());
    setLastCategoryStep(step);
  }
  //#endregion

  return (
    <div className="flex justify-center items-center h-screen flex-col overflow-y-hidden  ">
      <h1
        className={`text-text-color absolute font-dm-sans text-[40px] font-extrabold leading-normal transition-all duration-800 
           ${
             step === 3 || step === 4
               ? "top-[0vh]"
               : searchClicked
               ? "top-[5vh]"
               : "top-[20vh]"
           }`}
      >
        Look Up
      </h1>
      {!searchClicked && (
        <div
          className="flex items-center justify-center flex-col gap-[20px] 
            h-full mb-[20vh] transition-all duration-800 "
        >
          <div className="relative md:w-[30vw] w-[90vw]">
            <input
              type="text"
              id="floating_filled"
              required
              autoComplete="off"
              placeholder=" "
              className={`
      w-full px-4 py-3 rounded-md border border-gray-300 bg-gray-100 
      text-black placeholder-transparent focus:outline-none 
      focus:ring-0 peer transition duration-300
    `}
              value={searchValue || query}
              onChange={(e) => {
                setSearchValue(e.target.value);
                handleQueryChange(e);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearchClick();
                }
              }}
            />
            <label
              htmlForr="floating_filled"
              className="absolute text-md text-gray-500 dark:text-gray-400 duration-300
                 transform -translate-y-4 scale-100 top-4 z-10 origin-[0]
                  start-3 peer-focus:text-blue-600 peer-focus:dark:text-[#77a1c2]
                   peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0
                    peer-focus:scale-100 peer-focus:-translate-y-7 peer-focus:bg-white peer-focus:font-bold rtl:peer-focus:translate-x-4/4
                     rtl:peer-focus:left-auto"
            >
              Search here...{" "}
            </label>

            <div
              className={`
         absolute inset-0  -z-10 rounded-md 
       scale-x-90 scale-y-90 origin-center 
     peer-focus:scale-x-102 peer-focus:scale-y-105 
        transition-transform duration-300  blur-[2px]
    `}
              style={{
                background: "linear-gradient(to right, #0091ff, #ff00fb)",
                blur: "10px",
              }}
            ></div>
            <Search
              onClick={handleSearchClick}
              className={`cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 ${
                searchValue.trim() === ""
                  ? "text-gray-400 cursor-not-allowed"
                  : " bg-clip-text text-gradient-to-r from-blue-500 to-pink-500"
              }`}
              size={30}
            />
          </div>
        </div>
      )}

      <Modal showModal={showModal} setShowModal={setShowModal} />
      <AnimatePresence mode="wait">
        {(searchClicked || step === 2) && (
          <motion.div
            key="step-4"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className="w-full h-full flex flex-col items-center  transition-all duration-800 ease-in-out ">
              <div
                className={`flex items-center justify-center flex-col  ${
                  step === 4 ? "p-3" : "gap-6 md:p-0 p-3"
                }`}
              >
                <AnimatePresence mode="wait">
                  <motion.div className="w-full flex flex-col justify-center items-center">
                    <div className="w-full flex  flex-col">
                      {step == 4 ? null : (
                        <div
                          className=" -mb-[1vh] w-[90VW] md:w-[29rem] h-[4.6875rem] flex items-center
                    p-4 rounded-2xl border border-gray-300 bg-gradient-to-b from-white
                    to-[#f1f1f1]/95 shadow-md"
                        >
                          <h6
                            onClick={(e) => RemoveQuery(e, query)}
                            className="text-[#1F1F1F] cursor-pointer font-dm-sans text-[4vw] md:text-[1rem] font-normal leading-normal"
                          >
                            {query}
                          </h6>
                        </div>
                      )}

                      {(step === 2 || step === 3) && (
                        <>
                          <div
                            className={`-mt-4 w-[90VW] md:w-[29rem] h-[4.6875rem] flex items-center p-3 rounded-t-2xl
                 border border-gray-300 bg-gradient-to-b from-white to-[#f1f1f1]/95 shadow-md
                ${
                  step === 2 || step === 3
                    ? "translate-y-0 opacity-100 scale-100"
                    : "translate-y-full opacity-0 scale-90"
                }`}
                          >
                            <div
                              className={`grid gap-2 mt-1 w-full md:w-[30rem] ${
                                category?.length === 1
                                  ? "grid-cols-1"
                                  : "grid-cols-2"
                              }`}
                            >
                              {" "}
                              {Array.isArray(category) &&
                                category.map((item, index) => {
                                  return (
                                    <label
                                      key={index}
                                      className="border cursor-pointer  text-[#5A81FA]
                             flex items-center justify-center gap-2 p-1
                              rounded-lg shadow-sm text-[4vw] md:text-base bg-white w-full "
                                    >
                                      <input
                                        type="radio"
                                        className="m-1 transform scale-150"
                                        name="category"
                                        id={`category-${index}`}
                                        value={item}
                                        onChange={(e) =>
                                          RemoveCategory(e, item)
                                        }
                                      />
                                      {item.charAt(0).toUpperCase() +
                                        item.slice(1)}
                                    </label>
                                  );
                                })}
                            </div>
                          </div>
                          {step === 3 && image && (
                            <div className="w-full -mt-2 md:w-[29rem] h-[4.6875rem] flex items-center p-3 rounded-t-2xl border border-gray-300 bg-gradient-to-b from-white to-[#f1f1f1]/95 shadow-md translate-y-0 opacity-100 scale-100">
                              <img
                                src={imageURL.url}
                                alt="Meal Image"
                                className="w-16 h-16 object-fill border-dotted border-2 rounded-lg p-1"
                                onClick={(e) => RemoveImage(e, image)}
                              />
                              <h6 className="text-[#1F1F1F] cursor-pointer font-dm-sans text-[4vw] md:text-[1rem] font-normal leading-normal">
                                {imageURL.name}
                              </h6>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </motion.div>
                </AnimatePresence>
                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div
                      key="step-1"
                      initial={{ x: 100, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: -100, opacity: 0 }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="w-full h-full flex flex-col items-center mt-8"
                    >
                      <CategoryComponents
                        searchClicked={searchClicked}
                        setStep={setStep}
                        step={step}
                        lastCategoryStep={lastCategoryStep}
                        setLastCategoryStep={setLastCategoryStep}
                      />
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div
                      key="step-2"
                      initial={{ x: 100, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: -100, opacity: 0 }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    >
                      <div
                        className={`mt- text-center ${
                          searchClicked ? "block" : "hidden"
                        }`}
                      >
                        <h2 className="text-black font-dm-sans text-[6vw] md:text-[1.5rem] font-bold">
                          Product Image
                        </h2>

                        <div className="border-2 border-dashed border-gray-400 rounded-lg w-[20rem] md:w-[30rem] h-[12rem] flex flex-col justify-center items-center bg-gray-50 shadow-sm mt-4">
                          <div className="flex flex-col items-center">
                            {image ? (
                              <img
                                src={imageURL?.url}
                                alt="Product Image"
                                className="w-full md:h-[25vh] h-[18vh]  object-contain rounded-2xl border-2 p-1 border-dashed"
                                onClick={(e) => RemoveImage(e, imageURL)}
                              />
                            ) : (
                              <>
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
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  {step === 3 && (
                    <motion.div
                      key="step-3"
                      initial={{ x: 100, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: -100, opacity: 0 }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    >
                      <div
                        className={` text-center ${
                          searchClicked ? "block" : "hidden"
                        }`}
                      >
                        <h3 className="text-black font-dm-sans text-[6vw] md:text-[1.5rem] font-bold">
                          Your Location
                        </h3>

                        <div
                          className="border-2 border-dashed border-gray-400 
                           rounded-lg w-[20rem] md:w-[29rem] h-[12rem] flex flex-col
                          justify-center items-center bg-gray-50 shadow-sm mt-2"
                        >
                          <MapComponent />
                        </div>
                        <div className="mt-1">
                          <h6 className="text-black font-dm-sans text-[6vw] md:text-[1.5rem] font-bold">
                            Select Your Radius
                          </h6>

                          <input
                            type="range"
                            min="0"
                            max="500"
                            value={location.radius}
                            onChange={handleChange}
                            className="w-full"
                          />
                          <span className="block mt-1 text-black">
                            Radius:{location.radius} km
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {step === 4 && (
                    <motion.div
                      key="step-4"
                      initial={{ x: 100, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: -100, opacity: 0 }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    >
                      <div
                        className={` w-full flex  flex-col items-center justify-center  ${
                          searchClicked ? "block" : "hidden"
                        }`}
                      >
                        <div className="w-full flex items-center justify-center flex-col">
                          <div className=" w-[90vw] flex items-start  justify-start ml">
                            <h5>Search</h5>
                          </div>
                          <div
                            className=" -mb-[1vh] w-[90vw] md:w-[29rem] h-[3.6rem] flex items-center
                   p-4 rounded-2xl border border-gray-300 bg-gradient-to-b from-white to-[#f1f1f1]/95 shadow-md"
                          >
                            <h6
                              onClick={(e) => RemoveQuery(e, query)}
                              className="ml-1 text-[#1F1F1F] font-dm-sans cursor-pointer text-[4vw] md:text-[1rem] font-normal leading-normal"
                            >
                              {query}
                            </h6>
                          </div>
                        </div>

                        <div className="mt-2">
                          <div className=" ">
                            <h5>Search Category</h5>
                          </div>
                          <div
                            className={`  w-[90vw] md:w-[29rem] h-[3.6rem] flex items-center p-3 rounded-2xl
                 border border-gray-300 bg-gradient-to-b from-white to-[#f1f1f1]/95 shadow-md
                 ${
                   step === 2 || step === 3 || step === 4
                     ? "translate-y-0 opacity-100 scale-100"
                     : "translate-y-full opacity-0 scale-90"
                 }`}
                          >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-1 w-full items-center ">
                              {Array.isArray(category) &&
                                category.map((item, index) => {
                                  return (
                                    <label
                                      key={index}
                                      className="border text-[#5A81FA] cursor-pointer flex items-center justify-center gap-2 p-1 rounded-lg shadow-sm text-[4vw] md:text-base bg-white"
                                    >
                                      <input
                                        type="radio"
                                        className="m-1 transform scale-150"
                                        name="category"
                                        id={`category-${index}`}
                                        onChange={(e) =>
                                          RemoveCategory(e, item)
                                        }
                                        value={item}
                                      />
                                      {item.charAt(0).toUpperCase() +
                                        item.slice(1)}
                                    </label>
                                  );
                                })}
                            </div>
                          </div>
                        </div>
                        {image && (
                          <div className="mt-2">
                            <div className="w-[90vw]">
                              <h5>Search Category</h5>
                            </div>
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
                                src={imageURL.url}
                                alt="img"
                                onClick={(e) => RemoveImage(e, image)}
                                className="w-[30vw] md:w-[13vw]  h-[35vw] md:h-[11vw] rounded-xl border-2 border-dashed  p-1"
                              />
                            </div>
                          </div>
                        )}

                        <div className="mt-3 md:mt-2">
                          <div
                            className={`  w-[90vw]  flex items-center justify-center  rounded-2xl border-2 border-dashed border-gray-400
                  bg-gradient-to-b from-white to-[#f1f1f1]/95 shadow-md
                 ${
                   step === 2 || step === 3 || step === 4
                     ? "translate-y-0 opacity-100 scale-100"
                     : "translate-y-full opacity-0 scale-90"
                 }`}
                          >
                            <div
                              className=" flex flex-row gap-2 font-bold text-center "
                              onClick={removeMap}
                            >
                            <MapComponent />
                            </div>
                          </div>
                        </div>
                        <div className="mt-1">
                          <div
                            className="  w-[90vw] flex items-center justify-center  rounded-2xl
                 border border-gray-300 bg-gradient-to-b from-white to-[#f1f1f1]/95 shadow-md
                 "
                          >
                            <p className="font-bold mt-2" 
                            onClick={removeRadius}
                            >
                              Your selected radius: {location.radius}
                              km
                            </p>
                          </div>
                        </div>

                        <div className=" w-full flex items-center justify-center mt-3">
                          <button
                            className="border-2 border-gray-300 bg-white rounded-full px-4 py-2 w-full "
                            style={{ borderRadius: "50px" }}
                            onClick={SearchResult}
                          >
                            Submit Search
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

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
                      className={`mt-1 inline-flex px-[25px] py-[10px]   
              font-medium shadow-md text-[4vw] md:text-base 
              justify-center items-center gap-[10px] border-[1px] 
               border-[rgba(31,31,31,0.30)] bg-white
              ${
                step === 2 && (!imageURL || RemoveImage)
                  ? "cursor-not-allowed text-gray-400"
                  : "cursor-pointer text-gray-700"
              }`}
                      style={{ borderRadius: "50px" }}
                      onClick={nextStep}
                      disabled={step === 2 && (!imageURL || RemoveImage)} // Ensure this evaluates to a boolean value
                    >
                      Next
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;
