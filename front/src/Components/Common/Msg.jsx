import { useContext } from "react";
import { MessagesContext } from "../../Contexts/Messages";

const Msg = () => {
  const { msg, remMessage } = useContext(MessagesContext);

  if (msg.length === 0) {
    return null;
  }

  return (
    <div>
      {msg.map((m) => (
        <div key={m.id}>
          <div>
            {m.type === "error" && <span>!</span>}
            {m.type === "info" && <span className="">?</span>}
            {m.type === "success" && <span>✔</span>}
            <strong className="me-auto">{m.title}</strong>
            <button onClick={() => remMessage(m.id)}>
              <span className="icon solid fa-times"></span>
            </button>
          </div>
          <div>{m.text}</div>
        </div>
      ))}
    </div>
  );
};
export default Msg;
