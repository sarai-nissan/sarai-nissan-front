import type { CategoryType } from "./FilterContextTypes";

interface ImageFormat {
	name: string;
	hash: string;
	ext: string;
	mime: string;
	path: string | null;
	width: number;
	height: number;
	size: number;
	sizeInBytes?: number;
	url: string;
}

export interface Photo {
	id: number;
	documentId: string;
	name: string;
	alternativeText: string | null;
	caption: string | null;
	hash: string;
	ext: string;
	mime: string;
	size: number;
	sizeInBytes?: number;
	url: string;
	previewUrl: string | null;
	provider: string;
	provider_metadata: any | null;
	createdAt: string;
	updatedAt: string;
	publishedAt: string;
	width: number;
	height: number;
	formats?: {
		thumbnail?: ImageFormat;
		small?: ImageFormat;
		medium?: ImageFormat;
		large?: ImageFormat;
	};
}

export type ProductDropdown = {
	label: string;
	price?: string;
};

export type ProductType = {
	id: number;
	documentId: string;
	name: string;
	description?: string;
	category: CategoryType[];
	dropdownTitle?: string;
	dropdown?: ProductDropdown[];
	enumeration?: string[];
	size?: string;
	price: string;
	photo: Photo[];
	note1?: string;
	note2?: string | null;
	warning?: string;
	sold?: boolean;
	createdAt: string;
	updatedAt: string;
	publishedAt: string;
};
