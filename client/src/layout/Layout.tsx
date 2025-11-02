import { Outlet } from "react-router-dom";
const Layout = () => {
  return (
    <div className="centered-box-container">
      <Outlet />
    </div>
  );
};

export default Layout;
