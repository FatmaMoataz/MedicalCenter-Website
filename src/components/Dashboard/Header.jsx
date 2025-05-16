import { Link } from "react-router-dom";

const DashboardHeader = () => {
  return (
    <div className="bg-gray-700 text-white p-4">
      <Link to={"/appointment"}>
        <button className=" bg-green-500 px-4 py-2 rounded block ms-auto">
          + ADD APPOINTMENT
        </button>
      </Link>
    </div>
  );
};

export default DashboardHeader;
