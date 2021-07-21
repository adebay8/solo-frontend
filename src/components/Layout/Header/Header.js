import React from "react";
import { connect } from "react-redux";
import { NavLink, withRouter } from "react-router-dom";
import _ from "lodash";
import { actionSetUser } from "../../../redux/actions/userAction";
import { Button, Icon } from "../../index";
import "./Header.scss";
import { USER_TOKEN } from "../../../utils/helper";

const Header = (props) => {
  const logout = (e) => {
    e.preventDefault();
    props.actionSetUser({});
    localStorage.removeItem(USER_TOKEN);
  };

  return (
    <header className="header">
      <div className="header-wrapper dflex justify-between max-width-1500 align-center">
        <div className="brand-logo">
          <NavLink to="/" className="brand">
            SoLo
          </NavLink>
        </div>
        <div className="sidebar-icon">
          <Icon type="fa" name="bars" />
        </div>
        <nav className="header-right dflex align-center">
          <div className="header-links">
            <ul className="dflex">
              {!_.isEmpty(props.activeUser) ? (
                <>
                  <li>
                    <NavLink to="/profile" className="header-link-item">
                      Profile
                    </NavLink>
                  </li>
                  <li>
                    <p
                      className="header-link-item"
                      onClick={(e) => logout(e)}
                      style={{ cursor: "pointer" }}
                    >
                      Logout
                    </p>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <NavLink to="/" className="header-link-item">
                      About Us
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/" className="header-link-item">
                      Features
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/" className="header-link-item">
                      Help
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/login" className="header-link-item">
                      Login
                    </NavLink>
                  </li>
                </>
              )}
            </ul>
          </div>
          <Button
            className="header-action-wrapper"
            onClick={() =>
              props.history.push(
                `${!_.isEmpty(props.activeUser) ? "#" : "/login"}`
              )
            }
          >
            <div className="header-action">
              {!_.isEmpty(props.activeUser)
                ? "Contact Us"
                : "Create free account"}
            </div>
          </Button>
        </nav>
        {/* <div className="sidebar">
          <ul className="dflex flex-column">
            {!_.isEmpty(props.activeUser) ? (
              <>
                <li>
                  <NavLink to="/profile" className="header-link-item">
                    Profile
                  </NavLink>
                </li>
                <li>
                  <p
                    className="header-link-item"
                    onClick={(e) => logout(e)}
                    style={{ cursor: "pointer" }}
                  >
                    Logout
                  </p>
                </li>
              </>
            ) : (
              <>
                <li>
                  <NavLink to="/" className="header-link-item">
                    About Us
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/" className="header-link-item">
                    Features
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/" className="header-link-item">
                    Help
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/login" className="header-link-item">
                    Login
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div> */}
      </div>
    </header>
  );
};

export default withRouter(connect(() => ({}), { actionSetUser })(Header));
