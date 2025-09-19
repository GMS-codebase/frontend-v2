"use client";
import { useState, useEffect } from "react";
import {
  Modal,
  TextInput,
  Select,
} from "@mantine/core";
import  Button  from "@/components/core/button";  
import { notifications } from "@mantine/notifications";
import { useDispatch, useSelector } from "react-redux";
import { createCompetence, updateCompetence, getTrades, getCompetences } from "@/services";
import { IoMdClose } from "react-icons/io";
import { IPaginatedQuery } from "@/types/base.type";
import { UnknownAction } from "redux";
import { ICompetence } from "@/types/competences";

type Competency = {
  uuid?: string;
  name: string;
  code: string;
  tradeId: string;
};

interface AddEditCompetencyProps {
  isOpen: boolean;
  onClose: () => void;
  defaultData?: Competency | null;
}

const AddEditCompetency = ({
  isOpen,
  onClose,
  defaultData,
}: AddEditCompetencyProps) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState<ICompetence>({
    name: defaultData?.name || "",
    code: defaultData?.code || "",
    tradeId: defaultData?.tradeId || "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});

  const {
    trades,
    tradesLoading,
    total: totalTrades,
    page: currentPageFromRedux,
  } = useSelector((state: any) => state.trades);

  // Local state for pagination
  const [paginateOpts, setLocalPaginateOpts] = useState<
    IPaginatedQuery & { totalPages: number }
  >({
    page: (currentPageFromRedux ?? 1) - 1, // UI 0-based
    limit: 10,
    totalPages: 1,
  });

  useEffect(() => {
    setLocalPaginateOpts((prev) => ({
      ...prev,
      totalPages: Math.ceil((totalTrades ?? 0) / (prev?.limit ?? 10)),
    }));
  }, [totalTrades]);

 
  useEffect(() => {
    dispatch(
      getTrades(
        (paginateOpts.page ?? 0) + 1,
        paginateOpts.limit
      ) as unknown as UnknownAction
    );
  }, [dispatch, paginateOpts.page, paginateOpts.limit]);

  const setPaginateOpts: React.Dispatch<
    React.SetStateAction<IPaginatedQuery & { totalPages: number }>
  > = (value) => {
    if (typeof value === "function") {
      setLocalPaginateOpts((prev) => {
        const next = value(prev);
        dispatch(
          getTrades(
            (next.page ?? 0) + 1,
            next.limit
          ) as unknown as UnknownAction
        );
        return next;
      });
    } else {
      setLocalPaginateOpts(value);
      dispatch(
        getTrades(
          (value.page ?? 0) + 1,
          value.limit
        ) as unknown as UnknownAction
      );
    }
  };


  useEffect(() => {
    if (defaultData) {
      setFormData({
        name: defaultData.name || "",
        code: defaultData.code || "",
        tradeId: defaultData.tradeId || "",
      });
    }
  }, [defaultData]);

  console.log("Trade Data:", trades);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: any = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.code.trim()) newErrors.code = "Competency code is required";
    if (!formData.tradeId) newErrors.tradeId = "Trade is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      notifications.show({
        message: "Please fill all required fields",
        color: "red",
      });
      return;
    }

    setLoading(true);
    setErrors({});
    const competencyData = { ...formData };

    try {
      if (defaultData?.uuid) {
        await dispatch(
          updateCompetence(defaultData.uuid, competencyData) as any
        );
        dispatch(
        getCompetences(
          paginateOpts.page,
          paginateOpts.limit,
        ) as unknown as UnknownAction
      );
      } else {
        // Create new competency
        await dispatch(createCompetence(competencyData) as any);
        dispatch(
          getCompetences(
            paginateOpts.page,
            paginateOpts.limit
          ) as unknown as UnknownAction
        );
        setFormData({ name: "", code: "", tradeId: "" }); // Reset form
      }
      onClose();
    } catch (err: any) {
      notifications.show({
        message: err.response?.data?.message || "Failed to save competency!",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      closeOnClickOutside={false}
      withCloseButton={false}
      centered
      size="lg"
    >
      <div className="w-full max-w-[100vw] md:max-w-[90vw] max-h-[90vh] overflow-y-auto relative bg-white rounded-2xl pt-8 pb-8 flex flex-col items-center">
        <button
          className="absolute top-2 right-2 bg-gray-100 p-1 rounded-lg"
          onClick={onClose}
        >
          <IoMdClose size={25} color="#000" />
        </button>
        <h1 className="text-2xl font-extrabold">
          {defaultData ? "Update Competency" : "Create Competency"}
        </h1>
        <h2 className="text-[#000F2369] text-lg font-medium">
          Provide your competency details to{" "}
          {defaultData ? "update" : "create a new"} competency.
        </h2>
        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-col gap-4 mt-4 px-[5%]"
        >
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Competence Name
            </label>
            <TextInput
              label="Name"
              placeholder="Competency name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.currentTarget.value })
              }
              required
              error={errors.name}
              className={`block w-full pl-8 px-3 py-2 bg-[#000F230A] rounded-xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm ${errors.name ? "border-red-500" : ""}`}
            />
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Competence Code
            </label>
            <TextInput
              label="Competency Code"
              placeholder="Competency code"
              value={formData.code}
              onChange={(e) =>
                setFormData({ ...formData, code: e.currentTarget.value })
              }
              required
              error={errors.code}
              className={`block w-full pl-8 px-3 py-2 bg-[#000F230A] rounded-xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm ${errors.code ? "border-red-500" : ""}`}
            />
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Trade
            </label>
            <Select
              label="Trade"
              placeholder="Select or type in a trade"
              value={formData.tradeId}
              onChange={(value) =>
                setFormData({ ...formData, tradeId: value || "" })
              }
              data={
                trades.length
                  ? trades.map((trade: any) => ({
                      value: trade.uuid,
                      label: trade.title,
                    }))
                  : [{ value: "", label: "No trades available" }]
              }
              required
              error={errors.tradeId}
              disabled={tradesLoading}
              className={`block w-full pl-8 px-3 py-2 bg-[#000F230A] rounded-xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm ${errors.tradeId ? "border-red-500" : ""}`}
            />
          </div>
          <div className="w-full flex mt-4 gap-4">
            <Button
              onClick={onClose}
              variant="primary"
              className="bg-[#000F23] w-1/2 rounded-full"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="bg-blue-500 w-1/2 rounded-full"
              loading={loading}
            >
              {defaultData ? "Update Competency" : "Create Competency"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AddEditCompetency;
