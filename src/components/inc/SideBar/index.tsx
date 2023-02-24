import React, { useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { AnimatePresence, motion } from "framer-motion";
import { styled } from "stitches.config";
import GeneralTab from "./GeneralTab";
import ThemesTab from "./ThemesTab";
import useStore from "@store";
import { ScrollArea } from "@components/inc";
import { IconButton, Box, Flex } from "@components/base";
import { Hamburger } from "@components/icons";

const TabRoot = styled(Tabs.Root, {});
const TabList = styled(Tabs.List, {
  bg: "$bg",
  pt: "$9",
  px: "$4",
  gridArea: "tablist",
});
const TabTrigger = styled(Tabs.Trigger);
const TabContent = styled(Tabs.Content, {
  gridArea: "tabcontent",
  bg: "rgba($bgRGB,0.25)",
  backdropFilter: "blur(50px)",
  px: "$5",
  color: "$text",
});

const MotionContainer = styled(motion.div, {
  height: "100vh",
  width: "50vw",
  maxWidth: 600,
  minWidth: "200px",
  display: "grid",
  gridTemplateAreas: "'tablist tabcontent'",
  gridTemplateColumns: "minmax(150px,180px) minmax(300px,1fr)",
  position: "fixed",
  zIndex: "$max",
  top: 0,
  left: 0,
});

const SideBarOverlay = styled(motion.div, {
  position: "fixed",
  inset: 0,
  bg: "rgba(0,0,0,0.25)",
});

const MenuButton = styled("button", {
  $$position: "left",
  appearance: "none",
  bg: "transparent",
  border: "none",
  color: "$text",
  width: "100%",
  py: "$2",
  px: "$2",
  br: "$2",
  position: "relative",
  textAlign: "$$position",
  variants: {
    position: {
      left: {
        $$position: "left",
      },
      right: {
        $$position: "right",
      },
    },
  },
});
const MenuBg = styled(motion.div, {
  $$opacity: 0.2,

  br: "$2",
  backgroundColor: "rgb($textRGB ,0.2)",
  position: "absolute",
  zIndex: -1,
  // opacity: "0.2",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  "&::after": {
    content: "''",
    position: "absolute",
    left: "$$left",
    right: "$$right",
    opacity: 1,
    bg: "$text",
    top: "50%",
    height: "80%",
    br: "$pill",
    transform: "translateY(-50%)",
    width: 2,
  },
  variants: {
    position: {
      left: {
        $$right: "4px",
      },
      right: {
        $$left: "4px",
      },
    },
  },
});
const SideBar = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [sideBarOpen, setSideBarOpen, sideBarPosition] = useStore((state) => [
    state.sideBarOpen,
    state.setSideBarOpen,
    state.sideBarPosition,
  ]);

  let motionProps;
  if (sideBarPosition === "left") {
    motionProps = {
      initial: { x: "-100%" },
      exit: { x: "-100%" },
    };
  } else if (sideBarPosition === "right") {
    motionProps = {
      initial: { x: "100%" },
      exit: { x: "100%" },
      css: {
        left: "auto",
        right: 0,
        flexDirection: "row-reverse",
        gridTemplateAreas: "'tabcontent tablist'",
        gridTemplateColumns: "minmax(260px,1fr) minmax(180px,200px) ",
      },
    };
  }
  return (
    <AnimatePresence>
      {sideBarOpen && (
        <>
          <SideBarOverlay
            onClick={() => setSideBarOpen(false)}
            initial={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          />
          <TabRoot
            value={activeTab}
            onValueChange={(value) => setActiveTab(value)}
            asChild
          >
            <MotionContainer
              animate={{ x: 0 }}
              transition={{ type: "tween" }}
              {...motionProps}
            >
              <TabList
                css={{
                  zIndex: "calc($max - 1)",
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                {["General", "Themes"].map((item) => (
                  <TabTrigger key={item} value={item.toLowerCase()} asChild>
                    <MenuButton position={sideBarPosition}>
                      {item}
                      {item.toLowerCase() === activeTab && (
                        <MenuBg position={sideBarPosition} layoutId="btn-bg" />
                      )}
                    </MenuButton>
                  </TabTrigger>
                ))}
                <Flex
                  jc="center"
                  ai="end"
                  css={{
                    flexGrow: 1,
                    pb: "$4",
                  }}
                  id="nav-links"
                >
                  <IconButton
                    onClick={() => setSideBarOpen(false)}
                    size="md"
                    bg="bgLight"
                    css={{
                      boxShadow: "0 0 0 1px $colors$text",
                    }}
                  >
                    <Hamburger
                      css={{
                        transform: "rotate(-180deg)",
                        color: "$text",
                      }}
                    />
                  </IconButton>
                </Flex>
              </TabList>
              <TabContent
                value="general"
                css={{
                  zIndex: "calc($max - 2)",
                  height: "100%",
                  overflow: "hidden",
                }}
              >
                <ScrollArea
                  css={{
                    height: "100%",
                  }}
                >
                  <GeneralTab />
                </ScrollArea>
              </TabContent>
              <TabContent
                value="themes"
                css={{
                  zIndex: "calc($max - 2)",
                  height: "100%",
                  overflow: "hidden",
                  "& >*": {
                    maxWidth: "100%",
                  },
                  "& > div > [data-radix-scroll-area-viewport]:first-of-type > div  ":
                    {
                      display: "unset !important",
                      // border: "1px solid black",
                    },
                }}
              >
                <ScrollArea
                  css={{
                    height: "100%",
                  }}
                >
                  <ThemesTab />
                </ScrollArea>
              </TabContent>
            </MotionContainer>
          </TabRoot>
        </>
      )}
    </AnimatePresence>
  );
};

export default SideBar;
