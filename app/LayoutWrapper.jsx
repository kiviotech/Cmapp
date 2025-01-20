import React from "react";
import Layout from "./_layout";
import useAuthStore from "../useAuthStore";

const LayoutWrapper = () => {
  const { user, designation } = useAuthStore((state) => ({
    user: state.user,
    designation: state.designation,
  }));

  return <Layout user={user} designation={designation} />;
};

export default LayoutWrapper;
