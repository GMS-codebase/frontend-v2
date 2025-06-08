"use client";
import React, { useEffect, useState } from "react";
import { Card, Text, Stack, Group, Button } from "@mantine/core";
import { useRouter } from "next13-progressbar";

type Survey = {
  id: number;
  title: string;
  description: string;
  status: string;
};

export default function TraineeSurveys() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [surveys, setSurveys] = useState<Survey[]>([]);

  useEffect(() => {
    const initializeSurveys = async () => {
      const traineeData = localStorage.getItem("traineeData");

      if (!traineeData) {
        router.replace("/");
        return;
      }

      try {
        const parsedData = JSON.parse(traineeData);

        if (!parsedData.isAuthenticated || parsedData.role !== "TRAINEE") {
          router.replace("/");
          return;
        }

        // TODO: Fetch surveys from API
        // For now, using dummy data
        setSurveys([
          {
            id: 1,
            title: "Training Feedback Survey",
            description: "Share your thoughts about the training program",
            status: "pending",
          },
        ]);

        setIsLoading(false);
      } catch (error) {
        console.error("Error initializing surveys:", error);
        router.replace("/");
      }
    };

    initializeSurveys();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Text size="xl" fw={500} mb={10}>
            Loading Surveys...
          </Text>
          <Text size="sm" c="dimmed">
            Please wait while we fetch your surveys
          </Text>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Text size="xl" fw={700} mb={24}>
        Available Surveys
      </Text>

      <Stack gap="md">
        {surveys.map((survey) => (
          <Card key={survey.id} shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between" align="flex-start">
              <Stack gap={4}>
                <Text size="lg" fw={500}>
                  {survey.title}
                </Text>
                <Text size="sm" c="dimmed">
                  {survey.description}
                </Text>
              </Stack>
              <Button
                variant="filled"
                color={survey.status === "pending" ? "blue" : "green"}
              >
                {survey.status === "pending" ? "Take Survey" : "View Results"}
              </Button>
            </Group>
          </Card>
        ))}

        {surveys.length === 0 && (
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Text c="dimmed" ta="center">
              No surveys available at the moment
            </Text>
          </Card>
        )}
      </Stack>
    </div>
  );
}
