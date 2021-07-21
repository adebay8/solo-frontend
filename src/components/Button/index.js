import React from "react";
import PropTypes from "prop-types";

import { Spinner } from "../index";

import "./Button.scss";

const Button = (props) => {
  return (
    <button
      style={props.style}
      id={props.id}
      onClick={(e) => {
        e.target = e.currentTarget;
        return props.onClick ? props.onClick(e) : null;
      }}
      onSubmit={props.onSubmit}
      className={`btn ${props.color} ${props.loading && "loading"} ${
        props.block && "block"
      } ${props.className}`}
      disabled={props.disabled}
      type={props.type}
      value={props.value}
      title={props.title}
    >
      <span className={"content"}>
        {props.icon && <span className={"icon-left"}>{props.icon}</span>}
        {props.children}
      </span>
      {props.loading ? (
        <span className={`spinner ${props.color}`}>
          <Spinner />
        </span>
      ) : null}
    </button>
  );
};

Button.propTypes = {
  color: PropTypes.oneOf(["primary", "success", "danger", "default"]),
  onClick: PropTypes.func,
  onSubmit: PropTypes.func,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  style: PropTypes.object,
  block: PropTypes.bool,
  icon: PropTypes.node,
  className: PropTypes.string,
  type: PropTypes.string,
};

Button.defaultProps = {
  color: "primary",
  loading: false,
  disabled: false,
  onClick: null,
  onSubmit: null,
  style: {},
  className: "",
  type: "button",
};

export default Button;
