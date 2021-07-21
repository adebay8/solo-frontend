import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import Axios from "axios";
import _ from "lodash";
import Tesseract from "tesseract.js";

import placeholderImage from "../../assets/images/placeholder.jpg";
import { Button, Icon, Modal, Spinner } from "../../components";
import "./Profile.scss";
import { solo } from "../../utils/axios";
import { connect } from "react-redux";
import { useHistory } from "react-router";
import { errorHandler, USER_TOKEN } from "../../utils/helper";
import Notification from "../../components/notification/Notification";

const Profile = (props) => {
  const history = useHistory();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [modalStatus, setModalStatus] = useState(false);
  const [modalState, setModalState] = useState(0);
  const [idType, setIDType] = useState("");
  const [imageCaptured, setImageCaptured] = useState(false);
  const [idImage, setIDImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [imagePath, setImagePath] = useState("");
  const [text, setText] = useState("");
  const [score, setScore] = useState("");

  useEffect(() => {
    const supported = "mediaDevices" in navigator;

    if (!imageCaptured && supported) {
      navigator.mediaDevices
        .getUserMedia({ video: modalState === 1 && true })
        .then(function (stream) {
          videoRef.current.srcObject = stream;
        })
        .catch(function (error) {
          Notification.bubble({
            type: "error",
            content: "Something went wrong while accessing camera!",
          });
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
      file = await new File([blob], `id.png`, { type: "image/png" });
      let filePath = URL.createObjectURL(file);
      setImagePath(filePath);
      verifyDocument(filePath);
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
    }).then((res) => setIDImage(res.data.url));
  };

  const submitDocument = (e) => {
    e.preventDefault();
    solo
      .post("/user/identification", {
        userId: props.user.id,
        idType,
        document: idImage,
      })
      .then((res) => {
        setLoading(false);
        history.push("/profile");
        setModalState(2);
      })
      .catch((error) => {
        Notification.bubble({ type: "error", content: errorHandler(error) });
        setLoading(false);
      });
  };

  const verifyDocument = (data) => {
    Tesseract.recognize(imagePath, "eng", {
      logger: (m) => console.log(m),
    })
      .catch((err) => {
        console.error(err);
      })
      .then((result) => {
        // Get Confidence score
        let confidence = result.confidence;
        setScore(confidence);
        let text = result.text;
        setText(text);
      });
  };

  return (
    _.size(props.user) > 0 && (
      <div className="profile">
        <div className="user-image__wrapper">
          <img src={placeholderImage} alt="user" className="user-image" />
          <div className="dflex align-center user-name">
            <p>
              {props.user.firstName} {props.user.lastName}
            </p>
            <Icon name="checkCircleO" type="fa" style={{ color: "green" }} />
          </div>
        </div>
        <section>
          <h3>User Information</h3>
          <div className="dflex align-center justify-between flex-wrap user-details">
            <div>
              <h4>Email Address</h4>
              <p>{props.user.email}</p>
            </div>
            <div>
              <h4>Address</h4>
              <p>{`${props.user.address}, ${props.user.city}, ${props.user.state}`}</p>
            </div>
            <div>
              <h4>Phone Number</h4>
              <p>{props.user.phoneNumber}</p>
            </div>
          </div>
        </section>
        <section>
          <h3>Identity Verification</h3>
          <p>
            You are yet to verify your identity. Please click the button below
            to start your verification process
          </p>
          <Button onClick={() => setModalStatus(true)}>Verfify Identify</Button>
        </section>
        <br /> <br />
        <Modal visible={modalStatus} onClose={() => setModalStatus(false)}>
          {modalState === 0 && (
            <div>
              <h4>Identity Verification</h4>
              <p>Please select your preferred means of identification</p>
              <div>
                <ul>
                  <li
                    className="dflex justify-between align-center"
                    onClick={() => {
                      setModalState(1);
                      setIDType("Drivers' License");
                    }}
                  >
                    <span>Drivers' License</span>
                    <Icon type="fa" name="chevronRight" />
                  </li>
                  <li
                    className="dflex justify-between align-center"
                    onClick={() => {
                      setModalState(1);
                      setIDType("International Passport");
                    }}
                  >
                    <span>International Passport</span>
                    <Icon type="fa" name="chevronRight" />
                  </li>
                  <li
                    className="dflex justify-between align-center"
                    onClick={() => {
                      setModalState(1);
                      setIDType("Voters' Card");
                    }}
                  >
                    <span>Voters' Card</span>
                    <Icon type="fa" name="chevronRight" />
                  </li>
                </ul>
              </div>
            </div>
          )}
          {modalState === 1 && (
            <div>
              <h4>Capture {idType}</h4>
              <div className="id-image__wrapper">
                <video
                  autoPlay={true}
                  id="videoElement"
                  className={`id-image ${imageCaptured ? "" : "active"}`}
                  ref={videoRef}
                ></video>
                <canvas
                  id="canvas"
                  width={320}
                  height={240}
                  ref={canvasRef}
                  className={`id-image ${imageCaptured ? "active" : ""}`}
                />
              </div>
              {!imageCaptured && (
                <Button
                  className="btn-outline"
                  onClick={captureImage}
                  style={{ margin: "0 auto" }}
                >
                  Capture Image
                </Button>
              )}
              <br />
              <div className="dflex align-center justify-center">
                {imageCaptured && (
                  <Button
                    className="btn-outline"
                    onClick={() => setImageCaptured(false)}
                    style={{ marginRight: "10px" }}
                  >
                    Retake Image
                  </Button>
                )}
                <Button
                  type="submit"
                  className={`login-btn `}
                  disabled={idImage === "" || loading || !imageCaptured}
                  loading={loading}
                  onClick={submitDocument}
                >
                  Verify
                </Button>
              </div>
            </div>
          )}
          {modalState === 2 && (
            <div>
              <h4>Verification result</h4>
              <div className="dflex align-center flex-column">
                <Spinner color="red" size={20} />
                <p>In progress</p>
              </div>
            </div>
          )}
        </Modal>
      </div>
    )
  );
};

Profile.propTypes = {};

export default connect((state) => ({
  user: state.user,
}))(Profile);
