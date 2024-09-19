import { Modal, Select, Text, Button } from "@mantine/core";
import { IoMdClose } from "react-icons/io";
import { useState } from "react";
import { authorizedApi } from "@/utils/api";
import { notifications } from "@mantine/notifications";

const RemoveFromStage = ({
  employee,
  isOpen,
  stage,
  closeModal,
  onRemoveSector,
}: {
  employee: any;
  isOpen: boolean;
  stage: any;
  closeModal: any;
  onRemoveSector: any;
}) => {
  const [selectedSector, setSelectedSector] = useState<any>("");
  const [loading, setLoading] = useState(false);

  const handleRemoveStage = () => {
    setLoading(true);
    authorizedApi
      .post("/admin/employee/remove/stage", {
        stage_id: stage.uuid,
        emp_id: employee.uuid,
        sector_name: selectedSector,
      })
      .then(() => {
        notifications.show({
          message: "Sector removed successfully",
          color: "blue",
        });
        onRemoveSector(selectedSector); // Update the UI after successful removal
        closeModal();
      })
      .catch(() => {
        notifications.show({
          message: "Failed to remove sector",
          color: "red",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Modal
      opened={isOpen}
      onClose={closeModal}
      title="Remove from Stage"
      centered
      size="sm"
      closeOnClickOutside={false}
      overlayProps={{
        color: "#000",
        opacity: 0.55,
        blur: 3,
      }}
    >
      <div className="p-5 space-y-4">
        <Text className="text-gray-600">
          Are you sure you want to remove the sector from the stage?
        </Text>
        <Select
          placeholder="Select a sector to remove"
          value={selectedSector}
          onChange={setSelectedSector}
          data={stage?.sectors || []}
          classNames={{
            input: "h-12 w-full border-2 border-gray-300 rounded-lg",
          }}
        />
        <div className="flex justify-end space-x-3">
          <Button onClick={closeModal} variant="default">
            Cancel
          </Button>
          <Button
            onClick={handleRemoveStage}
            loading={loading}
            className="bg-red-500 hover:bg-red-600 text-white"
            disabled={!selectedSector}
          >
            Remove Sector
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default RemoveFromStage;