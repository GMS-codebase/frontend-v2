"use client";
import React from "react";
import { Card, Grid, Text, Group, Stack } from "@mantine/core";
import { SolarPaperclipRounded2Bold } from "@/components/core/icons";

export default function TraineeDashboard() {
  return (
    <div className="p-6">
      <Text size="xl" fw={700} mb={24}>
        Welcome to Your Training Dashboard
      </Text>

      <Grid>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
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
