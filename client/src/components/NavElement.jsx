import { NavLink } from "react-router-dom";

export default function NavElement(props) {
  return (
    <li>
      <NavLink
        to={props.route}
        className={({ isActive }) =>
          `p-5 text-2xl tracking-wide block hover:bg-amber-600 hover:text-white hover:font-bold 
           lg:text-xl lg:hover:text-amber-600 lg:hover:bg-white  ${
           isActive ? "text-blue-900 font-bold lg:hover:font-bold" : "lg:hover:font-normal"}`
        }
        end
      >
        {props.text}
      </NavLink>
    </li>
  );
}
