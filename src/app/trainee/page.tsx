"use client";
import React, { useEffect, useState } from "react";
import { Card, Grid, Text, Group, Stack } from "@mantine/core";
import { SolarPaperclipRounded2Bold } from "@/components/core/icons";
import { useRouter } from "next13-progressbar";

export default function TraineeDashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeDashboard = async () => {
      console.log("TraineeDashboard: Initializing...");

      // Get stored trainee data
      const traineeData = localStorage.getItem("traineeData");
      console.log("TraineeDashboard: Retrieved data:", traineeData);

      if (!traineeData) {
        console.log("TraineeDashboard: No data found, redirecting...");
        router.replace("/");
        return;
      }

      try {
        const parsedData = JSON.parse(traineeData);
        console.log("TraineeDashboard: Parsed data:", parsedData);

        if (!parsedData.isAuthenticated || parsedData.role !== "TRAINEE") {
          console.log("TraineeDashboard: Invalid data, redirecting...");
          router.replace("/");
          return;
        }

        // If we get here, we're authenticated
        console.log("TraineeDashboard: Authentication successful");
        setIsLoading(false);
      } catch (error) {
        console.error("TraineeDashboard: Error parsing data:", error);
        router.replace("/");
      }
    };

    initializeDashboard();
  }, [router]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Text size="xl" fw={500} mb={10}>
            Loading Dashboard...
          </Text>
          <Text size="sm" c="dimmed">
            Please wait while we prepare your dashboard
          </Text>
        </div>
      </div>
    );
  }

  // Main dashboard content
  return (
    <div className="p-6">
      <Text size="xl" fw={700} mb={24}>
        Welcome to Your Training Dashboard
      </Text>

      <Grid>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Card
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => router.push("/trainee/surveys")}
          >
            <Group>
              <SolarPaperclipRounded2Bold className="w-8 h-8" />
              <Stack gap={0}>
                <Text size="lg" fw={500}>
                  Survey
                </Text>
                <Text size="sm" c="dimmed">
                  Access and complete surveys
                </Text>
              </Stack>
            </Group>
          </Card>
        </Grid.Col>
      </Grid>
    </div>
  );
}
