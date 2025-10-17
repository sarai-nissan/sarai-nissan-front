import { createContext, useContext, useState } from "react";
import type { FilterContextType } from "../types/FilterContextTypes";
import type { CategoryType } from "../types/FilterContextTypes";

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [selectedCategory, setSelectedCategory] = useState<CategoryType>("All");

	return (
		<FilterContext.Provider
			value={{
				selectedCategory: selectedCategory.toLowerCase() as CategoryType,
				setSelectedCategory,
			}}
		>
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
