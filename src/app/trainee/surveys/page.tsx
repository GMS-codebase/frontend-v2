"use client";
import React, { useEffect, useState } from "react";
import { Card, Text, Stack, Group, Button } from "@mantine/core";
import { useRouter } from "next13-progressbar";
import { unauthorizedApi } from "@/utils/api";
import { setCookie } from "cookies-next";

type Survey = {
  id: number;
  name: string;
  qns: string;
  expiry_date: string;
  survey_status: string;
  created_at: string;
  updated_at: string;
  survey_TYPE: string;
  hasSurvey_Started: boolean;
  surveyStartingTime: string | null;
};

export default function TraineeSurveys() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [surveys, setSurveys] = useState<Survey[]>([]);

  useEffect(() => {
    let isMounted = true;

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

        // Set the token in cookies for the API
        if (parsedData.token) {
          setCookie("token", parsedData.token);
        }

        // Fetch surveys from API with trainee email
        const response = await unauthorizedApi.get("/survey/get-all-survey", {
          params: {
            email: parsedData.email,
          },
        });

        // Filter surveys to only show TRAINEESURVEY type
        const traineeSurveys = response.data.filter(
          (survey: Survey) =>
            survey.survey_TYPE.toUpperCase() === "TRAINEESURVEY"
        );

        if (isMounted) {
          setSurveys(traineeSurveys);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error fetching surveys:", error);
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initializeSurveys();

    return () => {
      isMounted = false;
    };
  }, []); // Empty dependency array since we only want to fetch once on mount

  const getSurveyStatusColor = (status: string) => {
    switch (status) {
      case "ONGOING":
        return "blue";
      case "ENDED":
        return "gray";
      case "DRAFT":
        return "yellow";
      default:
        return "blue";
    }
  };

  const getSurveyStatusText = (status: string) => {
    switch (status) {
      case "ONGOING":
        return "Take Survey";
      case "ENDED":
        return "View Results";
      case "DRAFT":
        return "Coming Soon";
      default:
        return "Take Survey";
    }
  };

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
                  {survey.name}
                </Text>
                <Text size="sm" c="dimmed">
                  Expires: {new Date(survey.expiry_date).toLocaleDateString()}
                </Text>
                <Text size="sm" c="dimmed">
                  Status: {survey.survey_status}
                </Text>
              </Stack>
              <Button
                variant="filled"
                color={getSurveyStatusColor(survey.survey_status)}
                disabled={survey.survey_status === "DRAFT"}
              >
                {getSurveyStatusText(survey.survey_status)}
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
