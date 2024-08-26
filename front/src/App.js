import Msg from "./Components/Common/Msg";
import { Auth } from "./Contexts/Auth";
import { Loader } from "./Contexts/Loader";
import { Messages } from "./Contexts/Messages";
import { Router } from "./Contexts/Router";

function App() {
  return (
    <Messages>
      <Loader>
        <Auth>
          <Msg />
          <Router />
        </Auth>
      </Loader>
    </Messages>
  );
}

export default App;
