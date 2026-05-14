import { Link } from "react-router-dom";
export default function ButtonAmber(props) {

  return (
    <Link to={props.route}
      className={`
      lg:w-fit text-lg text-white text-center font-semibold 
      rounded-full py-4 px-7 lg:py-3  w-full cursor-pointer block 
      bg-amber-600 hover:bg-amber-700
      ${props.className}
      `}
    >
      {props.text}
    </Link>
  );
}
