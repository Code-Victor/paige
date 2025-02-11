import React, { Suspense, lazy, useEffect } from "react";
import { Box, Flex, Grid } from "@components/base";

import {
  Time,
  Mantra,
  Reminder,
  Search,
  PinnedSites,
} from "@components/inc/widgets";

import { TopBar, BottomBar } from "@components/inc";
import Portal from "@utils/Portals";
import useStore from "@store";
import { spawnTodoNotification } from "@utils";

const SideBar = lazy(() => import("./SideBar"));

const MainLayout = () => {
  const todos = useStore((store) => store.todos);
  const toggleReminded = useStore((store) => store.toggleReminded);
  const reminders = todos.flatMap((t) => (t.reminder ? [t] : []));

  useEffect(() => {
    const timeouts: NodeJS.Timeout[] = [];
    reminders.forEach((r) => {
      if (r.reminded) {
        return;
      }
      const time = new Date(r.date);
      if (time.getTime() < Date.now()) {
        spawnTodoNotification(r.id, r.text, "Todo Reminder");
        toggleReminded(r.id);
        return;
      }
      const timeout = setTimeout(() => {
        spawnTodoNotification(r.id, r.text, "Todo Reminder");
        toggleReminded(r.id);
      }, time.getTime() - Date.now());
      timeouts.push(timeout);
    });
    return () => {
      timeouts.forEach((t) => clearTimeout(t));
    };
  }, [reminders]);
  return (
    <Grid
      css={{
        height: "100vh",
        gridTemplateRows: "1fr auto",
        overflow: "hidden",
      }}
    >
      <Portal root="side_bar_root">
        <Suspense fallback={<Box />}>
          <SideBar />
        </Suspense>
      </Portal>
      <TopBar />
      <Grid
        ai="center"
        as="main"
        css={{
          flex: 1,
          overflow: "hidden",
          gridTemplateRows: "2fr 1fr 2fr",
        }}
      >
        <Flex ai="center" jc="center">
          <Time />
        </Flex>
        <Search />
        <PinnedSites />
        <Flex
          ai="center"
          fd="column"
          css={{
            pt: "$4",
            height: "100%",
            "&>*": {
              flex: 1,
            },
          }}
          gap={{ "@initial": 3, "@lg": 6 }}
        >
          <Mantra />
          <Reminder />
        </Flex>
      </Grid>
      <BottomBar />
    </Grid>
  );
};

export default MainLayout;
