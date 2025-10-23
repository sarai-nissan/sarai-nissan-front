import React from "react";
import "./skeleton.css";

type SkeletonProps = {
	width?: string | number;
	height?: string | number;
	borderRadius?: string | number;
	className?: string;
};

const Skeleton: React.FC<SkeletonProps> = ({
	width,
	height,
	borderRadius,
	className,
}) => {
	return (
		<div
			className={`skeleton ${className}`}
			style={{ width, height, borderRadius }}
		/>
	);
};

export default Skeleton;
