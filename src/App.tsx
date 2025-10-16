import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useProductStore } from "./store/productStore";
import { OrderProvider } from "./contexts/OrderContext";
import { BasketProvider } from "./contexts/BasketContext";
import { FilterProvider } from "./contexts/FilterContext";
import Header from "./components/header/Header";
import HomePage from "./pages/HomePage";
import ShopPage from "./pages/ShopPage";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import ConfirmationPage from "./pages/ConfirmationPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import AdminPage from "./pages/AdminPage";
import "./styles/App.css";

const AppRoutes: React.FC = () => {
	const location = useLocation();
	const hideHeader = location.pathname === "/admin";

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
				<Route path="/admin" element={<AdminPage />} />
			</Routes>
		</div>
	);
};

function App() {
	const { fetchProducts } = useProductStore();

	useEffect(() => {
		fetchProducts();
	}, [fetchProducts]);

	return (
		<BrowserRouter>
			<BasketProvider>
				<OrderProvider>
					<FilterProvider>
						<AppRoutes />
					</FilterProvider>
				</OrderProvider>
			</BasketProvider>
		</BrowserRouter>
	);
}

export default App;
