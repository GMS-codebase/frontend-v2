import React, { ChangeEvent, useState } from "react";
import TextArea from "@/components/ApplicantDetails/TextArea";
import { SolarDownloadMinimalisticBold } from "@/components/core/icons";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/core/data-table";
import { applicationData as data } from "@/utils/constants/dummy";
import { applicationDatas as datas } from "@/utils/constants/dummy";
import { beneficiaryData as bdata } from "@/utils/constants/dummy";
import { technicalData as tdata } from "@/utils/constants/dummy";
import NextPrevButtons from "../core/NextPrevButtons";
import { Comments } from "@/types";
type ProjectStepProps = {
  handleNext: () => void;
  handlePrevious: () => void;
  data: any;
  setComments: React.Dispatch<any>;
  commentsData: Comments;
  handleChangeComment: (e: any) => void;
};
const Project1: React.FC<ProjectStepProps> = ({
  handleNext,
  data,
  commentsData,
  setComments,
  handlePrevious,
  handleChangeComment,
}) => {
  return (
    <div className="flex flex-col gap-4 ">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          <h3 className="font-normal">Title of Application</h3>
          <p className="font-light">
            Please in one sentence describe what is the focus of the
            application.
          </p>
          <div className="text-gray-400">
            <TextArea readOnly defaultText={data?.title} />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <h3>Comment</h3>
          <div>
            <TextArea
              name="titleComment"
              value={commentsData.titleComment}
              onChange={handleChangeComment}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          <h3 className="font-normal">Project Activities and Outcome</h3>
          <p className="font-light">
            Outline the planned activities to be supported by SDF; The skills
            problem you want to solve, the outcome/results and Justify why you
            need the grant to solve it. Explain why this project cannot be
            executed without a grant from SDF.
          </p>
          <div className="text-gray-400">
            <TextArea
              readOnly
              defaultText="COFOPRO is a private company limited by individual shares aimed to develop made in Rwanda garment manufacturing at a fair and affordable prices on the Rwandan market and also aimed to expand our garment manufacturing by exporting our products. we also give out training to skills upgrading for works and other peoples who have knowledge in tailoring, we also give training on the use of modern tailoring equipment. in modern tailoring we have a problem on professionals skills works as"
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <h3>Comment</h3>
          <div>
            <TextArea
              name="activitiesComment"
              value={commentsData.activitiesComment}
              onChange={handleChangeComment}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          <h3 className="font-normal">
            Information about the institution to host beneficiaries.
          </h3>
          <div className="font-light">
            Specify the economic sector and main business products of the
            company that will host apprentices/ interns or RPL or skills
            upgrading
          </div>
          <div className="text-gray-400">
            <TextArea
              readOnly
              defaultText="We are a domestic garment company which sew all kind of men clothes which are: suites, shirts, trousers and different kind of uniforms and we also deal with women clothes excluding underwear."
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="font-light">Comment</h3>
          <div>
            <TextArea
              name="trainingPremisesComment"
              value={commentsData.trainingPremisesComment}
              onChange={handleChangeComment}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          <h3 className="font-normal">
            Information about the institution to host beneficiaries -
            (Continued)
          </h3>
          <div className="font-light text-black">
            The applying company/industry to host apprentices should attach the
            recommendation from PSF
          </div>
          <div
            className="flex gap-2 text-white cursor-pointer bg-blue-700 items-center justify-center px-2 py-2 rounded-full "
            // onClick={handleDownload}
          >
            <span>
              <SolarDownloadMinimalisticBold />
            </span>
            <p>Download</p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <h3>Comment</h3>
          <div>
            <TextArea readOnly />
          </div>
        </div>
      </div>
      <NextPrevButtons
        handleNext={handleNext}
        handlePrev={() => {}}
        isFirst={true}
      />
    </div>
  );
};

