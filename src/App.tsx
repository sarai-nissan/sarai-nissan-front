import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import "./styles/App.css";

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
						<div className="App">
							<Header />
							<Routes>
								<Route path="/" element={<HomePage />} />
								<Route path="/shop" element={<ShopPage />} />
								<Route path="/product/:slug" element={<ProductPage />} />
								<Route path="/cart" element={<CartPage />} />
								<Route path="/checkout" element={<CheckoutPage />} />
							</Routes>
						</div>
					</FilterProvider>
				</OrderProvider>
			</BasketProvider>
		</BrowserRouter>
	);
}

export default App;
