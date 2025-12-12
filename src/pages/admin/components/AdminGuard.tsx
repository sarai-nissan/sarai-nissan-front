import { Navigate, Outlet } from "react-router-dom";

const AdminGuard: React.FC = () => {
	const isLogged = localStorage.getItem("isLogged") === "true";

	if (!isLogged) {
		return <Navigate to="/admin" replace />;
	}

	return <Outlet />;
};

export default AdminGuard;
