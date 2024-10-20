import { Link } from "react-router-dom";

export default function Header() {
  return (
    <>
      <Link to="/power-map/">Power Map</Link> |&nbsp;
      <Link to="/power-map/about">About</Link>
    </>
  );
}
