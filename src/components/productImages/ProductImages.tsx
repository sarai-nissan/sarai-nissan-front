import React, { useState } from "react";
import "./productImages.css";

type Props = {
	images: string[];
};

const ProductImages: React.FC<Props> = ({ images }) => {
	const [selected, setSelected] = useState(images[1]);

	return (
		<div className="productImagesContainer">
			<div className="productImagesTopContainer">
				<img src={selected} alt="Selected" className="productImagesImg" />
				<div className="productImagesTopArrContainer">
					{images.slice(0, 4).map((img, idx) => (
						<img
							key={idx}
							src={img}
							alt={`Thumbnail ${idx}`}
							className="productImagesSmall"
							onClick={() => setSelected(img)}
						/>
					))}
				</div>
			</div>

			<div className="productImagesBottArrContainer">
				{images.slice(4).map((img, idx) => (
					<img
						key={idx}
						src={img}
						alt={`Thumbnail ${idx}`}
						className="productImagesSmall"
						onClick={() => setSelected(img)}
					/>
				))}
			</div>
		</div>
	);
};

export default ProductImages;
