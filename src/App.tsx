import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FilterProvider } from "./contexts/FilterContext";
import Header from "./components/header/Header";
import HomePage from "./pages/HomePage";
import StorePage from "./pages/StorePage";
import "./styles/App.css";

function App() {
	return (
		<BrowserRouter>
			<FilterProvider>
				<div className="App">
					<Header />
					<Routes>
						<Route path="/" element={<HomePage />} />
						<Route path="/store" element={<StorePage />} />
					</Routes>
				</div>
			</FilterProvider>
		</BrowserRouter>
	);
}

export default App;
