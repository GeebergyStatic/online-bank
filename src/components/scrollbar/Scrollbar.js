import { Box } from "@chakra-ui/react";

import React from "react";

export const renderTrack = ({ style, ...props }) => {
  return <div style={{ ...style, display: "none" }} {...props} />;
};

export const renderThumb = ({ style, ...props }) => {
  // This is now unused if track is hidden, but still here for fallback
  return <div style={{ ...style, display: "none" }} {...props} />;
};

export const renderView = ({ style, ...props }) => {
  return (
    <Box
      me={{ base: "0px !important", lg: "0px !important" }}
      style={{
        ...style,
        marginRight: 0,
        marginBottom: 0,
        overflow: "hidden",
      }}
      {...props}
    />
  );
};
