import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";

export default function RootProvider({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <MantineProvider>
        {children}
        <Notifications/>
      </MantineProvider>
    );
}