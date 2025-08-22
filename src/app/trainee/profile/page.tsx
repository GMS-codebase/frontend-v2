"use client";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Skeleton } from "@mantine/core";
import { BsPerson } from "react-icons/bs";
import { HiOutlineMail } from "react-icons/hi";
import { MdPhoneAndroid } from "react-icons/md";
import { IoLockClosed } from "react-icons/io5";
import { getProfile } from "@/services";
import { notifications } from "@mantine/notifications";
import AuthService from "@/services/auth";

const TraineeProfile = () => {
  const dispatch = useDispatch();
  const profile = useSelector((state: any) => state.profile);
  const [activeSection, setActiveSection] = useState("contact");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    gender: "",
    position: "",
    institution: "",
  });

  // Password change state
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showPassword, setShowPassword] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  // Fetch profile data when component mounts
  useEffect(() => {
    getProfile(dispatch);
  }, [dispatch]);

  useEffect(() => {
    if (profile?.profile) {
      setFormData({
        firstName: profile.profile.firstname || "",
        lastName: profile.profile.lastname || "",
        email: profile.profile.email || "",
        phoneNumber: profile.profile.phone || "",
        gender: profile.profile.gender || "",
        position: profile.profile.position || "",
        institution: profile.profile.institution || "",
      });
    }
  }, [profile]);

  // Handle password change
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!passwordData.oldPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      notifications.show({
        title: "Validation Error",
        message: "All fields are required",
        color: "red",
      });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      notifications.show({
        title: "Validation Error",
        message: "New password and confirm password do not match",
        color: "red",
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      notifications.show({
        title: "Validation Error",
        message: "New password must be at least 6 characters long",
        color: "red",
      });
      return;
    }

    setPasswordLoading(true);
    try {
      await AuthService.changePassword({
        oldpassword: passwordData.oldPassword,
        newpassword: passwordData.newPassword,
        confirmpassword: passwordData.confirmPassword,
      });

      // Reset form
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      // Error is already handled by the service
      console.error("Password change error:", error);
    } finally {
      setPasswordLoading(false);
    }
  };

  if (profile?.loading) {
    return (
      <div className="w-full h-[105vh] p-5">
        <Skeleton height={180} radius="xl" className="mb-4" />
        <div className="w-full mt-20 flex gap-4">
          <div className="w-[60%]">
            <Skeleton height={50} radius="xl" className="mb-5" />
            <Skeleton height={30} radius="xl" className="mb-2" />
            <Skeleton height={30} radius="xl" className="mb-2" />
            <Skeleton height={30} radius="xl" className="mb-2" />
            <Skeleton height={50} radius="xl" className="mt-4" />
          </div>
          <div className="w-[50%] px-5">
            <Skeleton height="100%" radius="xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-2xl">
      <div className="w-full h-[180px] bg-[#000F23] rounded-t-2xl relative mb-20">
        <div className="absolute top-[60%] left-[4%]">
          <div className="flex items-end gap-3">
            <button className="mt-3 bg-white text-3xl text-primary p-4 rounded-full">
              <BsPerson className="w-[100px] h-[100px]" />
            </button>
            <div className="">
              <h1 className="lg:text-2xl text-xl text-white">
                {formData.firstName} {formData.lastName}
              </h1>
              <h1 className="font-bold text-primary">
                TRAINEE
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full flex gap-4 justify-center p-5">
        <div className="lg:w-[60%] w-full">
          <div className="flex mb-10 mt-5">
            <button
              className={`w-full text-center justify-center border-b-2 py-3 px-7 flex flex-row items-center gap-3 rounded-l-2xl ${
                activeSection === "contact"
                  ? "bg-[#005DE90A] border-b-[#005DE9] text-[#005DE9]"
                  : "bg-[#000F2303] text-black"
              }`}
              onClick={() => setActiveSection("contact")}
            >
              <h1 className="text-base font-medium">Contact Person</h1>
            </button>
            <button
              className={`w-full text-center justify-center border-b-2 py-3 px-7 flex flex-row items-center gap-3 ${
                activeSection === "employment"
                  ? "bg-[#005DE90A] border-b-[#005DE9] text-[#005DE9]"
                  : "bg-[#000F2303] text-black"
              }`}
              onClick={() => setActiveSection("employment")}
            >
              <h1 className="text-base font-medium">Employment</h1>
            </button>
            <button
              className={`w-full text-center justify-center border-b-2 py-3 px-7 flex flex-row items-center gap-3 rounded-r-2xl ${
                activeSection === "password"
                  ? "bg-[#005DE90A] border-b-[#005DE9] text-[#005DE9]"
                  : "bg-[#000F2303] text-black"
              }`}
              onClick={() => setActiveSection("password")}
            >
              <h1 className="text-base font-medium">Password</h1>
            </button>
          </div>

          {activeSection === "contact" ? (
            <div className="space-y-4">
              <div className="w-full">
                <label htmlFor="firstName" className="block text-xs font-bold text-gray-700">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  className="mt-1 block w-full pl-8 px-3 py-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  disabled
                />
              </div>

              <div className="w-full">
                <label htmlFor="lastName" className="block text-xs font-bold text-gray-700">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  className="mt-1 block w-full pl-8 px-3 py-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  disabled
                />
              </div>

              <div className="w-full">
                <label htmlFor="email" className="block text-xs font-bold text-gray-700">
                  Email
                </label>
                <div className="relative mt-1 rounded-full">
                  <div className="absolute inset-y-0 left-2 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">
                      <HiOutlineMail color="#000" size={21} />
                    </span>
                  </div>
                  <input
                    type="text"
                    name="email"
                    value={formData.email}
                    className="mt-1 block w-full pl-8 px-3 py-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    disabled
                  />
                </div>
              </div>

              <div className="w-full">
                <label htmlFor="phoneNumber" className="block text-xs font-bold text-gray-700">
                  Phone Number
                </label>
                <div className="relative mt-1 rounded-full">
                  <div className="absolute inset-y-0 left-2 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">
                      <MdPhoneAndroid color="#000" size={21} />
                    </span>
                  </div>
                  <div className="absolute left-7 top-1 pl-1 py-1 flex items-center pointer-events-none pr-2 rounded-md bg-white">
                    <span className="text-gray-500 text-sm ml-2">+250</span>
                  </div>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    className="block w-full pl-[6.5rem] pr-3 py-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    disabled
                  />
                </div>
              </div>

              <div className="w-full">
                <label htmlFor="gender" className="block text-xs font-bold text-gray-700">
                  Gender
                </label>
                <input
                  type="text"
                  name="gender"
                  value={formData.gender}
                  className="mt-1 block w-full px-3 py-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm capitalize"
                  disabled
                />
              </div>
            </div>
          ) : activeSection === "employment" ? (
            <div className="space-y-4">
              <div className="w-full">
                <label htmlFor="position" className="block text-xs font-bold text-gray-700">
                  Position
                </label>
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  placeholder="Type in your position"
                  className="mt-1 block w-full px-3 py-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  disabled
                />
              </div>

              <div className="w-full">
                <label htmlFor="department" className="block text-xs font-bold text-gray-700">
                  Department
                </label>
                <input
                  type="text"
                  name="department"
                  value={formData.institution}
                  placeholder="Type in your department"
                  className="mt-1 block w-full px-3 py-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  disabled
                />
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Change Password</h2>
                <p className="text-sm text-gray-600">Update your password to keep your account secure</p>
              </div>

              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div className="w-full">
                  <label htmlFor="oldPassword" className="block text-xs font-bold text-gray-700 mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                      <IoLockClosed className="text-gray-400" size={20} />
                    </div>
                    <input
                      type={showPassword.oldPassword ? "text" : "password"}
                      name="oldPassword"
                      value={passwordData.oldPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                      className="block w-full pl-10 pr-10 py-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Enter your current password"
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-3 flex items-center"
                      onClick={() => setShowPassword({ ...showPassword, oldPassword: !showPassword.oldPassword })}
                    >
                      <span className="text-gray-500 text-sm">
                        {showPassword.oldPassword ? "Hide" : "Show"}
                      </span>
                    </button>
                  </div>
                </div>

                <div className="w-full">
                  <label htmlFor="newPassword" className="block text-xs font-bold text-gray-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                      <IoLockClosed className="text-gray-400" size={20} />
                    </div>
                    <input
                      type={showPassword.newPassword ? "text" : "password"}
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      className="block w-full pl-10 pr-10 py-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Enter your new password"
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-3 flex items-center"
                      onClick={() => setShowPassword({ ...showPassword, newPassword: !showPassword.newPassword })}
                    >
                      <span className="text-gray-500 text-sm">
                        {showPassword.newPassword ? "Hide" : "Show"}
                      </span>
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters long</p>
                </div>

                <div className="w-full">
                  <label htmlFor="confirmPassword" className="block text-xs font-bold text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                      <IoLockClosed className="text-gray-400" size={20} />
                    </div>
                    <input
                      type={showPassword.confirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      className="block w-full pl-10 pr-10 py-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Confirm your new password"
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-3 flex items-center"
                      onClick={() => setShowPassword({ ...showPassword, confirmPassword: !showPassword.confirmPassword })}
                    >
                      <span className="text-gray-500 text-sm">
                        {showPassword.confirmPassword ? "Hide" : "Show"}
                      </span>
                    </button>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={passwordLoading}
                    className="w-full bg-[#005DE9] text-white py-3 px-6 rounded-2xl font-medium hover:bg-[#005DE9]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {passwordLoading ? "Changing Password..." : "Change Password"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Page = () => {
  return <TraineeProfile />;
};

export default Page;
