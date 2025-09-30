import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useProductStore } from "./store/productStore";
import { FilterProvider } from "./contexts/FilterContext";
import Header from "./components/header/Header";
import HomePage from "./pages/HomePage";
import ShopPage from "./pages/ShopPage";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import "./styles/App.css";

function App() {
	const { fetchProducts } = useProductStore();

	useEffect(() => {
		fetchProducts();
	}, [fetchProducts]);

	return (
		<BrowserRouter>
			<FilterProvider>
				<div className="App">
					<Header />
					<Routes>
						<Route path="/" element={<HomePage />} />
						<Route path="/shop" element={<ShopPage />} />
						<Route path="/product/:id" element={<ProductPage />} />
						<Route path="/cart" element={<CartPage />} />
					</Routes>
				</div>
			</FilterProvider>
		</BrowserRouter>
	);
}

export default App;
