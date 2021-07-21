import React from "react";
import Header from "./Header/Header";
import Footer from "./Footer/Footer";
import { connect } from "react-redux";

const MainLayout = ({ children, user }) => {
  return (
    <div>
      <Header activeUser={user} />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.user,
});

export default connect(mapStateToProps)(MainLayout);
