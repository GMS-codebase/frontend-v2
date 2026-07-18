"use client";
import Button from "@/components/ui/Button";
import {
  requestCertificationReview,
  sdfCertificationDecision,
} from "@/services";
import { ITraining } from "@/types/trainings";
import { Checkbox } from "@mantine/core";
import { Loader2 } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ConfirmationModal from "@/components/Modals/training/CertificationConfirmModal";

type Props = {
  currentRole: string | null;
  training: ITraining;
};

const CertificationGrid: FC<Props> = ({ currentRole, training }) => {
  const dispatch = useDispatch();
  const { certificationLoading } = useSelector((state: any) => state.trainings);

  // Initialize selected IDs
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<
    "CERTIFICATION_REQUEST" | "CERTIFICATION_DECISION" | null
  >(null);

  // Only trainees with pending certification are displayed
  const pendingTrainees =
    training?.trainees?.filter((t) => t.certificationStatus === "PENDING") ??
    [];

  useEffect(() => {
    const preselected = pendingTrainees
      .filter((t) => t.certificationRequested)
      .map((t) => t.uuid);
    setSelectedIds(preselected);
  }, [training?.trainees]);

  const handleToggle = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((uuid) => uuid !== id) : [...prev, id]
    );
  };

  // Get trainee names for modal
  const getTraineeNames = () => {
    return pendingTrainees
      .filter((trainee) => selectedIds.includes(trainee.uuid))
      .map((trainee) => `${trainee.firstName} ${trainee.lastName}`);
  };

  // Handle modal open
  const openModal = (
    action: "CERTIFICATION_REQUEST" | "CERTIFICATION_DECISION"
  ) => {
    if (selectedIds.length === 0) {
      // Optionally handle case where no trainees are selected
      return;
    }
    setModalAction(action);
    setModalOpen(true);
  };

  // Handle modal confirm
  const handleConfirm = () => {
    if (modalAction === "CERTIFICATION_REQUEST") {
      dispatch(
        requestCertificationReview({
          trainingId: training?.uuid,
          trainees: selectedIds,
        }) as any
      );
    } else if (modalAction === "CERTIFICATION_DECISION") {
      dispatch(
        sdfCertificationDecision({
          trainingId: training?.uuid,
          trainees: selectedIds,
        }) as any
      );
    }
    setModalOpen(false);
    setModalAction(null);
  };

  const handleCertificationRequest = () => {
    openModal("CERTIFICATION_REQUEST");
  };

  const handleCertificationResponse = () => {
    openModal("CERTIFICATION_DECISION");
  };

  return (
    <div className="flex flex-col gap-10 pt-10">
      <ConfirmationModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setModalAction(null);
        }}
        onConfirm={handleConfirm}
        action={modalAction}
        traineeNames={modalAction ? getTraineeNames() : undefined}
      />
      <div className="flex items-center justify-between">
        <h2 className="text-xl md:text-2xl font-bold text-primaryText">
          Certification
        </h2>

        {training.status === "ACCEPTED" && (
          <>
            {currentRole === "APPLICANT" && (
              <Button
                className="!rounded-full !bg-primary py-3"
                onClick={handleCertificationRequest}
                disabled={selectedIds.length === 0 || certificationLoading}
              >
                {certificationLoading ? (
                  <Loader2 className="animate-spin text-white" fontSize={24} />
                ) : (
                  "Request Certification"
                )}
              </Button>
            )}
            {currentRole === "SDF_SECRETARIATE" && (
              <Button
                className="!rounded-full !bg-primary py-3"
                onClick={handleCertificationResponse}
                disabled={selectedIds.length === 0 || certificationLoading}
              >
                {certificationLoading ? (
                  <Loader2 className="animate-spin text-white" fontSize={24} />
                ) : (
                  "Make Decision"
                )}
              </Button>
            )}
          </>
        )}
      </div>

      <div className="p-6 bg-[#F6F6F6] rounded-3xl">
        <h2 className="text-base font-normal mb-6">
          Checkmark trainees that attended at least 3/4 of all sessions provided
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {pendingTrainees?.map((trainee) => (
            <div
              key={trainee.uuid}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span
                className={`font-medium truncate ${selectedIds.includes(trainee.uuid) ? "text-primary" : "text-primaryText"}`}
              >
                {trainee.firstName + " " + trainee.lastName}
              </span>
              <Checkbox
                checked={selectedIds.includes(trainee.uuid)}
                onChange={() => handleToggle(trainee.uuid)}
                color="blue"
                size="md"
                className="ml-2 !bg-inherit"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CertificationGrid;
