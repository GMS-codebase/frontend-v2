"use client";
import store from "@/store";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { Provider } from "react-redux";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/dropzone/styles.css";
import "@mantine/notifications/styles.css";
import { Next13ProgressBar } from "next13-progressbar";
export default function RootProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <MantineProvider>
      <Provider store={store}>{children}</Provider>
      <Notifications position="top-right"/>
      <Next13ProgressBar
        height="4px"
        color="#005DE9F2"
        options={{ showSpinner: true }}
        showOnShallow
      />
    </MantineProvider>
  );
}
