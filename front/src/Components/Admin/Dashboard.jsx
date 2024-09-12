import { useContext } from "react";

import Loading from "../Common/Loading";
import { FaUsers, FaFile, FaDonate, FaMoneyBillWave } from "react-icons/fa";
import { GiStairsGoal } from "react-icons/gi";
import { StatsContext } from "../../Contexts/Stats";
import { TbDoorEnter } from "react-icons/tb";
import { FaShoppingCart, FaShoppingBag } from "react-icons/fa";
import { MdNoteAdd } from "react-icons/md";

const Dashboard = () => {
  const { stats } = useContext(StatsContext);

  console.log(stats);

  return (
    <>
      <h1 className="text-4xl mb-10">Dashboard</h1>
      {stats === null && <Loading />}
      {stats !== null && (
        <section>
          <div className="grid grid-cols-5 gap-6 text-grey">
            <div className="bg-white shadow-sm gap-4 p-10 rounded-lg">
              <div className="flex items-center gap-2 mb-4">
                <FaUsers className=" text-5xl" />
                <h3 className="text-xl uppercase">Users</h3>
              </div>
              <h2 className="text-3xl font-bold">{stats.countUsers}</h2>
            </div>

            <div className="bg-white shadow-sm gap-4 p-10 rounded-lg">
              <div className="flex items-center gap-2 mb-4">
                <FaShoppingBag className="text- text-5xl" />
                <h3 className="text-xl uppercase">Products</h3>
              </div>
              <h2 className="text-3xl font-bold">{stats.countProducts}</h2>
            </div>

            <div className="bg-white shadow-sm gap-4 p-10 rounded-lg">
              <div className="flex items-center gap-2 mb-4">
                <FaShoppingCart className="text-light text-5xl" />
                <h3 className="text-xl uppercase">Orders</h3>
              </div>
              <h2 className="text-3xl font-bold">{stats.countOrders}</h2>
            </div>

            <div className="bg-white shadow-sm gap-4 p-10 rounded-lg">
              <div className="flex items-center gap-2 mb-4">
                <FaUsers className="text-light text-5xl" />
                <h3 className="text-xl uppercase">items sold</h3>
              </div>
              <h2 className="text-3xl font-bold">{stats.totalQuantity}</h2>
            </div>

            <div className="bg-white shadow-sm gap-4 p-10 rounded-lg">
              <div className="flex items-center gap-2 mb-4">
                <FaMoneyBillWave className="text-light text-5xl" />
                <h3 className="text-xl uppercase">Profit</h3>
              </div>
              <h2 className="text-3xl font-bold">${stats.totalOrderAmount}</h2>
            </div>
          </div>
        </section>
      )}
    </>
  );
};
export default Dashboard;
