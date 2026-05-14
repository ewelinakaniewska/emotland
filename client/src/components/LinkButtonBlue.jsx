import { Link } from "react-router-dom";

export default function ButtonBlue(props) {
  return (
    <Link to={props.route}
      className="
      lg:w-fit text-lg text-white text-center font-semibold 
      rounded-full py-4 px-5  px-7 lg:py-3 w-full cursor-pointer 
      block bg-blue-900 hover:bg-blue-950"
    >
      {props.text}
    </Link>
  );
}