const Project2: React.FC<ProjectStepProps> = ({
  handleNext,
  handlePrevious,
  data,
  commentsData,
  setComments,
  handleChangeComment,
}) => {
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "",
      header: "Training content/modules",
      cell: ({ row }) => (
        <div className="truncate">
          {row.original?.trainingContent.length > 50
            ? row.original?.trainingContent.slice(0, 50) + "..."
            : row.original.trainingContent}
        </div>
      ),
    },
    {
      accessorKey: "fromDate",
      header: "From (dd/MM/yyyy)",
      cell: ({ row }) => (
        <div className="truncate">
          {row.original?.fromDate.length > 50
            ? row.original?.fromDate.slice(0, 50) + "..."
            : row.original.fromDate}
        </div>
      ),
    },
    {
      accessorKey: "toDate",
      header: "TO (dd/MM/yyyy)",
      cell: ({ row }) => (
        <div className="truncate">
          {row.original?.toDate.length > 50
            ? row.original?.toDate.slice(0, 50) + "..."
            : row.original.toDate}
        </div>
      ),
    },
    {
      accessorKey: "numberOfHours",
      header: "Number of Hours",
      cell: ({ row }) => (
        <div className="truncate">
          {row.original?.numberOfHours.length > 50
            ? row.original?.numberOfHours.slice(0, 50) + "..."
            : row.original.numberOfHours}
        </div>
      ),
    },
    {
      accessorKey: "Trade",
      header: "Trade",
      cell: ({ row }) => (
        <div className="truncate">
          {row.original?.Trade.length > 50
            ? row.original?.Trade.slice(0, 50) + "..."
            : row.original.Trade}
        </div>
      ),
    },
  ];
  return (
    <div className="w-full flex flex-col gap-4">
      <div className="font-semibold">Training Delivery Process</div>
      <p className="font-normal">
        Keep in mind that the training period for window 1 should be ranging
        from a few days to 6 months, estimate the training duration with respect
        to the training content/modules to be offered.
      </p>
      <div className="w-full h-full">
        <DataTable
          tableClass="w-[795px] text-sm"
          columns={columns}
          data={datas}
        />
      </div>
      <div className="flex flex-col gap-2">
        <h3>Comment</h3>
        <div>
          <TextArea
            name="trainingManualComment"
            value={commentsData.trainingManualComment}
            onChange={handleChangeComment}
          />
        </div>
      </div>
      <NextPrevButtons handleNext={handleNext} handlePrev={handlePrevious} />
    </div>
  );
};
const Project3: React.FC<ProjectStepProps> = ({
  handleNext,
  handlePrevious,
  data,
  commentsData,
  setComments,
  handleChangeComment,
}) => {
  const handleDownload = () => {
    const data = `
            Title of Application:
            The focus of this application is to provide a Master in Business Administration (MBA) in ICT program for Leaders, Professional Managers for a meaningful impact in the disruptive new era.
            
            Project Activities and Outcome:
            COFOPRO is a private company limited by individual shares aimed to develop made in Rwanda garment manufacturing at a fair and affordable prices on the Rwandan market and also aimed to expand our garment manufacturing by exporting our products. we also give out training to skills upgrading for works and other peoples who have knowledge in tailoring, we also give training on the use of modern tailoring equipment. in modern tailoring we have a problem on professionals skills works as
            
            Information about the institution to host beneficiaries:
            We are a domestic garment company which sew all kind of men clothes which are: suites, shirts, trousers and different kind of uniforms and we also deal with women clothes excluding underwear.
            
            Information about the institution to host beneficiaries - (Continued):
            The applying company/industry to host apprentices should attach the recommendation from PSF
        `;
    const blob = new Blob([data], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Applicant_Details.txt";
    link.click();
    URL.revokeObjectURL(url); // Clean up the URL object
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 ">
        <div className="fornt-semibold">
          Training Delivery Process-(Continued)
        </div>
        <p>Total Number of Hours.</p>
        <div className="flex items-center justify-start  font-normal">
          <TextArea readOnly defaultText="144" />
        </div>
        <div className="flex flex-col gap-2">
          <h3>Comment</h3>
          <div>
            <TextArea
              name="titleComment"
              value={commentsData.titleComment}
              onChange={handleChangeComment}
            />
          </div>
        </div>
      </div>
      <div>
        <div className="flex flex-col gap-2">
          {" "}
          <div className="font-semibold">
            Training Delivery Process-(Continued)
          </div>
          <p className="font-normal">
            Please attach a detailed description of the content (training
            manual) of the proposed training.
          </p>
          <div
            className="flex gap-2 text-white cursor-pointer bg-blue-700 rounded-full py-2 px-2 items-center justify-center"
            onClick={handleDownload}
          >
            <span>
              <SolarDownloadMinimalisticBold />
            </span>
            <p>Download</p>
          </div>
          <div className="flex flex-col gap-2">
            <h3>Comment</h3>
            <div>
              <TextArea
                name="titleComment"
                value={commentsData.titleComment}
                onChange={handleChangeComment}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="font-semibold">
          Training Delivery Process - (Continued)
        </div>
        <div className="font-normal">
          Add a comment related to the training process if any.
        </div>
        <div>
          <TextArea
            readOnly
            defaultText="Based on our experience in training we assure you that once we get a chance of being selected ; we will train new trainees and upgrade the existing employees  the advanced technology in mining sector ."
          />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <h3>Comment</h3>
        <div>
          <TextArea
            name="titleComment"
            value={commentsData.titleComment}
            onChange={handleChangeComment}
          />
        </div>
      </div>
      <NextPrevButtons handleNext={handleNext} handlePrev={handlePrevious} />
    </div>
  );
};
const Project4: React.FC<ProjectStepProps> = ({
  handleNext,
  handlePrevious,
  data,
  commentsData,
  setComments,
  handleChangeComment,
}) => {
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "type",
      header:
        "Type of equipment available for the proposed training. Please indicate for which module/course it will be used ",
      cell: ({ row }) => (
        <div className="truncate">
          {row.original?.type.length > 50
            ? row.original?.type.slice(0, 50) + "..."
            : row.original.type}
        </div>
      ),
    },
    {
      accessorKey: "number",
      header: "Number (How many?) ",
      cell: ({ row }) => (
        <div className="truncate">
          {row.original?.number.length > 50
            ? row.original?.number.slice(0, 50) + "..."
            : row.original.number}
        </div>
      ),
    },
    {
      accessorKey: "trade",
      header: "TRADE",
      cell: ({ row }) => (
        <div className="truncate">
          {row.original?.trade.length > 50
            ? row.original?.trade.slice(0, 50) + "..."
            : row.original.trade}
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-semibold text-2xl mt-4">Training Equipment</h1>
      <div className="font-normal mt-2 text-xl">
        List down the equipment required to conduct this training.
      </div>
      <div className="w-full h-full">
        <DataTable
          tableClass="w-[795px] text-sm"
          columns={columns}
          data={data}
        />
      </div>
      <div className="flex flex-col gap-2">
        <h3>Comment</h3>
        <div>
          <TextArea
            name="titleComment"
            value={commentsData.titleComment}
            onChange={handleChangeComment}
          />
        </div>
      </div>
      <NextPrevButtons handleNext={handleNext} handlePrev={handlePrevious} />
    </div>
  );
};

const Project5: React.FC<ProjectStepProps> = ({
  handleNext,
  handlePrevious,
  data,
  commentsData,
  setComments,
  handleChangeComment,
}) => {
  const handleDownload = () => {
    const data = `
            Title of Application:
            The focus of this application is to provide a Master in Business Administration (MBA) in ICT program for Leaders, Professional Managers for a meaningful impact in the disruptive new era.
            
            Project Activities and Outcome:
            COFOPRO is a private company limited by individual shares aimed to develop made in Rwanda garment manufacturing at a fair and affordable prices on the Rwandan market and also aimed to expand our garment manufacturing by exporting our products. we also give out training to skills upgrading for works and other peoples who have knowledge in tailoring, we also give training on the use of modern tailoring equipment. in modern tailoring we have a problem on professionals skills works as
            
            Information about the institution to host beneficiaries:
            We are a domestic garment company which sew all kind of men clothes which are: suites, shirts, trousers and different kind of uniforms and we also deal with women clothes excluding underwear.
            
            Information about the institution to host beneficiaries - (Continued):
            The applying company/industry to host apprentices should attach the recommendation from PSF
        `;
    const blob = new Blob([data], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Applicant_Details.txt";
    link.click();
    URL.revokeObjectURL(url); // Clean up the URL object
  };
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "trade",
      header: "Name of Trade",
      cell: ({ row }) => (
        <div className="truncate">
          {row.original?.trade.length > 50
            ? row.original?.trade.slice(0, 50) + "..."
            : row.original.trade}
        </div>
      ),
    },
    {
      accessorKey: "number",
      header: "Number of Beneficiaries ",
      cell: ({ row }) => (
        <div className="truncate">
          {row.original?.number.length > 50
            ? row.original?.number.slice(0, 50) + "..."
            : row.original.number}
        </div>
      ),
    },
    {
      accessorKey: "education",
      header: "Level of education ",
      cell: ({ row }) => (
        <div className="truncate">
          {row.original?.education.length > 50
            ? row.original?.education.slice(0, 50) + "..."
            : row.original.education}
        </div>
      ),
    },
    {
      accessorKey: "trades",
      header: "TRADE",
      cell: ({ row }) => (
        <div className="truncate">
          {row.original?.trades.length > 50
            ? row.original?.trades.slice(0, 50) + "..."
            : row.original.trades}
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h1 className="font-semibold">Recruitment of beneficiaries.</h1>
        <div className="text-black font-md ">
          Indicate the number of Beneficiaries getting the Apprenticeships and
          Internships from the project for a period of six (6) months and the
          number of Beneficiaries for RPL and Skills upgrading from the project
          for a period ranging from few days to 6 months.
        </div>
      </div>
      <div className="w-full h-full">
        <DataTable
          tableClass="w-[795px] text-sm"
          columns={columns}
          data={bdata}
        />
      </div>
      <div className="flex flex-col gap-2">
        <h3>Comment</h3>
        <div>
          <TextArea
            name="titleComment"
            value={commentsData.titleComment}
            onChange={handleChangeComment}
          />
        </div>
      </div>
      <NextPrevButtons handleNext={handleNext} handlePrev={handlePrevious} />
    </div>
  );
};

const Project6: React.FC<ProjectStepProps> = ({
  handleNext,
  handlePrevious,
  data,
  commentsData,
  setComments,
  handleChangeComment,
}) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      <h2 className="font-semibold">Total number of trainees.</h2>
      <div className="w-full flex justify-start items-center">
        <TextArea readOnly defaultText="250" />
      </div>
      <div className="flex flex-col gap-2">
        <h3>Comment</h3>
        <div>
          <TextArea
            name="titleComment"
            value={commentsData.trainingEquipmentComment}
            onChange={handleChangeComment}
          />
        </div>
      </div>
      <NextPrevButtons handleNext={handleNext} handlePrev={handlePrevious} />
    </div>
  );
};

