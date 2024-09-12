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
import { CartProvider } from "./Contexts/Cart";
import { Stats } from "./Contexts/Stats";

function App() {
  AOS.init();
  return (
    <Messages>
      <Loader>
        <Auth>
          <Modals>
            <Stats>
              <CartProvider>
                <Msg />
                <LoaderContainer />
                <DeleteModal />
                <Router />
              </CartProvider>
            </Stats>
          </Modals>
        </Auth>
      </Loader>
    </Messages>
  );
}

export default App;
