import { useContext } from "react";
import { LoaderContext } from "../../Contexts/Loader";
import { GiDiceTwentyFacesTwenty } from "react-icons/gi";

export default function Loader() {
  const { show } = useContext(LoaderContext);

  if (!show) return null;
  return (
    <div className="flex items-center bg-gray-900/60 absolute z-50 justify-center w-full h-[100vh] text-gray-900 ">
      <div className="dice-container">
        <GiDiceTwentyFacesTwenty className="bouncing-dice" />
      </div>
    </div>
  );
}
