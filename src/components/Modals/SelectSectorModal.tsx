import { Modal, Button, Select, Text, Group } from "@mantine/core";
import { useState } from "react";

const SelectSectorModal = ({
  isOpen,
  closeModal,
  stage,
  onRemoveSector,
}: {
  isOpen: boolean;
  closeModal: () => void;
  stage: any;
  onRemoveSector: any;
}) => {
  const [selectedSector, setSelectedSector] = useState("");

  // Function to handle sector removal
  const handleRemove = () => {
    if (selectedSector) {
      onRemoveSector(selectedSector);
      closeModal(); // Close the modal after removal
    }
  };

  return (
    <Modal
      opened={isOpen}
      onClose={closeModal}
      title="Select Sector to Remove"
      size="md"
      centered
      //   overlayBlur={3}
      //   overlayOpacity={0.55}
      withCloseButton={false} // To enhance modal appearance
    >
      <div className="flex flex-col gap-4 p-4">
        {/* Stage Title */}
        <Text className="text-lg font-bold" color="dark">
          {stage?.stage || "No Stage Selected"}
        </Text>

        {/* Instruction Text */}
        <Text color="dimmed">Select a sector to remove:</Text>

        {/* Sector Selection */}
        <Select
          placeholder="Select a sector"
          data={stage?.sectors || []}
          value={selectedSector}
          onChange={(value: any) => setSelectedSector(value)}
          radius="md"
          size="md"
          withAsterisk
          //   transition="pop-top-left"
          //   transitionDuration={200}
          //   transitionTimingFunction="ease"
        />

        {/* Action Buttons */}
        <Group className="mt-4">
          <Button
            variant="outline"
            color="gray"
            onClick={closeModal}
            radius="md"
            className="transition-all"
          >
            Cancel
          </Button>
          <Button
            color="red"
            onClick={handleRemove}
            disabled={!selectedSector}
            radius="md"
            className="transition-all"
          >
            Remove Sector
          </Button>
        </Group>
      </div>
    </Modal>
  );
};

export default SelectSectorModal;
