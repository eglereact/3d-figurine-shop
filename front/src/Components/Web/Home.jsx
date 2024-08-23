const Home = () => {
  return (
    <div className="flex gap-3 text-2xl flex-col">
      <h1 className="text-5xl">Welcome to 3d figurine shop!</h1>
      <div className="flex gap-3 text-2xl ">
        <a href="/#login" className="hover:underline hover:hover-text-light">
          Sign in
        </a>
        <a href="/#register" className="hover:underline hover:hover-text-light">
          Sign up
        </a>
      </div>
    </div>
  );
};
export default Home;
