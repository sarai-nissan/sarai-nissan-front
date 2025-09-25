export type CategoryType = "All" | "Prints" | "Tarot & Oracle Decks";

export interface FilterContextType {
	selectedCategory: CategoryType;
	setSelectedCategory: (category: CategoryType) => void;
}
