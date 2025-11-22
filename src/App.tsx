import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";

import { useProductStore } from "./store/productStore";
import { useEventStore } from "./store/eventStore";
import { OrderProvider } from "./contexts/OrderContext";
import { BasketProvider } from "./contexts/BasketContext";
import { FilterProvider } from "./contexts/FilterContext";
import { OrdersProvider } from "./contexts/OrdersContext";

import HomePage from "./pages/home/HomePage";
import ShopPage from "./pages/shop/ShopPage";
import ProductPage from "./pages/product/ProductPage";
import CartPage from "./pages/cart/CartPage";
import CheckoutPage from "./pages/checkout/CheckoutPage";
import ConfirmationPage from "./pages/confirmation/ConfirmationPage";
import AboutPage from "./pages/about/AboutPage";
import ContactPage from "./pages/contact/ContactPage";
import EventPage from "./pages/Event/EventPage";
import AdminPage from "./pages/admin/adminHome/AdminPage";
import AdminProductsPage from "./pages/admin/adminProducts/AdminProductsPage";
import AdminSelectedProductPage from "./pages/admin/adminSelectedProductPage/AdminSelectedProductPage";
import AdminActualOrdersPage from "./pages/admin/adminActualOrders/AdminActualOrdersPage";
import AdminOrderPage from "./pages/admin/adminOrder/AdminOrderPage";
import AdminArchivedOrdersPage from "./pages/admin/adminArchivedOrders/AdminArchivedOrdersPage";
import AdminActualEventsPage from "./pages/admin/adminActualEvents/AdminActualEventsPage";
import AdminEvent from "./pages/admin/adminEvent/AdminEvent";

import Header from "./components/header/Header";
import "./styles/App.css";

const AppRoutes: React.FC = () => {
	const location = useLocation();
	const hideHeader =
		location.pathname === "/admin" ||
		location.pathname === "/admin/orders" ||
		location.pathname === "/admin/archived" ||
		location.pathname === "/admin/events" ||
		location.pathname === "/admin/products" ||
		location.pathname.startsWith("/admin/orders/") ||
		location.pathname.startsWith("/admin/events/") ||
		location.pathname.startsWith("/admin/products/");

	return (
		<div className="App">
			{!hideHeader && <Header />}
			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/shop" element={<ShopPage />} />
				<Route path="/product/:slug" element={<ProductPage />} />
				<Route path="/cart" element={<CartPage />} />
				<Route path="/checkout" element={<CheckoutPage />} />
				<Route path="/confirmation" element={<ConfirmationPage />} />
				<Route path="/about" element={<AboutPage />} />
				<Route path="/contact" element={<ContactPage />} />
				<Route path="/event" element={<EventPage />} />
				<Route path="/admin" element={<AdminPage />} />
				<Route path="/admin/products" element={<AdminProductsPage />} />
				<Route
					path="/admin/products/:documentId"
					element={<AdminSelectedProductPage />}
				/>
				<Route path="/admin/orders" element={<AdminActualOrdersPage />} />
				<Route path="/admin/orders/:orderId" element={<AdminOrderPage />} />
				<Route path="/admin/archived" element={<AdminArchivedOrdersPage />} />
				<Route path="/admin/events" element={<AdminActualEventsPage />} />
				<Route path="/admin/events/new" element={<AdminEvent />} />
				<Route path="/admin/events/:id" element={<AdminEvent />} />
			</Routes>
		</div>
	);
};

function App() {
	const { fetchProducts, checkProductUpdates } = useProductStore();
	const { fetchEvents } = useEventStore();

	useEffect(() => {
		fetchProducts();
		checkProductUpdates();
		fetchEvents();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<BrowserRouter>
			<BasketProvider>
				<OrderProvider>
					<FilterProvider>
						<OrdersProvider>
							<Analytics />
							<AppRoutes />
						</OrdersProvider>
					</FilterProvider>
				</OrderProvider>
			</BasketProvider>
		</BrowserRouter>
	);
}

export default App;
