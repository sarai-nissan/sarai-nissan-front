import {
	createContext,
	useContext,
	useEffect,
	useState,
	type ReactNode,
} from "react";
import { getAllOrders, setOrderArchived } from "../api";
import type { Order } from "../types/AdminPage";

type OrdersContextType = {
	orders: Order[];
	loading: boolean;
	error: string | null;
	refreshOrders: () => Promise<void>;
	archiveOrder: (id: number) => Promise<void>;
	unarchiveOrder: (id: number) => Promise<void>;
};

const OrdersContext = createContext<OrdersContextType>({
	orders: [],
	loading: true,
	error: null,
	refreshOrders: async () => {},
	archiveOrder: async () => {},
	unarchiveOrder: async () => {},
});

export const OrdersProvider = ({ children }: { children: ReactNode }) => {
	const [orders, setOrders] = useState<Order[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const loadOrders = async () => {
		try {
			setLoading(true);
			setError(null);

			const sortedOrders = await getAllOrders();
			setOrders(sortedOrders);
		} catch (err: any) {
			console.error(err);
			setError(err.message || "Error loading orders");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadOrders();

		const handleOrderUpdate = (
			e: CustomEvent<{ id: number | string; archived: boolean }>
		) => {
			const { id, archived } = e.detail;
			setOrders((prev) =>
				prev.map((o) =>
					o.id === id || o.documentId === id ? { ...o, archived } : o
				)
			);
		};

		window.addEventListener("orderUpdated", handleOrderUpdate as EventListener);

		return () => {
			window.removeEventListener(
				"orderUpdated",
				handleOrderUpdate as EventListener
			);
		};
	}, []);

	const archiveOrder = async (id: number) => {
		try {
			setOrders((prev) =>
				prev.map((order) =>
					order.id === id ? { ...order, archived: true } : order
				)
			);

			await setOrderArchived(id, true);
		} catch (err) {
			console.error("Failed to archive order:", err);
		}
	};

	const unarchiveOrder = async (id: number) => {
		try {
			setOrders((prev) =>
				prev.map((order) =>
					order.id === id ? { ...order, archived: false } : order
				)
			);

			await setOrderArchived(id, false);
		} catch (err) {
			console.error("Failed to unarchive order:", err);
		}
	};

	return (
		<OrdersContext.Provider
			value={{
				orders,
				loading,
				error,
				refreshOrders: loadOrders,
				archiveOrder,
				unarchiveOrder,
			}}
		>
			{children}
		</OrdersContext.Provider>
	);
};

export const useOrders = () => useContext(OrdersContext);
