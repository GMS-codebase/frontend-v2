
"use client"
import store from "@/store";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { Provider } from "react-redux";
export default function RootProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <MantineProvider>
      <Provider store={store}>
        {children}
      </Provider>
      <Notifications />
    </MantineProvider>
  );
}
