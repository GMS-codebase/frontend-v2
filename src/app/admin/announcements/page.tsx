"use client";
import { authorizedApi } from "@/utils/api";
import { getAnnouncement } from "@/services";
import { MultiSelect, Select } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

interface Announcement {
  roles: string[];
  body: string;
}

const getFormattedRoles = (roles: string[]) => {
  return roles.map((role: string) => {
    switch (role.toLowerCase()) {
      case "normal_employee":
        return "Employee";
      case "grant_committee":
        return "Grant Committee";
      case "sdf_secretariate":
        return "SDF Secretariate";
      case "applicant":
        return "Applicant";
      default:
        return role;
    }
  });
};
const Page = () => {
  const { announcement, loading: loadingAnnouncement } = useSelector(
    (state: any) => state.announcement,
  );
  const [roles, setRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingActivate, setLoadingActivate] = useState(false);
  const [loadingDeactivate, setLoadingDeactivate] = useState(false);
  const [body, setBody] = useState("");
  const dispatch = useDispatch();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (roles.length === 0 || body === "") {
      return setLoading(false);
    }
    const updatedAnnouncement: Announcement = {
      roles,
      body,
    };
    authorizedApi
      .post("/announcements", updatedAnnouncement)
      .then((response) => {
        setRoles([]);
        setBody("");
        notifications.show({
          message: "Announcement Published Successfully!",
        });
        getAnnouncement(dispatch);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => setLoading(false));
  };

  const activate = () => {
    setLoadingActivate(true);
    authorizedApi
      .put(`/announcements/activate/${announcement?.uuid}`)
      .then((response) => {
        setLoadingActivate(false);
        notifications.show({
          message: "Announcement Activated Successfully!",
        });
        getAnnouncement(dispatch);
      });
  };

  const deactivate = () => {
    setLoadingDeactivate(true);
    authorizedApi
      .put(`/announcements/deactivate/${announcement?.uuid}`)
      .then((response) => {
        setLoadingDeactivate(false);
        notifications.show({
          message: "Announcement Deactivated Successfully!",
        });
        getAnnouncement(dispatch);
      });
  };

  return (
    <div className="w-full flex flex-col bg-white rounded-2xl mb-20 pb-10 p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">
          {announcement ? "Update Announcement" : "Create Announcement"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Roles</label>
            <MultiSelect
              placeholder="Select Roles"
              data={[
                "NORMAL_EMPLOYEE",
                "SDF_SECRETARIATE",
                "GRANT_COMMITTEE",
                "APPLICANT",
              ]}
              value={roles}
              onChange={(value) => setRoles(value)}
              className="w-full py-1 px-2 border rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Content</label>
            <textarea
              placeholder="Announcement Body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full p-2 border rounded-lg h-32"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            {loading
              ? "Loading . . ."
              : announcement
                ? "Update Announcement"
                : "Post Announcement"}
          </button>
        </form>
      </div>
      <div>
        <h2 className="text-2xl font-bold mb-4">Current Announcement</h2>
        {announcement ? (
          <div className="border rounded-lg p-4 shadow-sm">
            <div className="lg:flex justify-between items-center mb-2">
              <h3 className="text-xl font-semibold">
                {getFormattedRoles(announcement?.roles).join(", ")}
              </h3>
              <div className="flex gap-4 items-center">
                <span
                  className={
                    announcement?.status === "ACTIVE"
                      ? "bg-green-300 py-2 px-3 rounded-full text-sm"
                      : "bg-red-300 py-2 px-3 rounded-full text-sm"
                  }
                >
                  {announcement?.status}
                </span>
                {announcement.status === "ACTIVE" ? (
                  <button
                    className="bg-red-300 py-2 px-3 rounded-full text-sm"
                    onClick={deactivate}
                  >
                    {loadingActivate ? "Deactivating . . ." : "Deactivate"}
                  </button>
                ) : (
                  <button
                    className="bg-green-300 py-2 px-3 rounded-full text-sm"
                    onClick={activate}
                  >
                    {loadingActivate ? "Activating . . ." : "Activate"}
                  </button>
                )}
              </div>
            </div>
            <p className="text-gray-700">{announcement?.announcement}</p>
          </div>
        ) : (
          <p className="text-gray-500 text-center">No announcement set</p>
        )}
      </div>
    </div>
  );
};

export default Page;
