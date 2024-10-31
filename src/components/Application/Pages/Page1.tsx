import { Comments } from "@/types";

export const Page1 = ({
  data,
  setData,
  comments,
  setComments,
  isApplicant
}: {
  data: any;
  setData?: any;
  comments?: Comments;
  setComments?: any;
  isApplicant?: boolean;
}) => {
  const handleCommentChange = (inputName: string, value: any) => {
    if (setComments) {
      setComments((prev: any) => ({
        ...prev,
        [inputName]: value,
      }));
    }
  };

  return (
    <>
      <div className="">
        <h3 className="text-lg font-bold">Title of the project</h3>
        <p className="text-sm text-gray-600">
          Please provide the name/title of your project.
        </p>
        <input
          type="text"
          value={data?.title || ""}
          onChange={(e) => setData("title", e.target.value)}
          className="mt-2 p-2 border rounded-2xl bg-primaryText bg-opacity-5 outline-none w-full"
          disabled={!!comments || !setData}
        />
        {!isApplicant && comments && (
          <div className="mt-2 ">
            <label htmlFor="" className="font-medium text-sm">
              Comment
            </label>
            <textarea
              value={comments.titleComment || ""}
              onChange={(e) =>
                handleCommentChange("titleComment", e.target.value)
              }
              className="p-2 border rounded-2xl bg-gray-100 outline-none w-full"
              disabled={!setComments}
            />
          </div>
        )}
      </div>
      <div className="">
        <h3 className="text-lg font-bold">
          Project Activities and Expected Outcomes
        </h3>
        <p className="text-sm text-gray-600">
          Outline the planned activities to be supported; The skills gap to be
          addressed by the project, the expected outcomes/results, and justify
          why you need the grant to solve it. Explain why this project cannot be
          executed without a grant.
        </p>
        <textarea
          value={data?.activitiesAndOutcomes || ""}
          onChange={(e) => setData("activitiesAndOutcomes", e.target.value)}
          className="mt-2 p-2 border rounded-2xl bg-primaryText bg-opacity-5 outline-none w-full"
          disabled={!!comments || !setData}
        />
        {!isApplicant && comments && (
          <div className="mt-2">
            <label htmlFor="" className="font-medium text-sm">
              Comment
            </label>
            <textarea
              value={comments.activitiesComment || ""}
              onChange={(e) =>
                handleCommentChange("activitiesComment", e.target.value)
              }
              className="p-2 border rounded-2xl bg-gray-100 outline-none w-full"
              disabled={!setComments}
            />
          </div>
        )}
      </div>
      <div className="">
        <h3 className="text-lg font-bold">Readiness to execute the project</h3>
        <p className="text-sm text-gray-600">
          Explain to which extent you are prepared to execute this project.
        </p>
        <textarea
          value={data?.readinessExecute || ""}
          onChange={(e) => setData("readinessExecute", e.target.value)}
          className="mt-2 p-2 border rounded-2xl bg-primaryText bg-opacity-5 outline-none w-full"
          disabled={!!comments || !setData}
        />
        {!isApplicant && comments && (
          <div className="mt-2">
            <label htmlFor="" className="font-medium text-sm">
              Comment
            </label>
            <textarea
              value={comments.readinessExecuteComment || ""}
              onChange={(e) =>
                handleCommentChange("readinessExecuteComment", e.target.value)
              }
              className="p-2 border rounded-2xl bg-gray-100 outline-none w-full"
              disabled={!setComments}
            />
          </div>
        )}
      </div>
      <div className="">
        <h3 className="text-lg font-bold">
          Role of other involved training providers
        </h3>
        <p className="text-sm text-gray-600">
          Explain the role of any other involved training provider in the
          project, if any. Indicate the training provider you would like to
          partner with if any.
        </p>
        <textarea
          value={data?.role || ""}
          onChange={(e) => setData("role", e.target.value)}
          className="mt-2 p-2 border rounded-2xl bg-primaryText bg-opacity-5 outline-none w-full"
          disabled={!!comments || !setData}
        />
        {!isApplicant && comments && (
          <div className="mt-2">
            <label htmlFor="" className="font-medium text-sm">
              Comment
            </label>
            <textarea
              value={comments.roleComment || ""}
              onChange={(e) =>
                handleCommentChange("roleComment", e.target.value)
              }
              className="p-2 border rounded-2xl bg-gray-100 outline-none w-full"
              disabled={!setComments}
            />
          </div>
        )}
      </div>
      <div className="">
        <h3 className="text-lg font-bold">
          Identification of employees in need of skills upgrading
        </h3>
        <p className="text-sm text-gray-600">
          Provide the number of employees you need to train and their
          background.
        </p>
        <input
          type="number"
          value={data?.identificationEmployee || ""}
          onChange={(e) => setData("identificationEmployee", e.target.value)}
          className="mt-2 p-2 border rounded-2xl bg-primaryText bg-opacity-5 outline-none w-full"
          disabled={!!comments || !setData}
        />
        {!isApplicant && comments && (
          <div className="mt-2">
            <label htmlFor="" className="font-medium text-sm">
              Comment
            </label>
            <input
              type="text"
              value={comments.identificationEmployeeComment || ""}
              onChange={(e) =>
                handleCommentChange(
                  "identificationEmployeeComment",
                  e.target.value,
                )
              }
              className="mt-2 p-2 border rounded-2xl bg-gray-100 outline-none w-full"
              disabled={!setComments}
            />
          </div>
        )}
      </div>
    </>
  );
};
