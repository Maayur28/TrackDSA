import React from "react";
import { Segmented } from "antd";
import "./account.css";
import Profile from "./Profile/profile";
import { useState } from "react";
import Password from "./Password/password";

const Account = () => {
  const [segmentValue, setSegmentValue] = useState(
    localStorage.getItem("accountSegment") === undefined
      ? "Profile"
      : localStorage.getItem("accountSegment")
  );

  const onChange = (value) => {
    setSegmentValue(value);
    localStorage.setItem("accountSegment", value);
  };

  return (
    <div className="account_component">
      <Segmented
        block
        onChange={onChange}
        options={["Profile", "Password"]}
        defaultValue={segmentValue}
      />
      <div className="account_body">
        {segmentValue === "Profile" ? (
          <Profile />
        ) : segmentValue === "Password" ? (
          <Password />
        ) : null}
      </div>
    </div>
  );
};

export default Account;
