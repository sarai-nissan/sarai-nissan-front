import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./adminHeader.css";

type MenuItem = {
	label: string;
	action: () => void;
};

type Props = {
	title: string;
	showBackButton?: boolean;
	menuItems?: MenuItem[];
};

const AdminHeader: React.FC<Props> = ({
	title,
	menuItems = [],
	showBackButton = true,
}) => {
	const navigate = useNavigate();
	const [menuOpen, setMenuOpen] = useState(false);

	const backHandler = () => navigate(-1);

	const handleMenuClick = (action: () => void) => {
		action();
		setMenuOpen(false);
	};

	return (
		<div className="adminHeaderContainer">
			<div
				className="adminHeaderBackContainer"
				onClick={showBackButton ? backHandler : undefined}
			>
				{showBackButton && (
					<>
						<div className="adminHeaderBackLine" />
						<div className="adminHeaderBackLine" />
					</>
				)}
			</div>

			<p>{title}</p>

			{menuItems.length > 0 ? (
				<div className="adminHeaderMenuContainer">
					<div
						className="adminHeaderMenuDots"
						onClick={() => setMenuOpen((prev) => !prev)}
					>
						<span />
						<span />
						<span />
					</div>

					{menuOpen && (
						<div className="adminHeaderMenu">
							{menuItems.map((item, index) => (
								<button
									key={index}
									onClick={() => handleMenuClick(item.action)}
								>
									{item.label}
								</button>
							))}
						</div>
					)}
				</div>
			) : (
				<div className="adminHeaderEmpty" />
			)}
		</div>
	);
};

export default AdminHeader;
