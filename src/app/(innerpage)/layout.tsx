import React from "react";
import Header2 from "../Components/Header/Header2";
import Footer1 from "../Components/Footer/Footer1";

const DefaultLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="main-page-area">
      <Header2></Header2>
      {children}
      <Footer1></Footer1>
    </div>
  );
};

export default DefaultLayout;
