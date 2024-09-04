import { useContext } from "react";
import { AuthContext } from "../../Contexts/Auth";
import Header from "./Header";
import UserCartList from "./UserCartList";

const UserProfile = () => {
  const { user } = useContext(AuthContext);

  return (
    <>
      <Header />
      <div className="max-width">{user?.name}</div>
      <UserCartList />
    </>
  );
};
export default UserProfile;
