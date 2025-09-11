import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FilterProvider } from "./contexts/FilterContext";
import Header from "./components/header/Header";
import HomePage from "./pages/HomePage";
import ShopPage from "./pages/ShopPage";
import CartPage from "./pages/CartPage";
import "./styles/App.css";

function App() {
	return (
		<BrowserRouter>
			<FilterProvider>
				<div className="App">
					<Header />
					<Routes>
						<Route path="/" element={<HomePage />} />
						<Route path="/shop" element={<ShopPage />} />
						<Route path="/cart" element={<CartPage />} />
					</Routes>
				</div>
			</FilterProvider>
		</BrowserRouter>
	);
}

export default App;
