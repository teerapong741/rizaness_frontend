import React from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { Card, Rate } from 'antd';

import PageLayout from '../../components/PageLayout';
import { route } from 'next/dist/next-server/server/router';

const QUERY_PRODUCT = gql`
	query QUERY_PRODUCT($id: ID!) {
		product(id: $id) {
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
			}
			createdAt
		}
	}
`;

const ProductPage = () => {
	const route = useRouter();

	const { data, error, loading } = useQuery(QUERY_PRODUCT, {
		variables: { id: route.query.productId }
	});

	if (error) return <p>Something went wrong, please try again.</p>;

	if (loading) return <p>Loading...</p>;

	return (
		<PageLayout>
			<link
				href="https://fonts.googleapis.com/css2?family=Mitr:wght@200;300;400;500;600;700&display=swap"
				rel="stylesheet"
			/>
			<link rel="stylesheet" href="HomePage.css" />
			<div className="font-mitr container-product-detail-front">
				<Card
					className="card-product-shadow"
					style={{
						width: 550,
						height: 550,
						border: 'none',
						padding: '0px 0px 0px 10px',
						borderRadius: '10px'
					}}
					bodyStyle={{
						padding: '0px'
					}}
					cover={
						<>
							<div className="container-picture-detail-grid">
								{data.product.imageUrl.slice(0, 1).map((prodImages) => (
									<a>
										<img
											src={prodImages.imageUrl}
											alt={data.product.name}
											className="picture-detail"
										/>
									</a>
								))}
								<div className="picture-sub-container">
									{data.product.imageUrl.map((prod) => (
										<div className="picture-detail-grid">
											<div className="picture-detail-small">
												<img src={prod.imageUrl} />
											</div>
										</div>
									))}
								</div>
							</div>
						</>
					}
				></Card>
			</div>
		</PageLayout>
	);
};

export default ProductPage;
