import React from "react";
import Logo from "../../assets/logo.svg";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import InsertInvitationIcon from "@mui/icons-material/InsertInvitation";
import { Link, NavLink, Outlet } from "react-router-dom";

export const Root: React.FC = () => {
  return (
    <div className="h-3">
      <header className="sticky p-2 bg-blue-500">
        <Link to="/">
          <img src={Logo} alt="Logo" className="h-8" />
        </Link>
      </header>
      <main className="flex divide-x-2 h-screen">
        <ol className="p-2 space-y-2">
          <li>
            <NavLink
              className="flex space-x-2"
              style={({ isActive }) => (isActive ? { color: "#225ba3" } : {})}
              to="/appointments"
            >
              <InsertInvitationIcon /> <span>Appointments</span>
            </NavLink>
          </li>
          <hr />
          <li>
            <NavLink
              className="flex space-x-2"
              style={({ isActive }) => (isActive ? { color: "#225ba3" } : {})}
              to="/appointment/new"
            >
              <ControlPointIcon />
              <span>Book Appointments</span>
            </NavLink>
          </li>
        </ol>
        <Outlet />
      </main>
    </div>
  );
};

export default Root;
