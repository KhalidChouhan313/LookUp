import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";

const Modal = ({ showModal, setShowModal }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    phoneNumber: "",
  });


  const handleChange = async (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        "https://temp-production-e067.up.railway.app/api/user/auth/signup",
        formData,
        { withCredentials: true }
      );
      localStorage.setItem("token", response.data.token);
      toast("Singup Successful:");
      setShowModal("login");
    } catch (error) {
      toast("Signup Failed");
    }
    setLoading(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        "https://temp-production-e067.up.railway.app/api/user/auth/login",

        {
          emailOrPhone: formData.email,
          password: formData.password,
        },
        { withCredentials: true }
      );
      setShowModal(null);
      localStorage.setItem("token", response.data.token);
      toast("Login Successful:");
    } catch (error) {
      toast("Login Failed:");
    }
    setLoading(false);
  };

  return (
    <>
      {showModal && (
        <div className="modal show d-block">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {showModal === "signup" ? "Signup" : "Login"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(null)}
                ></button>
              </div>
              <div className="modal-body">
                <form
                  onSubmit={showModal === "signup" ? handleSignup : handleLogin}
                >
                  <input
                    type="email"
                    name="email"
                    className="form-control mb-2"
                    placeholder="Email"
                    onChange={handleChange}
                    required
                  />
                  {showModal === "signup" && (
                    <input
                      type="text"
                      name="phoneNumber"
                      className="form-control mb-2"
                      placeholder="Phone Number"
                      onChange={handleChange}
                      required
                    />
                  )}
                  <input
                    type="password"
                    name="password"
                    className="form-control mb-2"
                    placeholder="Password"
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="submit"
                    className="btn btn-primary w-100"
                    disabled={loading}
                  >
                    {loading
                      ? "Processing..."
                      : showModal === "signup"
                      ? "Signup"
                      : "Login"}
                  </button>
                </form>
              </div>
              <button
                className="btn  mt-3"
                onClick={() =>
                  setShowModal(showModal === "signup" ? "login" : "signup")
                }
              >
                {showModal === "signup" ? "Login" : "Signup"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
