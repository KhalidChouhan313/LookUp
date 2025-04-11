import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCategory } from "../../Store/searchReducer";
import { toast } from "react-toastify";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function CategoryComponents({
  searchClicked,
  setStep,
  step,
  lastCategoryStep,
  setLastCategoryStep,
}) {
  const dispatch = useDispatch();
  const { category } = useSelector((state) => state.search);

  const handleCategoryAdd = (e) => {
    const newCategory = e.target.value;

    if (!category.includes(newCategory)) {
      dispatch(setCategory([...category, newCategory]));
      if (lastCategoryStep) {
        setStep(lastCategoryStep);
        setLastCategoryStep(null);
      } else {
        setStep(step + 1);
      }
    } else {
      toast.error("Category already selected!");
    }
  };

  const settings = {
    className: "center",
    centerMode: true,
    infinite: true,
    centerPadding: "50px",
    slidesToShow: 3,
    speed: 500,
    rows: 3,
    slidesPerRow: 2,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesPerRow: 1,
          rows: 2,
        },
      },
    ],
  };

  const categories = [
    { value: "quick_meals", label: "Quick and Easy Meals" },
    { value: "electronics", label: "Electronics" },
    { value: "live_updates", label: "Live Order Updates" },
    { value: "support", label: "24/7 Customer Support" },
    { value: "groceries", label: "Groceries" },
    { value: "clothing", label: "Clothing" },
    { value: "appliances", label: "Home Appliances" },
    { value: "books", label: "Books & Stationery" },
  ];

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <h2 className="text-blue-400 font-dm-sans text-[6vw] md:text-[1.5rem] font-bold mb-4">
        Select a Category
      </h2>

      <div className="w-full max-w-[90vw] md:max-w-[70vw]">
        <Slider {...settings}>
          {categories.map((categoryItem, index) => (
            <div key={index} className="p-2">
              <label
                htmlFor={categoryItem.value}
                className="w-full border cursor-pointer text-[#5A81FA] flex items-center justify-center p-3 rounded-lg shadow-md text-[4vw] md:text-base bg-white hover:bg-gray-50 transition duration-300"
              >
                <input
                  type="radio"
                  className="m-1 transform scale-150"
                  name="category"
                  id={categoryItem.value}
                  value={categoryItem.value}
                  onChange={handleCategoryAdd}
                />
                {categoryItem.label}
              </label>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}
