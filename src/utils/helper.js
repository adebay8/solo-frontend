export const USER_TOKEN = "solofund_token";
export const USER_DATA = "solofund_user_data";

export const errorHandler = (err, defaulted = false) => {
  if (defaulted) {
    return "Oops!, an error occurred.";
  }

  let messageString = "";
  if (!err.response) {
    messageString += "Network error! check your network and try again";
  } else {
    let data = err.response.data.message;
    if (!err.response.data.message) {
      data = err.response.data;
      messageString = loopObj(data);
    } else {
      messageString = data;
    }
  }
  return messageString.replace(/{|}|'|\[|\]/g, "");
};

const loopObj = (obj) => {
  let agg = "";
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      agg += `<div>${key}: ${
        typeof obj[key] === "object" ? loopObj(obj[key]) : obj[key]
      }</div>`;
    }
  }
  return agg;
};

export const randomIDGenerator = (length) => {
  let text = "";
  let possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
};

export const getNewProps = (props, defaultPropList) => {
  let newProps = { ...props };

  for (let key in defaultPropList) {
    if (newProps.hasOwnProperty(key) || newProps.hasOwnProperty("isError")) {
      delete newProps[key.toString()];
    }
  }
  return newProps;
};

export const getToken = (_) => {
  let tokenObj = localStorage.getItem(USER_TOKEN);
  if (tokenObj) {
    return tokenObj;
  }
  return null;
};
