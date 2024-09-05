import { useContext } from "react";
import { AuthContext } from "../../Contexts/Auth";
import Header from "./Header";
import UserCartList from "./UserCartList";
import Footer from "./Footer";

const UserProfile = () => {
  const { user } = useContext(AuthContext);

  return (
    <>
      <Header />
      <div className="max-width">
        <div className="text-grey pl-6">
          <h3 className="uppercase text-3xl ">user profile</h3>
          <p className="py-2 text-xl">
            <span className="uppercase pr-2">name:</span>
            {user?.name}
          </p>
          <p className="py-2 text-xl">
            <span className="uppercase pr-2">email:</span>
            {user?.email}
          </p>
        </div>
      </div>
      <UserCartList />
      <Footer />
    </>
  );
};
export default UserProfile;
