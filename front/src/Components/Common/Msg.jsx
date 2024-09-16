import { useContext } from "react";
import { MessagesContext } from "../../Contexts/Messages";
import { CiCircleRemove } from "react-icons/ci";
import { BsInfoLg } from "react-icons/bs";
import { IoAlert } from "react-icons/io5";
import { MdCheck } from "react-icons/md";

const Msg = () => {
  const { msg, remMessage, clearAllMessages } = useContext(MessagesContext);

  if (msg.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-8 right-8 z-10 flex flex-col gap-2">
      {msg.map((m) => (
        <div
          key={m.id}
          data-aos="fade-left"
          data-aos-duration="600"
          className="bg-white shadow-md p-3 rounded relative"
        >
          <div className=" py-1 items-center gap-3 min-w-64 flex justify-between">
            <div className="flex gap-2 items-center">
              {m.type === "error" && (
                <span className="text-brown bg-pink p-2 rounded-full">
                  <IoAlert size={20} />
                </span>
              )}
              {m.type === "info" && (
                <span className="text-grey bg-blue-100 p-2 rounded-full">
                  <BsInfoLg size={20} />
                </span>
              )}
              {m.type === "success" && (
                <span className="text-grey bg-green-100 p-2 rounded-full ">
                  <MdCheck size={20} />
                </span>
              )}
              <a
                href={m.url}
                onClick={() => clearAllMessages()}
                className="py-1 text-grey capitalize"
              >
                {m.text}
              </a>
            </div>
            <button
              type="button"
              className="text-grey"
              onClick={() => remMessage(m.id)}
            >
              <CiCircleRemove size={24} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
export default Msg;
