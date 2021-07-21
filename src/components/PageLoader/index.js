import React from "react";
import { useLoading, Grid } from "@agney/react-loading";

const PageLoader = () => {
  const { containerProps, indicatorEl } = useLoading({
    loading: true,
    indicator: <Grid width="50" />,
  });

  return (
    <section
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        color: "#FCBE24",
      }}
      {...containerProps}
    >
      {indicatorEl}
    </section>
  );
};

export default PageLoader;