const Project7: React.FC<ProjectStepProps> = ({
  handleNext,
  handlePrevious,
  data,
  commentsData,
  setComments,
  handleChangeComment,
}) => {
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "no",
      header: "No",
      cell: ({ row }) => (
        <div className="truncate">
          {row.original?.no.length > 50
            ? row.original?.no.slice(0, 50) + "..."
            : row.original.no}
        </div>
      ),
    },
    {
      accessorKey: "position",
      header: "POSITION",
      cell: ({ row }) => (
        <div className="truncate">
          {row.original?.position.length > 50
            ? row.original?.position.slice(0, 50) + "..."
            : row.original.position}
        </div>
      ),
    },
    {
      accessorKey: "qualification",
      header: "Qualification ",
      cell: ({ row }) => (
        <div className="truncate">
          {row.original?.qualification.length > 50
            ? row.original?.qualification.slice(0, 50) + "..."
            : row.original.qualification}
        </div>
      ),
    },
    {
      accessorKey: "available",
      header: "Available or to be hired",
      cell: ({ row }) => (
        <div className="truncate">
          {row.original?.available.length > 50
            ? row.original?.available.slice(0, 50) + "..."
            : row.original.available}
        </div>
      ),
    },
  ];
  return (
    <div className="w-full flex flex-col gap-4">
      <div className="font-semibold">Technical Staff</div>
      <p className="font-normal">
        Identify the technical staff (instructors) required to train the trades
        you are applying for.
      </p>
      <div className="w-full h-full">
        <DataTable
          tableClass="w-[780px] text-sm"
          columns={columns}
          data={tdata}
        />
      </div>
      <NextPrevButtons handleNext={handleNext} handlePrev={handlePrevious} />
    </div>
  );
};

