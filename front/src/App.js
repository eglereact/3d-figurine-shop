import DeleteModal from "./Components/Admin/DeleteModal";
import Msg from "./Components/Common/Msg";
import { Auth } from "./Contexts/Auth";
import { Loader } from "./Contexts/Loader";
import { Messages } from "./Contexts/Messages";
import { Modals } from "./Contexts/Modals";
import { Router } from "./Contexts/Router";
import LoaderContainer from "./Components/Common/Loader";
import AOS from "aos";
import "aos/dist/aos.css";

function App() {
  AOS.init();
  return (
    <Messages>
      <Loader>
        <Auth>
          <Modals>
            <Msg />
            <LoaderContainer />
            <DeleteModal />
            <Router />
          </Modals>
        </Auth>
      </Loader>
    </Messages>
  );
}

export default App;
