import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { useHistory } from "react-router";
import PasswordStrengthBar from "react-password-strength-bar";
import { connect } from "react-redux";

import { actionSetUser } from "../../redux/actions/userAction";
import { solo } from "../../utils/axios";
import { Button, Icon, Required } from "../../components";
import "./Signup.scss";
import { errorHandler, USER_TOKEN } from "../../utils/helper";
import Notification from "../../components/notification/Notification";
import Axios from "axios";

const Signup = (props) => {
  const history = useHistory();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [userDetails, setUserDetails] = useState({
    password: "",
    email: "",
    firstName: "",
    lastName: "",
    otherNames: "",
  });
  const [address, setAddress] = useState({
    address: "",
    city: "",
    state: "",
    country: "",
  });
  const [phoneNumber, setPhoneNumber] = useState("");
  const [errors, setErrors] = useState({});
  const [activeState, setActiveState] = useState(2);
  const [imageCaptured, setImageCaptured] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profilePicture, setProfilePicture] = useState("");

  const onDetailsChange = (e) => {
    e.preventDefault();
    setUserDetails((details) => ({
      ...details,
      [e.target.name]: e.target.value,
    }));
  };

  const onAddressChange = (e) => {
    e.preventDefault();
    setAddress((address) => ({ ...address, [e.target.name]: e.target.value }));
  };

  const submitForm = (e) => {
    e.preventDefault();
    setLoading(true);
    solo
      .post("/auth/signup", { ...userDetails, ...address, profilePicture })
      .then((res) => {
        setLoading(false);
        localStorage.setItem(USER_TOKEN, res.data.token);
        props.actionSetUser(res.data.user);
        history.push("/profile");
      })
      .catch((error) => {
        Notification.bubble({ type: "error", content: errorHandler(error) });
        setLoading(false);
      });
  };

  const onInputBlur = (e) => {
    const { name, value } = e.target;
    if (value === "") {
      setErrors({ ...errors, [name]: true });
    } else {
      setErrors({ ...errors, [name]: false });
    }
  };

  const formIncomplete = () => {
    let status = false;
    switch (activeState) {
      case 0:
        for (let x in userDetails) {
          if (userDetails[x] !== "otherNames") {
            if (userDetails[x] === "") status = true;
          }
        }
        break;
      case 1:
        for (let x in address) {
          if (address[x] === "") status = true;
        }
        break;
      default:
        return status;
    }
    return status;
  };

  useEffect(() => {
    const supported = "mediaDevices" in navigator;

    if (!imageCaptured && supported) {
      navigator.mediaDevices
        .getUserMedia({ video: activeState === 2 && true })
        .then(function (stream) {
          videoRef.current.srcObject = stream;
        })
        .catch(function (error) {
          console.log("Something went wrong while accessing camera!");
        });
    }
  }, [imageCaptured]);

  const captureImage = (e) => {
    e.preventDefault();
    const context = canvasRef.current.getContext("2d");
    context.drawImage(
      videoRef.current,
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
    videoRef.current.srcObject
      .getVideoTracks()
      .forEach((track) => track.stop());
    videoRef.current.srcObject = null;
    setImageCaptured(true);
    let file = null;
    let blob = canvasRef.current.toBlob(async (blob) => {
      file = await new File(
        [blob],
        `${userDetails.firstName}-asda${userDetails.lastName}.png`,
        { type: "image/png" }
      );
      uploadFile(file);
    }, "image/png");
  };

  const uploadFile = (filedata) => {
    let fileUpload = new FormData();
    fileUpload.append("file", filedata);
    Axios({
      method: "post",
      url: "http://localhost:5000/user/file-upload",
      data: fileUpload,
    }).then((res) => setProfilePicture(res.data.url));
  };

  return (
    <div className="auth">
      <div className="auth-container">
        {activeState !== 0 && (
          <div onClick={() => setActiveState((activeState) => activeState - 1)}>
            <Icon
              name="chevronLeft"
              type="feather"
              size="20"
              style={{ cursor: "pointer" }}
            />
          </div>
        )}
        <h4>Sign up</h4>
        <span className="auth-header--details">
          {activeState !== 2
            ? "Please enter your details to get started"
            : "Please ensure you are in good lighting"}
        </span>
        <div className="form">
          {activeState === 0 && (
            <>
              <div className="form-content">
                <label>
                  Email Address
                  <Required />
                </label>
                <input
                  type="email"
                  placeholder="cironma.adekunle@solofunds.com"
                  required
                  name="email"
                  value={userDetails.email}
                  onChange={onDetailsChange}
                  className={errors.email && "invalid"}
                  onBlur={(e) => onInputBlur(e)}
                />
              </div>
              <div className="form-content">
                <label>
                  Last Name
                  <Required />
                </label>
                <input
                  type="text"
                  placeholder="Cironma"
                  required
                  name="lastName"
                  value={userDetails.lastName}
                  onChange={onDetailsChange}
                  className={errors.lastName && "invalid"}
                  onBlur={(e) => onInputBlur(e)}
                />
              </div>
              <div className="form-content">
                <label>
                  First Name
                  <Required />
                </label>
                <input
                  type="text"
                  placeholder="Chukwuma"
                  required
                  name="firstName"
                  value={userDetails.firstName}
                  onChange={onDetailsChange}
                  className={errors.firstName && "invalid"}
                  onBlur={(e) => onInputBlur(e)}
                />
              </div>
              <div className="form-content">
                <label>Other Names</label>
                <input
                  type="text"
                  placeholder="Adekunle"
                  name="otherNames"
                  value={userDetails.otherNames}
                  onChange={onDetailsChange}
                />
              </div>
              <div className="form-content">
                <label>
                  Password
                  <Required />
                </label>
                <input
                  type="password"
                  required
                  name="password"
                  value={userDetails.password}
                  placeholder="****"
                  onChange={onDetailsChange}
                  className={errors.password && "invalid"}
                  onBlur={(e) => onInputBlur(e)}
                />
                <PasswordStrengthBar
                  password={userDetails.password}
                  minLength={6}
                />
              </div>
            </>
          )}
          {activeState === 1 && (
            <>
              <div className="dflex align-center justify-between">
                <div className="form-content">
                  <label>
                    Address
                    <Required />
                  </label>
                  <input
                    type="email"
                    placeholder="365 Herbert Macaulay"
                    required
                    name="address"
                    value={address.address}
                    onChange={onAddressChange}
                    className={errors.address && "invalid"}
                    onBlur={(e) => onInputBlur(e)}
                  />
                </div>
                <div className="form-content mb-4">
                  <label>
                    City
                    <Required />
                  </label>
                  <input
                    type="text"
                    placeholder="Yaba"
                    required
                    name="city"
                    value={address.city}
                    onChange={onAddressChange}
                    className={errors.city && "invalid"}
                    onBlur={(e) => onInputBlur(e)}
                  />
                </div>
              </div>
              <div className="dflex align-center justify-between">
                <div className="form-content">
                  <label>
                    State
                    <Required />
                  </label>
                  <input
                    type="text"
                    placeholder="Chukwuma"
                    required
                    name="state"
                    value={address.state}
                    onChange={onAddressChange}
                    className={errors.state && "invalid"}
                    onBlur={(e) => onInputBlur(e)}
                  />
                </div>
                <div className="form-content mb-4">
                  <label>
                    Country
                    <Required />
                  </label>
                  <input
                    type="text"
                    placeholder="Nigeria"
                    required
                    name="country"
                    value={address.country}
                    onChange={onAddressChange}
                    className={errors.country && "invalid"}
                    onBlur={(e) => onInputBlur(e)}
                  />
                </div>
              </div>
              <div className="form-content mb-4">
                <label>
                  Phone Number
                  <Required />
                </label>
                <input
                  type="text"
                  placeholder="+2348012345678"
                  required
                  name="phoneNumber"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className={errors.country && "invalid"}
                  onBlur={(e) => onInputBlur(e)}
                />
              </div>
            </>
          )}
          {activeState === 2 && (
            <>
              <div className="user-image__wrapper">
                <video
                  autoplay="true"
                  id="videoElement"
                  className={`user-image ${imageCaptured ? "" : "active"}`}
                  ref={videoRef}
                ></video>
                <canvas
                  id="canvas"
                  width={320}
                  height={240}
                  ref={canvasRef}
                  className={`user-image ${imageCaptured ? "active" : ""}`}
                />
              </div>

              {!imageCaptured && (
                <Button className="btn-outline" onClick={captureImage}>
                  Capture Image
                </Button>
              )}
            </>
          )}
          <div className="dflex align-center justify-between">
            {imageCaptured && (
              <Button
                className="btn-outline"
                onClick={() => setImageCaptured(false)}
              >
                Retake Image
              </Button>
            )}
            <Button
              type="submit"
              className={`login-btn ${activeState !== 2 ? "mr-0" : ""}`}
              disabled={
                formIncomplete() ||
                (activeState === 2 && !imageCaptured) ||
                loading
              }
              loading={loading}
              onClick={
                activeState !== 2
                  ? () => setActiveState((activeState) => activeState + 1)
                  : (e) => submitForm(e)
              }
            >
              {activeState !== 2 ? "Next" : "Create Account"}
            </Button>
          </div>
        </div>
        <div className="auth-footer--text">
          <p>
            Already have an account?
            <span onClick={() => setActiveState(0)}>Login here!</span>
          </p>
        </div>
      </div>
    </div>
  );
};

Signup.propTypes = {};

export default connect(() => ({}), actionSetUser)(Signup);
