import React, { createContext, useContext, useState } from "react";
import type { FilterContextType } from "../types/FilterContextTypes";

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [selectedCategory, setSelectedCategory] = useState("all");

	return (
		<FilterContext.Provider value={{ selectedCategory, setSelectedCategory }}>
			{children}
		</FilterContext.Provider>
	);
};

export const useFilter = () => {
	const context = useContext(FilterContext);
	if (!context) {
		throw new Error("useFilter must be used within a FilterProvider");
	}
	return context;
};
