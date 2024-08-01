import * as Icons from "@/components/core/icons";
const Navbar = () => {
  return (
    <div className="w-full flex items-center justify-between py-6 bg-white rounded-2xl px-5">
      <h1 className="text-xl font-extrabold text-primary">Dashboard</h1>
      <div className="flex items-center gap-3">
        <button className="text-3xl text-primary bg-[#005DE905] p-3 rounded-full">
          <Icons.SolarUserBold />
        </button>
        <h1 className="text-xl font-medium">Ishema Hugues</h1>
      </div>
    </div>
  );
};

export default Navbar;
