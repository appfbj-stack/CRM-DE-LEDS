import { Link, NavLink } from "react-router-dom";
import { APP_NAME } from "../config";

type HeaderProps = {
  title: string;
  actionLabel?: string;
  actionTo?: string;
};

export function Header({ title, actionLabel, actionTo }: HeaderProps) {
  return (
    <header className="app-header">
      <div>
        <p className="eyebrow">{APP_NAME}</p>
        <h1>{title}</h1>
      </div>
      {actionLabel && actionTo ? (
        <Link className="primary-button" to={actionTo}>
          {actionLabel}
        </Link>
      ) : null}
      <nav className="bottom-nav">
        <NavLink to="/" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
          Lista
        </NavLink>
        <NavLink
          to="/funil"
          className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
        >
          Funil
        </NavLink>
      </nav>
    </header>
  );
}
