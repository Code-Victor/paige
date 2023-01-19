import React from "react";
import useStore from "@store";
import { Box } from "@components/base";
import { imageQuality } from "@constants";
import { BlurhashCanvas } from "react-blurhash";
import { css } from "stitches.config";
import { getTodayImage } from "@utils";

const scaffoldCSS = css({
  position: "absolute",
  inset: 0,
  overflow: "hidden",
});
const Scaffold = () => {
  const photos = useStore((state) => state.photos);
  const todayImage = getTodayImage(photos);
  return (
    <>
      <Box
        css={{
          background: `url(${todayImage?.urls?.raw + imageQuality})`,
          zIndex: -1,
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
        className={"scaffold " + scaffoldCSS()}
      ></Box>
      <Box
        className={scaffoldCSS()}
        css={{
          zIndex: -2,
        }}
      >
        {todayImage?.blur_hash && (
          <BlurhashCanvas
            hash={todayImage.blur_hash}
            style={{ height: "100%", width: "100%" }}
            punch={1}
          />
        )}
      </Box>
    </>
  );
};

export default Scaffold;
