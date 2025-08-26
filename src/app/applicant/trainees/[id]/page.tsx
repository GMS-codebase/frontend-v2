// TRAINEE FEATURE COMMENTED OUT
/*
"use client";
import React, { useEffect, useState } from "react";
import { Card, Grid, Group, Stack, Text, Badge } from "@mantine/core";
import { authorizedApi } from "@/utils/api";
import { useParams } from "next/navigation";

interface TraineeDetails {
  uuid: string;
  name: string;
  email: string;
  phone: string;
  nationalId: string;
  gender: string;
  dateOfBirth: string;
  maritalStatus: string;
  approvalStatus: string;
  applicationNumber: string | null;
}

const TraineeDetailsPage = () => {
  const params = useParams();
  const [trainee, setTrainee] = useState<TraineeDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTraineeDetails = async () => {
      try {
        const response = await authorizedApi.get(
          `/applicant/trainees/${params.id}`
        );
        setTrainee(response.data.data);
      } catch (error) {
        console.error("Error fetching trainee details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchTraineeDetails();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="p-6">
        <Text>Loading...</Text>
      </div>
    );
  }

  if (!trainee) {
    return (
      <div className="p-6">
        <Text>Trainee not found</Text>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Text size="xl" fw={700} mb={24}>
        Trainee Details
      </Text>

      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Stack gap="md">
          <Group justify="space-between">
            <Text size="lg" fw={500}>
              {trainee.name}
            </Text>
            <Badge
              color={
                trainee.approvalStatus === "PENDING"
                  ? "yellow"
                  : trainee.approvalStatus === "APPROVED"
                    ? "green"
                    : "red"
              }
            >
              {trainee.approvalStatus}
            </Badge>
          </Group>

          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Stack gap="xs">
                <Text size="sm" c="dimmed">
                  National ID
                </Text>
                <Text>{trainee.nationalId}</Text>
              </Stack>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <Stack gap="xs">
                <Text size="sm" c="dimmed">
                  Application Number
                </Text>
                <Text>{trainee.applicationNumber || "Not assigned"}</Text>
              </Stack>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <Stack gap="xs">
                <Text size="sm" c="dimmed">
                  Email
                </Text>
                <Text>{trainee.email}</Text>
              </Stack>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <Stack gap="xs">
                <Text size="sm" c="dimmed">
                  Phone
                </Text>
                <Text>{trainee.phone}</Text>
              </Stack>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <Stack gap="xs">
                <Text size="sm" c="dimmed">
                  Gender
                </Text>
                <Text>{trainee.gender}</Text>
              </Stack>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <Stack gap="xs">
                <Text size="sm" c="dimmed">
                  Date of Birth
                </Text>
                <Text>
                  {new Date(trainee.dateOfBirth).toLocaleDateString()}
                </Text>
              </Stack>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <Stack gap="xs">
                <Text size="sm" c="dimmed">
                  Marital Status
                </Text>
                <Text>{trainee.maritalStatus}</Text>
              </Stack>
            </Grid.Col>
          </Grid>
        </Stack>
      </Card>
    </div>
  );
};

export default TraineeDetailsPage;
*/

export default function Placeholder() { return null; }
