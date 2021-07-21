import React, { useState } from "react";
import PropTypes from "prop-types";
import { useHistory } from "react-router";
import { solo } from "../../utils/axios";
import { errorHandler, USER_TOKEN } from "../../utils/helper";
import Notification from "../../components/notification/Notification";
import "./Login.scss";
import { Button } from "../../components";
import { connect } from "react-redux";
import { actionSetUser } from "../../redux/actions/userAction";

const Login = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [activeState, setActiveState] = useState(0);
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const onFormSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    solo
      .post("/auth/login", { email, password })
      .then((res) => {
        setLoading(false);
        localStorage.setItem(USER_TOKEN, res.data.token);
        props.actionSetUser(res.data.user);
        history.push("/");
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

  return (
    <div className="auth">
      <div className="auth-container">
        <h4>Welcome!</h4>
        <span className="auth-header--details">Please login to proceed.</span>
        <form onSubmit={onFormSubmit} className="form">
          <div className="form-content">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="jack.robinson@bankr.com"
              required
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={errors.email && "invalid"}
              onBlur={(e) => onInputBlur(e)}
            />
          </div>
          <div className="form-content">
            <label>Password</label>
            <input
              type="password"
              required
              name="password"
              value={password}
              placeholder="****"
              onChange={(e) => setPassword(e.target.value)}
              className={errors.password && "invalid"}
              onBlur={(e) => onInputBlur(e)}
            />
          </div>
          <div>
            <Button
              type="submit"
              className="login-btn"
              disabled={email === "" || password === "" || loading}
              loading={loading}
            >
              Log In
            </Button>
          </div>
        </form>
        <div className="auth-footer--text">
          {activeState === 0 ? (
            <p>
              Don't have an account yet?{" "}
              <span onClick={() => setActiveState(1)}>Sign up here!</span>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <span onClick={() => setActiveState(0)}>Login here!</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

Login.propTypes = {};

export default connect(() => ({}), { actionSetUser })(Login);
