import axios from "axios";
import { Search, UploadIcon } from "lucide-react";
import React, { useRef, useState } from "react";
import Modal from "../Components/Modal";
import { motion, AnimatePresence, m } from "framer-motion";
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
    const file = event.target.files[0];
    if (file) {
      const uploadFile = URL.createObjectURL(file);
      uploadImage(uploadFile);
      dispatch(setImageURL(uploadFile));

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
  //#endregion

  return (
    <div className="flex justify-center items-center h-screen flex-col overflow-y-hidden  ">
      <AnimatePresence>
        {!searchClicked && (
          <motion.div
            initial={{ y: 0, opacity: 1, backgroundColor: "transparent" }}
            exit={{
              y: 100,
              opacity: 0,
              duration: 0.1,
              backgroundColor: "black",
              width: "100%",
              height: "100vh",
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="flex items-center justify-center flex-col gap-[20px] 
               transition-all duration-500 ease-in-out h-full mb-[40%] md:mb-[10%]"
          >
            <h1 className="text-text-color font-dm-sans text-[40px] font-extrabold leading-normal">
              Look Up
            </h1>
            <div className="flex items-center border rounded-full px-4 py-3 transition-all duration-300 relative md:w-[30vw] w-[100vw] border-gray-300 md:p-10 p-[10vw]">
              <Search
                onClick={handleSearchClick}
                className={`cursor-pointer transition-transform duration-300 absolute left-[90%] ${
                  searchValue.trim() === ""
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-black hover:text-black"
                }`}
                size={24}
              />
              <input
                type="text"
                ref={searchInputRef}
                className="ml-2 w-full bg-transparent outline-none transition-opacity duration-300"
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
                placeholder="Search Here..."
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence mode="wait">
        <Modal showModal={showModal} setShowModal={setShowModal} />
        {(searchClicked || step === 2) && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="your-other-classes"
          >
            <div
              className={`w-full h-full flex flex-col items-center transition-all duration-[1500ms] ease-in-out 
    
  `}
            >
              <div
                className={`flex items-center justify-center flex-col  ${
                  step === 4 ? "p-3" : "gap-6 md:p-0 p-3"
                }`}
              >
                <h1 className="text-text-color font-dm-sans text-[8vw] md:text-[2.5rem] font-extrabold leading-normal">
                  Look Up
                </h1>
                <div className="w-full flex  flex-col">
                  {step == 4 ? null : (
                    <div
                      className=" -mb-[1vh] w-[90VW] md:w-[29rem] h-[4.6875rem] flex items-center
             p-4 rounded-t-2xl border border-gray-300 bg-gradient-to-b from-white
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
                                    onChange={(e) => RemoveCategory(e, item)}
                                  />
                                  {item.charAt(0).toUpperCase() + item.slice(1)}
                                </label>
                              );
                            })}
                        </div>
                      </div>
                      {step === 3 && image && (
                        <div className="w-full -mt-2 md:w-[29rem] h-[4.6875rem] flex items-center p-3 rounded-t-2xl border border-gray-300 bg-gradient-to-b from-white to-[#f1f1f1]/95 shadow-md translate-y-0 opacity-100 scale-100">
                          <img
                            src={imageURL}
                            alt="Meal Image"
                            className="w-16 h-16 object-fill border-dotted border-2 rounded-lg p-1"
                            onClick={(e) => RemoveImage(e, image)}
                          />
                        </div>
                      )}
                    </>
                  )}
                </div>
                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div
                      key="category"
                      initial={{ y: 100, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 100, opacity: 0 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
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
                      key="category"
                      initial={{ y: 200, opacity: 0, scale: 0.9 }}
                      animate={{ y: 0, opacity: 1, scale: 1 }}
                      exit={{ y: 200, opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
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
                                src={imageURL}
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
                    <div
                      className={` text-center ${
                        searchClicked ? "block" : "hidden"
                      }`}
                    >
                      <h3 className="text-black font-dm-sans text-[6vw] md:text-[1.5rem] font-bold">
                        Select Location & Search Radius{" "}
                      </h3>

                      <div
                        className="border-2 border-dashed border-gray-400 
                rounded-lg w-[20rem] md:w-[29rem] h-[10rem] flex flex-col
                 justify-center items-center bg-gray-50 shadow-sm mt-4"
                      >
                        {<MapComponent /> ? (
                          <MapComponent />
                        ) : (
                          <h2>Loading...</h2>
                        )}
                      </div>
                    </div>
                  )}
                  {step === 4 && (
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
                                      onChange={(e) => RemoveCategory(e, item)}
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
                              src={imageURL}
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
                            <img
                              src={location.screenShot}
                              alt="selected area screenShot"
                              className=" w-[30rem]  rounded-[10px] h-[5] md:h-[6.8rem] object-center"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="mt-1">
                        <div
                          className="  w-[90vw] flex items-center justify-center  rounded-2xl
                 border border-gray-300 bg-gradient-to-b from-white to-[#f1f1f1]/95 shadow-md
                 "
                        >
                          <p className="font-bold mt-2">
                            Your selected radius:{" "}
                            {location.radius
                              ? Math.round(location.radius / 1000)
                              : 0}
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
                      className={`mt-6 inline-flex px-[25px] py-[10px]   
              font-medium shadow-md text-[4vw] md:text-base 
              justify-center items-center gap-[10px] border-[1px]  border-[rgba(31,31,31,0.30)] bg-white
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
