import DeleteModal from "./Components/Admin/DeleteModal";
import Msg from "./Components/Common/Msg";
import { Auth } from "./Contexts/Auth";
import { Loader } from "./Contexts/Loader";
import { Messages } from "./Contexts/Messages";
import { Modals } from "./Contexts/Modals";
import { Router } from "./Contexts/Router";

function App() {
  return (
    <Messages>
      <Loader>
        <Auth>
          <Modals>
            <Msg />
            <DeleteModal />
            <Router />
          </Modals>
        </Auth>
      </Loader>
    </Messages>
  );
}

export default App;
