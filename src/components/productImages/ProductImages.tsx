import React, { useEffect, useState } from "react";
import type { Photo } from "../../types/Product";
import "./productImages.css";

type Props = {
	images: Photo[];
	selectedOption: string;
};

const ProductImages: React.FC<Props> = ({ images, selectedOption }) => {
	const [selected, setSelected] = useState(`${images[0].url}`);

	useEffect(() => {
		if (selectedOption) {
			const found = images.find((img) =>
				img.url.toLowerCase().includes(selectedOption.toLowerCase())
			);
			if (found) {
				setSelected(`${found.url}`);
			}
		}
	}, [selectedOption, images]);

	return (
		<div
			className={`productImagesContainer ${
				images.length === 1 ? "single" : ""
			}`}
		>
			<div className="productImagesTopContainer">
				<img src={selected} alt="Selected" className="productImagesImg" />

				{images.length > 1 && (
					<div className="productImagesTopArrContainer">
						{images.slice(0, 4).map((img, idx) => (
							<div
								key={idx}
								className={`productImagesSmallWrapper ${
									selected === `${img.url}` ? "active" : ""
								}`}
								onClick={() => setSelected(`${img.url}`)}
							>
								<img
									src={`${img.url}`}
									alt={`Thumbnail ${idx}`}
									className="productImagesSmall"
								/>
							</div>
						))}
					</div>
				)}
			</div>

			{images.length > 4 && (
				<div className="productImagesBottArrContainer">
					{images.slice(4).map((img, idx) => (
						<div
							key={idx}
							className={`productImagesSmallWrapper ${
								selected === `${img.url}` ? "active" : ""
							}`}
							onClick={() => setSelected(`${img.url}`)}
						>
							<img
								src={`${img.url}`}
								alt={`Thumbnail ${idx}`}
								className="productImagesSmall"
							/>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default ProductImages;