const Project = ({
  data,
  setComments,
  commentsData,
}: {
  data: any;
  setComments: React.Dispatch<any>;
  commentsData: Comments;
}) => {
  const [currentStep, setCurrentStep] = useState(1);

  const handleNext = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => prev - 1);
  };
  const handleChangeComment = (e: any) => {
    const { name, value } = e.target;
    setComments((prevComments: Comments) => ({
      ...prevComments,
      [name]: value,
    }));
  };
  switch (currentStep) {
    case 1:
      return (
        <Project1
          handleChangeComment={handleChangeComment}
          handlePrevious={handlePrevious}
          handleNext={handleNext}
          data={data}
          setComments={setComments}
          commentsData={commentsData}
        />
      );
    case 2:
      return (
        <Project2
          handleChangeComment={handleChangeComment}
          handleNext={handleNext}
          handlePrevious={handlePrevious}
          data={data}
          setComments={setComments}
          commentsData={commentsData}
        />
      );
    case 3:
      return (
        <Project3
          handleChangeComment={handleChangeComment}
          handleNext={handleNext}
          handlePrevious={handlePrevious}
          data={data}
          setComments={setComments}
          commentsData={commentsData}
        />
      );
    case 4:
      return (
        <Project4
          handleChangeComment={handleChangeComment}
          handleNext={handleNext}
          handlePrevious={handlePrevious}
          data={data}
          setComments={setComments}
          commentsData={commentsData}
        />
      );
    case 5:
      return (
        <Project5
          handleChangeComment={handleChangeComment}
          handleNext={handleNext}
          handlePrevious={handlePrevious}
          data={data}
          setComments={setComments}
          commentsData={commentsData}
        />
      );

    case 6:
      return (
        <Project6
          handleChangeComment={handleChangeComment}
          handleNext={handleNext}
          handlePrevious={handlePrevious}
          data={data}
          setComments={setComments}
          commentsData={commentsData}
        />
      );
    case 7:
      return (
        <Project7
          handleChangeComment={handleChangeComment}
          handleNext={handleNext}
          handlePrevious={handlePrevious}
          data={data}
          setComments={setComments}
          commentsData={commentsData}
        />
      );

    // Add more cases for Project3, Project4, etc.
    default:
      return (
        <Project1
          handleChangeComment={handleChangeComment}
          handlePrevious={handlePrevious}
          handleNext={handleNext}
          data={data}
          setComments={setComments}
          commentsData={commentsData}
        />
      );
  }
};

export default Project;
