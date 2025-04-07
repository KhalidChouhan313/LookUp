import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeCategory, setCategory } from "../../Store/searchReducer";

export default function CategoryComponents(searchClicked, setStep, step) {
  const dispatch = useDispatch();
  const { category } = useSelector((state) => state.search);

  const handleCategoryAdd = (e) => {
    const newCategory = e.target.value;
    dispatch(setCategory([...category, newCategory]));
    setTimeout(() => {
      step === 2 && setStep(3);
    }, 1000);
  };

  return (
    <>
      <div
        className={`mt-8 text-center ${searchClicked ? "block" : "hidden"} `}
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
              onChange={handleCategoryAdd}
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
              onChange={handleCategoryAdd}
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
              onChange={handleCategoryAdd}
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
              onChange={handleCategoryAdd}
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
              onChange={handleCategoryAdd}
            />
            24/7 support for customers and vendors
          </div>
        </div>
      </div>
    </>
  );
}
