import React, { useState } from 'react';
import {
	Form,
	Input,
	Button,
	Select,
	Cascader,
	DatePicker,
	Upload,
	Modal,
	Empty,
	Card,
	Typography,
	Tag,
	InputNumber
} from 'antd';
import { useMutation, useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import {
	UploadOutlined,
	PlusOutlined,
	LoadingOutlined
} from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';
import fetch from 'isomorphic-unfetch';
import swal from 'sweetalert';

import { ME, keySelectedProductEx } from './StockProducts';

const { Meta } = Card;
const { Title, Text } = Typography;

const ADD_STOCK_PRODUCT = gql`
	mutation ADD_STOCK_PRODUCT($id: ID!, $stock: Float!) {
		addStock(id: $id, stock: $stock) {
			id
			stock
			product {
				id
			}
			createdAt
		}
	}
`;

const ADD_STOCK_EDIT_PRODUCT = gql`
	mutation ADD_STOCK_EDIT_PRODUCT($id: ID!, $stockEdit: Float!) {
		addStockEdit(id: $id, stockEdit: $stockEdit) {
			id
			stockEdit
			stock {
				id
			}
			createdAt
		}
	}
`;

let loadingAddStockProduct = false;
let success = false;

const AddStockProduct = () => {
	let imageUrl = '';
	let productName = '';
	let productType = [];
	let productPrice = '';
	let productStock = '';
	let productSale = '';
	let productId = '';
	const [productInfo, setProductInfo] = useState({
		num_of_stock: '0'
	});

	//! Query Product ---------------------------------------------------------------------------------------------
	const { loading, error, data, refetch } = useQuery(ME, {
		onCompleted: async (data) => {},
		refetchQueries: [{ query: ME }],
		awaitRefetchQueries: true
	});
	refetch();

	if (data) {
		if (typeof keySelectedProductEx === 'number') {
			let stock = 0;
			let sold = 0;
			sold = data.user.shops[0].products[keySelectedProductEx].num_of_sold;
			for (
				let j = 0;
				j < data.user.shops[0].products[keySelectedProductEx].num_of_stock.length;
				j++
			) {
				stock =
					stock +
					data.user.shops[0].products[keySelectedProductEx].num_of_stock[j].stock;
			}

			// let typePro = [];
			// for (
			// 	let j = 0;
			// 	j < data.user.shops[0].products[keySelectedProductEx].type.length;
			// 	j++
			// ) {
			// 	typePro[j] = data.user.shops[0].products[keySelectedProductEx].type[j].type;
			// }

			// const lengthStock =
			// 	data.user.shops[0].products[keySelectedProductEx].num_of_stock.length - 1;
			// setProductInfo({
			// 	...productInfo,
			// 	stockEdit:
			// 		data.user.shops[0].products[keySelectedProductEx].num_of_stock[lengthStock]
			// 			.stock,
			// 	createdAt:
			// 		data.user.shops[0].products[keySelectedProductEx].num_of_stock[lengthStock]
			// 			.createdAt
			// });

			imageUrl = data.user.shops[0].products[keySelectedProductEx].imageUrl[0].imageUrl;
			productName = data.user.shops[0].products[keySelectedProductEx].name;
			productType = data.user.shops[0].products[keySelectedProductEx].type;
			productPrice = data.user.shops[0].products[keySelectedProductEx].price;
			productStock = stock - sold;
			productSale = sold;
			productId = data.user.shops[0].products[keySelectedProductEx].id.toString();
		}
	}

	//! Add Stock Product -----------------------------------------------------------------------------------------
	const [
		addStock,
		{ loading: loadingAddProductStock, error: errorAddProductStock }
	] = useMutation(ADD_STOCK_PRODUCT, {
		variables: {
			stock: +productInfo.num_of_stock,
			id: productId
		},
		onCompleted: async (data) => {
			if (data) {
				// await addStockEdit({
				// 	variables: {
				// 		id: data.addStock.id.toString(),
				// 		stockEdit: +productInfo.stockEdit,
				// 		createdAt: productInfo.createdAt
				// 	}
				// });
			}
			setProductInfo({
				num_of_stock: '0'
			});
		},
		refetchQueries: [{ query: ME }],
		awaitRefetchQueries: true
	});

	//! Add Stock Edit Product -----------------------------------------------------------------------------------------
	// const [
	// 	addStockEdit,
	// 	{ loading: loadingAddProductStockEdit, error: errorAddProductStockEdit }
	// ] = useMutation(ADD_STOCK_EDIT_PRODUCT, {
	// 	onCompleted: (data) => {
	// 		if (data) {
	// 		}
	// 	},
	// 	refetchQueries: [{ query: ME }],
	// 	awaitRefetchQueries: true
	// });

	//! Other ----------------------------------------------------------------------------------------------------------
	const handleChange = (e) => {
		setProductInfo({
			...productInfo,
			[e.target.name]: e.target.value
		});
	};

	let handleSubmit = async (e) => {
		try {
			if (
				+productInfo.num_of_stock !== 0 &&
				+productInfo.num_of_stock !== null
			) {
				loadingAddStockProduct = true;
				if (loadingAddStockProduct === true) {
					const uploadStock = await addStock();
					if (uploadStock) {
						setProductInfo({
							num_of_stock: '0'
						});
					}
				}
			} else {
				swal('', 'โปรดใส่จำนวนสินค้าในสต็อก', 'warning');
			}
		} catch (error) {
			console.log(error);
		}
		loadingAddStockProduct = false;
	};

	if (loadingAddStockProduct) {
		success = true;
		return (
			<p style={{ textAlign: 'center', marginTop: '200px' }}>
				<LoadingOutlined style={{ fontSize: '200px' }} />
				<p style={{ fontSize: '50px', fontWeight: 'bold' }}>Loading</p>
			</p>
		);
	}

	if (success && loadingAddStockProduct === false) {
		swal('เพิ่มสต็อกสินค้าเสร็จสิ้น', 'ขอให้สนุกกับการขาย', 'success');
		success = false;
	}

	return (
		<div>
			<link
				href="https://fonts.googleapis.com/css2?family=Mitr:wght@200;300;400;500;600;700&display=swap"
				rel="stylesheet"
			/>
			<link href="style/addStockProduct.css" rel="stylesheet" />
			<Form
				size="large"
				layout="inline"
				onFinish={handleSubmit}
				style={{
					position: 'relative'
				}}
			>
				<Form.Item>
					<Card
						className="card-add-stock-product-shadow"
						hoverable
						style={{ width: 300 }}
						cover={
							<img
								style={{ width: 300, height: 300 }}
								alt="example"
								src={imageUrl}
							/>
						}
						bodyStyle={{
							padding: '0px'
						}}
					/>
				</Form.Item>

				<Form style={{ width: '355px', position: 'absolute', right: 0 }}>
					<Form.Item>
						<Title level={4}>
							<Text mark>{productName}</Text>
						</Title>
					</Form.Item>

					<Form.Item
						style={{
							width: '100%'
						}}
					>
						{productType.map((prod) => (
							<Tag color="#33CC00">{prod.type}</Tag>
						))}
					</Form.Item>

					<Form.Item>
						<Text style={{ fontWeight: 600, fontSize: '18px', color: 'gray' }}>
							ราคา : {[' ']}
							<Text
								style={{ fontWeight: 700, fontSize: '18px', color: 'black' }}
							>
								{productPrice}
							</Text>
							{[' ']}บาท
						</Text>
					</Form.Item>

					<Form.Item>
						<Text style={{ fontWeight: 600, fontSize: '18px', color: 'gray' }}>
							ยอดขายเดือนที่ผ่านมา :{[' ']}
							<Text
								style={{ fontWeight: 700, fontSize: '18px', color: 'black' }}
							>
								{productSale}
							</Text>
							{[' ']}ชิ้น
						</Text>
					</Form.Item>
					<Form.Item>
						<Text style={{ fontWeight: 600, fontSize: '18px', color: 'gray' }}>
							ยอดขายเดือนนี้ :{[' ']}
							<Text
								style={{ fontWeight: 700, fontSize: '18px', color: 'black' }}
							>
								{productSale}
							</Text>
							{[' ']}ชิ้น
						</Text>
					</Form.Item>
					<Form.Item>
						<Text style={{ fontWeight: 600, fontSize: '18px', color: 'gray' }}>
							ขายไปแล้วทั้งหมด :{[' ']}
							<Text
								style={{ fontWeight: 700, fontSize: '18px', color: 'black' }}
							>
								{productSale}
							</Text>
							{[' ']}ชิ้น
						</Text>
					</Form.Item>
					<Form.Item>
						<Text style={{ fontWeight: 600, fontSize: '18px', color: 'gray' }}>
							ยอดสินค้าคงเหลือ :{[' ']}
							<Text
								style={{ fontWeight: 700, fontSize: '18px', color: 'black' }}
							>
								{productStock}
							</Text>
							{[' ']}ชิ้น
						</Text>
					</Form.Item>
				</Form>

				<Form.Item
					style={{
						width: '100%',
						marginTop: '236px',
						position: 'relative'
					}}
					rules={[
						{
							required: true,
							message: 'โปรดใส่จำนวนสินค้า'
						}
					]}
				>
					<Text
						style={{
							fontWeight: 600,
							fontSize: '18px',
							color: 'gray'
						}}
					>
						จำนวนสินค้าที่ต้องการเพิ่ม :{[' ']}
					</Text>
					<Input
						type="Number"
						name="num_of_stock"
						onChange={handleChange}
						value={productInfo.num_of_stock}
						style={{ width: '420px' }}
					/>
					<Text
						style={{
							fontWeight: 600,
							fontSize: '18px',
							color: 'gray',

							marginTop: '5px'
						}}
					>
						{[' ']}ชิ้น
					</Text>
				</Form.Item>

				<Form.Item
					style={{
						width: '100%',
						height: '100%'
					}}
				>
					<Button
						htmlType="submit"
						style={{
							width: '100%',
							height: '70px',
							margin: '20px 0px 20px 0px',
							background: 'linear-gradient(to right, #67b26b, #4ca2cb)',
							color: 'white',
							fontSize: '18px',
							fontWeight: '500'
						}}
					>
						เพิ่มสต็อกสินค้า
					</Button>
				</Form.Item>
			</Form>
		</div>
	);
};

export default AddStockProduct;
