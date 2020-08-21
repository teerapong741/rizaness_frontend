import React from 'react';
import { Card, Rate } from 'antd';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import Link from 'next/link';

import PageLayout from '../../components/PageLayout';

const QUERY_PRODUCTS = gql`
	query {
		products {
			id
			name
			type
			description
			imageUrl {
				id
				imageUrl
				createdAt
			}
			price
			discountType
			discount
			num_of_sold
			num_put_basket_now
			num_put_basket
			user {
				id
				username
				address {
					id
				}
				products {
					id
				}
			}
			status_show {
				id
				status
				product {
					id
				}
				createdAt
			}
			status_product {
				id
				status
				product {
					id
				}
				createdAt
			}
			mem_point
			dis_point
			SKU
			createdAt
		}
	}
`;

const ProductsPage = () => {
	const { data, loading, error } = useQuery(QUERY_PRODUCTS, {
		pollInterval: 10000
	});

	if (error)
		return <p>Ooobs...something went wrong, please try again later.</p>;

	if (loading) return <p>Loading...</p>;

	return (
		<PageLayout>
			<link
				href="https://fonts.googleapis.com/css2?family=Mitr:wght@200;300;400;500;600;700&display=swap"
				rel="stylesheet"
			/>
			<link rel="stylesheet" href="HomePage.css" />
			<div className="container-product-front">
				{data.products.map((prod) => (
					<div key={prod.id} className="font-mitr content-product-front">
						<Card
							className="card-product-shadow"
							style={{
								width: 240,
								border: 'none',
								paddingLeft: '1px',
								borderRadius: '10px'
							}}
							bodyStyle={{
								paddingLeft: '10px',
								paddingBottom: '10px',
								paddingRight: '0px',
								paddingTop: '5px'
							}}
							cover={
								<Link href="/products/[productId]" as={`/products/${prod.id}`}>
									<a>
										{prod.imageUrl.slice(0, 1).map((prodImages) => (
											<img
												src={prodImages.imageUrl}
												alt={prod.name}
												width="240"
												height="250"
											/>
										))}
									</a>
								</Link>
							}
						>
							<h3 className="nameProductOnCard">{prod.name}</h3>
							<h4 className="priceProductOnCard">{prod.price}.00 THB</h4>
							<div className="container-grid-discount">
								<h5 className="discountTHB">{prod.discount}.00 THB</h5>
								<h5 className="discountPercent">{prod.discount}%</h5>
							</div>
							<Rate style={{ fontSize: 12 }} />
							<span
								style={{
									fontSize: '10px',
									fontWeight: '700',
									paddingLeft: '10px'
								}}
							>
								ขายไปแล้ว {prod.num_of_sold} ชิ้น
							</span>
							<img
								src="images/supermarket.png"
								className="button-add-to-card"
							/>
						</Card>
					</div>
				))}
			</div>
		</PageLayout>
	);
};

export default ProductsPage;
