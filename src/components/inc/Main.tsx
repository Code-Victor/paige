import React, { useState } from "react";
import { Flex, Grid, Text } from "@components/base";
import {
  Time,
  Search,
  Mantra,
  Remainder,
  SideBar,
  HoverToReveal,
} from "@components/inc";
import { styled } from "stitches.config";
import { Hamburger, Todo } from "@components/icons";
import Portal from "@utils/Portals";
import useStore from "@store";
import { Photos } from "src/store/imageSlice";

const Main = () => {
  const [open, setOpen] = useState(false);
  const photos = useStore((state) => state.photos);
  const today = new Date().toDateString();
  const todayImage =
    photos.filter((photo) => new Date(photo.for).toDateString() === today)[0] ||
    photos[1];
  return (
    <Flex
      fd="column"
      css={{
        minHeight: "100vh",
        background: `url(${todayImage.urls.raw}&w=2048&q=80&auto=format),${todayImage?.color}`,
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      <Portal root="side_bar_root">
        <SideBar open={open} onClose={() => setOpen(false)} />
      </Portal>
      <TopBar setOpen={() => setOpen(true)} />
      <Grid
        ai="center"
        as="main"
        css={{
          flex: 1,
          gridTemplateRows: "1fr 1fr",
          "&>*": {
            height: "100%",
          },
        }}
      >
        <Flex ai="center" jc="between" fd="column" css={{ pb: "$5" }}>
          <Time />
          <Search />
        </Flex>
        <Flex ai="center" fd="column" jc="end" gap={6}>
          <Mantra />
          <Remainder />
        </Flex>
      </Grid>
      <BottomBar todayImage={todayImage} />
    </Flex>
  );
};

const IconButton = styled("button", {
  appearance: "none",
  outline: "none",
  border: "none",
  display: "flex",
  ai: "center",
  jc: "center",
  size: 50,
  bg: "rgba(0, 0, 0, 0.2)",
  br: "$round",
});
const TopBar = ({ setOpen }: { setOpen: () => void }) => {
  return (
    <Flex jc="between" ai="center" css={{ height: "8vh", px: "$6" }}>
      <IconButton onClick={setOpen}>
        <Hamburger />
      </IconButton>
    </Flex>
  );
};

const BottomBar = ({ todayImage }: { todayImage: Photos }) => {
  return (
    <Flex
      jc="between"
      ai="center"
      css={{
        height: "8vh",
        px: "$6",
        color: "$text",
        width: "100%",
        "& .fixed": {
          width: "10vw",
          minWidth: 200,
        },
      }}
    >
      <HoverToReveal
        link
        heading={{
          text: todayImage.description ?? "",
          link: todayImage.links.html ?? "",
        }}
        subscript={{
          text: todayImage.user.username ?? "",
          link: todayImage.user.links.self ?? "",
        }}
        ai="start"
        className="fixed"
      />
      <HoverToReveal
        heading="“Think lightly of yourself and deeply of the world.”"
        subscript="Miyamoto Musashi"
      />
      <Flex ai="center" jc="end" gap={2} className="fixed">
        <Todo />
        <Text>Todo</Text>
      </Flex>
    </Flex>
  );
};

export default Main;
