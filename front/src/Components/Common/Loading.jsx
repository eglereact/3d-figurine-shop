import { FaDiceD20 } from "react-icons/fa";

const Loading = () => {
  return (
    <>
      <h1 className="text-3xl py-6 ml-6  text-grey font-bold flex items-center">
        <FaDiceD20 size={25} /> <span className="ml-2">Loading</span>
        <span className="dot-1">.</span>
        <span className="dot-2">.</span>
        <span className="dot-3">.</span>
      </h1>
    </>
  );
};

export default Loading;
