import React, { useState, useCallback, useEffect } from 'react';
import {
	Tabs,
	Table,
	Tag,
	Space,
	Button,
	Input,
	Popover,
	Drawer,
	Radio,
	Empty,
	Badge,
	Dropdown,
	Popconfirm
} from 'antd';
import Highlighter from 'react-highlight-words';
import {
	SearchOutlined,
	EditFilled,
	DeleteFilled,
	LoadingOutlined,
	DownOutlined,
	PlusSquareFilled
} from '@ant-design/icons';
import { useQuery, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { AuthContext } from '../../../appState/AuthProvider';
import AddProduct from './AddProduct';
import AddStockProduct from './AddStockProduct';
import EditProduct from './EditProduct';
import ViewProduct from './ViewProduct';
import { type } from 'jquery';

const { TabPane } = Tabs;

export const ME = gql`
	query ME {
		user {
			id
			shops {
				id
				products {
					id
					name
					type {
						id
						type
						# product {
						# 	name
						# }
						createdAt
					}
					description
					imageUrl {
						id
						imageUrl
						# product {
						# 	name
						# }
						createdAt
					}
					price
					min_of_stock
					num_of_stock {
						id
						stock
						price
						cost
						statusExpiration
						Expiration
						stockEdit {
							id
							stockEdit
							priceEdit
							costEdit
							statusExpirationEdit
							ExpirationEdit
							stock {
								stock
							}
							createdAt
						}
						# product {
						# 	name
						# }
						createdAt
					}
					discountType
					discount
					discountTimeStart
					discountTimeEnd
					num_of_sold
					num_put_basket_now
					num_put_basket
					user {
						username
					}
					status_show {
						id
						status
						# product {
						# 	name
						# }
						createdAt
					}
					status_product {
						id
						status
						# product {
						# 	name
						# }
						createdAt
					}
					mem_point
					dis_point
					productWholeSale {
						id
						price
						min_sale
						max_sale
						product {
							name
						}
						createdAt
					}
					SKU
					ParentSKU
					createdAt
				}
			}
		}
	}
`;

const DELETE_PRODUCT = gql`
	mutation DELETE_PRODUCT($idPro: ID!, $idShop: ID!) {
		deleteProduct(idPro: $idPro, idShop: $idShop) {
			id
			name
		}
	}
`
export let keySelectedProductEx = 0;
// let loadingQueryProduct = true;

const StockProducts = () => {
	let dataProduct = [];
	const [dataProductState, setDataProductState] = useState(false);
	const [key, setKey] = useState('1');
	const [searchText, setSearchText] = useState('');
	const [searchedColumn, setSearchedColumn] = useState('');
	let [filteredInfo, setFilteredInfo] = useState(null);
	let [sortedInfo, setSortedInfo] = useState(null);
	const [selectedRowKeys, setSelectedRowKeys] = useState([]);
	const [loadingBottomDelete, setLoadingBottomDelete] = useState(false);
	const [editPro, setEditPro] = useState('');
	const [deletePro, setDeletePro] = useState('');
	const [visibleAddProduct, setVisibleAddProduct] = useState(false);
	const [visibleAddStockProduct, setVisibleAddStockProduct] = useState(false);
	const [visibleEditProduct, setVisibleEditProduct] = useState(false);
	const [visibleViewProduct, setVisibleViewProduct] = useState(false);
	const [keySelectedProduct, setKeySelectedProduct] = useState(null);
	keySelectedProductEx = keySelectedProduct;
	let searchInput;

	const { data, loading, error, refetch } = useQuery(ME, {
		onCompleted: (data) => {
		}
	});
	refetch();

	if (data) {
		if (data.user.shops && data.user.shops[0] && data.user.shops[0].products) {
			for (let i = 0; i < data.user.shops[0].products.length; i++) {
				let typePro = [];
				let stockLength = 0;
				let stock = 0;
				let sold = 0;
				let statusShow = []
				let statusPro = []

				for (let j = 0; j < data.user.shops[0].products[i].type.length; j++) {
					typePro[j] = data.user.shops[0].products[i].type[j].type;
				}
				stockLength = data.user.shops[0].products[i].num_of_stock.length - 1;

				// console.log('1-->', dataStock);
				sold = data.user.shops[0].products[i].num_of_sold;
				for (let j = 0; j < data.user.shops[0].products[i].num_of_stock.length; j++) {
					stock = stock + data.user.shops[0].products[i].num_of_stock[j].stock;
				}

				for (let j=0; j<data.user.shops[0].products[i].status_product.length; j++){
					statusPro.push(data.user.shops[0].products[i].status_product[j].status)
				}

				for (let j=0; j<data.user.shops[0].products[i].status_show.length; j++){
					statusShow.push(data.user.shops[0].products[i].status_show[j].status)
				}

				dataProduct.push({
					key: i,
					name: data.user.shops[0].products[i].name,
					type: typePro,
					description: data.user.shops[0].products[i].description,
					imageUrl: data.user.shops[0].products[i].imageUrl[0].imageUrl,
					price: data.user.shops[0].products[i].price,
					num_of_stock: stock - sold,
					discountType: data.user.shops[0].products[i].discountType,
					discount: data.user.shops[0].products[i].discount,
					discountTimeStart: data.user.shops[0].products[i].discountTimeStart,
					discountTimeEnd: data.user.shops[0].products[i].discountTimeEnd,
					num_of_sold: data.user.shops[0].products[i].num_of_sold,
					num_put_basket_now: data.user.shops[0].products[i].num_put_basket_now,
					num_put_basket: data.user.shops[0].products[i].num_put_basket,
					traffic: data.user.shops[0].products[i].traffic,
					status_show: statusShow,
					status_product: statusPro,
					mem_point: data.user.shops[0].products[i].mem_point,
					dis_point: data.user.shops[0].products[i].dis_point,
					SKU: data.user.shops[0].products[i].SKU,
					ParentSKU: data.user.shops[0].products[i].ParentSKU,
					createdAt: data.user.shops[0].products[i].createdAt
				});
			}
		} else {
			dataProduct = []
		}
	}

	const start = () => {
		setLoadingBottomDelete(true);
		// ajax request after empty completing
		setTimeout(() => {
			setSelectedRowKeys([]);
			setLoadingBottomDelete(false);
		}, 1000);
	};

	const onSelectChange = (selectedRowKeys) => {
		console.log('selectedRowKeys changed: ', selectedRowKeys);
		setSelectedRowKeys(selectedRowKeys);
	};

	const handleChange = (pagination, filters, sorter) => {
		// console.log('Various parameters', pagination, filters, sorter);
		setFilteredInfo(filters);
		setSortedInfo(sorter);
	};

	const clearFilters = () => {
		setFilteredInfo({ filteredInfo: null });
	};

	const clearAll = () => {
		setFilteredInfo(null);
		setSortedInfo(null);
	};

	const getColumnSearchProps = (dataIndex) => ({
		filterDropdown: ({
			setSelectedKeys,
			selectedKeys,
			confirm,
			clearFilters
		}) => (
			<div style={{ padding: 8 }}>
				<Input
					ref={(node) => {
						searchInput = node;
					}}
					placeholder={`Search ${dataIndex}`}
					value={selectedKeys[0]}
					onChange={(e) =>
						setSelectedKeys(e.target.value ? [e.target.value] : [])
					}
					onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
					style={{ width: 188, marginBottom: 8, display: 'block' }}
				/>
				<Space>
					<Button
						type="primary"
						onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
						icon={<SearchOutlined />}
						size="small"
						style={{ width: 90 }}
					>
						Search
					</Button>
					<Button
						onClick={() => handleReset(clearFilters)}
						size="small"
						style={{ width: 90 }}
					>
						Reset
					</Button>
				</Space>
			</div>
		),
		filterIcon: (filtered) => (
			<SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
		),
		onFilter: (value, record) =>
			record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
		onFilterDropdownVisibleChange: (visible) => {
			if (visible) {
				setTimeout(() => searchInput.select());
			}
		},
		render: (text) =>
			searchedColumn === dataIndex ? (
				<Highlighter
					highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
					searchWords={[searchText]}
					autoEscape
					textToHighlight={text.toString()}
				/>
			) : (
				text
			)
	});

	const handleSearch = (selectedKeys, confirm, dataIndex) => {
		confirm();
		setSearchText(selectedKeys[0]);
		setSearchedColumn(dataIndex);
	};

	const handleReset = (clearFilters) => {
		clearFilters();
		setSearchText('');
	};

	//! Setting Drawer Product
	const onOpenDrawerAddProduct = () => {
		setVisibleAddProduct(true);
	};

	const onCloseDrawerAddProduct = () => {
		setVisibleAddProduct(false);
	};

	const onOpenDrawerAddStockProduct = (key) => {
		setVisibleAddStockProduct(true);
		setKeySelectedProduct(key);
	};

	const onCloseDrawerAddStockProduct = (key) => {
		setVisibleAddStockProduct(false);
		setKeySelectedProduct(key);
	};
	const onOpenDrawerEditProduct = (key) => {
		setVisibleEditProduct(true);
		setKeySelectedProduct(key);
	};

	const onCloseDrawerEditProduct = (key) => {
		setVisibleEditProduct(false);
		setKeySelectedProduct(key);
	};

	const onOpenDrawerViewProduct = (key) => {
		setVisibleViewProduct(true);
		setKeySelectedProduct(key);
	};

	const onCloseDrawerViewProduct = (key) => {
		setVisibleViewProduct(false);
		setKeySelectedProduct(key);
	};
	//! Setting Drawer Product
	const rowSelection = {
		selectedRowKeys,
		onChange: onSelectChange
	};

	const hasSelected = selectedRowKeys.length > 0;
	sortedInfo = sortedInfo || {};
	filteredInfo = filteredInfo || {};

	const handleDeleteProduct = (key) => {
		const dataSource = [...dataProduct];
		dataProduct = dataSource.filter((item) => item.key !== key);
		setDataProductState(!dataProductState);
		console.log('dataProduct', dataProduct);
		console.log('dataSource', dataSource);
	};

	// console.log('this-->', this);
	// console.log('this', this);

	const columns = [
		{
			title: 'รูป',
			dataIndex: 'imageUrl',
			key: 'imageUrl',
			fixed: 'left',
			width: 100,
			render: (text) => (
				<img style={{ width: '60px', height: '60px' }} src={text} />
			)
		},
		{
			title: 'ชื่อสินค้า',
			dataIndex: 'name',
			key: 'name',
			fixed: 'left',
			width: 150,
			...getColumnSearchProps('name'),
			sorter: (a, b) => a.name.localeCompare(b.name),
			sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order,
			ellipsis: true
		},
		{
			title: 'หมวดหมู่สินค้า',
			dataIndex: 'type',
			key: 'type',
			width: 300,
			...getColumnSearchProps('type'),
			sortOrder: sortedInfo.columnKey === 'type' && sortedInfo.order,
			ellipsis: true,
			render: (type) => (
				<>
					{type.map((type) => {
						let color;
						if (type[0]) {
							color = '#33CC00';
						}
						if (type[1]) {
							color = '#FF0000';
						}
						if (type[2]) {
							color = '#33CC00';
						}
						return (
							<Tag color={color} key={type}>
								{type}
							</Tag>
						);
					})}
				</>
			)
		},
		{
			title: 'ราคา',
			dataIndex: 'price',
			key: 'price',
			width: 100,
			...getColumnSearchProps('price'),
			sorter: (a, b) => a.price - b.price,
			sortOrder: sortedInfo.columnKey === 'price' && sortedInfo.order,
			ellipsis: true
		},
		,
		{
			title: 'จำนวนในสต็อก',
			dataIndex: 'num_of_stock',
			key: 'num_of_stock',
			width: 200,
			...getColumnSearchProps('num_of_stock'),
			sorter: (a, b) => a.num_of_stock - b.num_of_stock,
			sortOrder: sortedInfo.columnKey === 'num_of_stock' && sortedInfo.order,
			ellipsis: true
		},
		{
			title: 'สถานะสินค้า',
			key: 'status_show',
			dataIndex: 'status_show',
			width: 400,
			filters: [
				{ text: 'กำลังจำหน่าย', value: 'กำลังจำหน่าย' },
				{ text: 'หมดสต็อก', value: 'หมดสต็อก' },
				{ text: 'สินค้าใกล้หมด', value: 'สินค้าใกล้หมด' },
				{ text: 'เลิกจำหน่าย', value: 'เลิกจำหน่าย' }
			],
			sortOrder: sortedInfo.columnKey === 'status_show' && sortedInfo.order,
			ellipsis: true,
			render: (status_show) => (
				<>
					{status_show.map((status) => {
						let color;
						if (status === 'กำลังจำหน่าย') {
							color = '#33CC00';
						}
						if (status === 'ไม่ได้จำหน่าย') {
							color = '#FF0000';
						}
						if (status === 'มีในสต็อก') {
							color = '#33CC00';
						}
						if (status === 'หมดสต็อก') {
							color = '#FF0000';
						}
						if (status === 'สินค้าใกล้หมด') {
							color = '#FFA500';
						}
						if (status === 'เลิกจำหน่าย') {
							color = '#BEBEBE';
						}
						return (
							<Tag color={color} key={status}>
								{status}
							</Tag>
						);
					})}
				</>
			)
		},
		{
			title: 'สถานะจัดจำหน่าย',
			key: 'status_product',
			dataIndex: 'status_product',
			width: 400,
			filters: [
				{ text: 'ขายดี', value: 'ขายดี' },
				{ text: 'ลดราคา', value: 'ลดราคา' },
				{ text: 'สินค้ามาใหม่', value: 'สินค้ามาใหม่' },
				{ text: 'โปรโมชั่น', value: 'โปรโมชั่น' }
			],
			sortOrder: sortedInfo.columnKey === 'status_product' && sortedInfo.order,
			ellipsis: true,
			render: (status_product) => (
				<>
					{status_product.map((status) => {
						let color;
						if (status === 'ขายดี') {
							color = '#33CC00';
						}
						if (status === 'ลดราคา') {
							color = '#FFA500';
						}
						if (status === 'สินค้าใหม่') {
							color = '#FF0000';
						}
						if (status === 'โปรโมชั่น') {
							color = '#0000CD';
						}
						return (
							<Tag color={color} key={status}>
								{status}
							</Tag>
						);
					})}
				</>
			)
		},
		{
			title: 'ส่วนลด',
			dataIndex: 'discount',
			key: 'discount',
			width: 120,
			...getColumnSearchProps('discount'),
			sorter: (a, b) => a.price - b.price,
			sortOrder: sortedInfo.columnKey === 'discount_type' && sortedInfo.order,
			ellipsis: true
		},
		{
			title: 'รูปแบบส่วนลด',
			dataIndex: 'discountType',
			key: 'discountType',
			width: 140,
			filters: [
				{ text: 'เปอร์เซ็น', value: 'เปอร์เซ็น' },
				{ text: 'บาท', value: 'บาท' }
			],
			onFilter: (value, record) => record.discountType.includes(value),
			sortOrder: sortedInfo.columnKey === 'discountType' && sortedInfo.order,
			ellipsis: true
		},
		{
			title: 'จำนวนที่ขายได้',
			dataIndex: 'num_of_sold',
			key: 'num_of_sold',
			width: 170,
			...getColumnSearchProps('num_of_sold'),
			sorter: (a, b) => a.num_of_sold - b.num_of_sold,
			sortOrder: sortedInfo.columnKey === 'num_of_sold' && sortedInfo.order,
			ellipsis: true
		},
		{
			title: 'จำนวนที่ถูกใส่ในตะกร้า',
			dataIndex: 'num_put_basket',
			key: 'num_put_basket',
			width: 200,
			...getColumnSearchProps('num_put_basket'),
			sorter: (a, b) => a.num_put_basket - b.num_put_basket,
			sortOrder: sortedInfo.columnKey === 'num_put_basket' && sortedInfo.order,
			ellipsis: true
		},
		{
			title: 'จำนวนที่ใส่ในตะกร้าตอนนี้',
			dataIndex: 'num_put_basket_now',
			key: 'num_put_basket_now',
			width: 250,
			...getColumnSearchProps('num_put_basket_now'),
			sorter: (a, b) => a.num_put_basket_now - b.num_put_basket_now,
			sortOrder:
				sortedInfo.columnKey === 'num_put_basket_now' && sortedInfo.order,
			ellipsis: true
		},
		{
			title: 'ยอดเข้าชม',
			dataIndex: 'traffic',
			key: 'traffic',
			width: 150,
			...getColumnSearchProps('traffic'),
			sorter: (a, b) => a.traffic - b.traffic,
			sortOrder: sortedInfo.columnKey === 'traffic' && sortedInfo.order,
			ellipsis: true
		},
		{
			title: 'แต้มตัวแทน',
			dataIndex: 'dis_point',
			key: 'dis_point',
			width: 150,
			...getColumnSearchProps('dis_point'),
			sorter: (a, b) => a.dis_point - b.dis_point,
			sortOrder: sortedInfo.columnKey === 'dis_point' && sortedInfo.order,
			ellipsis: true
		},
		{
			title: 'แต้มสมาชิก',
			dataIndex: 'mem_point',
			key: 'mem_point',
			width: 150,
			...getColumnSearchProps('mem_point'),
			sorter: (a, b) => a.mem_point - b.mem_point,
			sortOrder: sortedInfo.columnKey === 'mem_point' && sortedInfo.order,
			ellipsis: true
		},
		{
			title: 'SKU',
			dataIndex: 'SKU',
			key: 'SKU',
			width: 150,
			...getColumnSearchProps('SKU'),
			sorter: (a, b) => a.SKU.localeCompare(b.SKU),
			sortOrder: sortedInfo.columnKey === 'SKU' && sortedInfo.order,
			ellipsis: true
		},
		{
			title: 'ParentSKU',
			dataIndex: 'ParentSKU',
			key: 'ParentSKU',
			width: 150,
			...getColumnSearchProps('ParentSKU'),
			sorter: (a, b) => a.ParentSKU.localeCompare(b.ParentSKU),
			sortOrder: sortedInfo.columnKey === 'ParentSKU' && sortedInfo.order,
			ellipsis: true
		},
		{
			title: 'Action',
			key: 'action',
			fixed: 'right',
			width: 140,
			render: (text, record) => (
				<Space size="middle">
					<a onClick={() => onOpenDrawerAddStockProduct(record.key)}>
						<PlusSquareFilled />
					</a>
					<a onClick={() => onOpenDrawerEditProduct(record.key)}>
						<EditFilled />
					</a>
					<Popconfirm
						title="คุณแน่ใจว่าจะลบสินค้าชิ้นนี้?"
						onConfirm={() => handleDeleteProduct(record.key)}
					>
						<a>
							<DeleteFilled />
						</a>
					</Popconfirm>

					<a onClick={() => onOpenDrawerViewProduct(record.key)}>
						<SearchOutlined />
					</a>
				</Space>
			)
		}
	];

	if (loading) {
		return (
			<p style={{ textAlign: 'center', marginTop: '200px' }}>
				<LoadingOutlined style={{ fontSize: '200px' }} />
				<p style={{ fontSize: '50px', fontWeight: 'bold' }}>Loading</p>
			</p>
		);
	}

	const expandedRowRender = (row) => {
		const dataStock = [];
		const dataStockMap = [];
		const datalengthStock = [];
		let lengthStock = 0;
		let rowKey = row.key;
		for (let i = 0; i < data.user.shops[0].products.length; i++) {
			for (let j = 0; j < data.user.shops[0].products[i].num_of_stock.length; j++) {
				{
					dataStock.push({
						key: j,
						date: data.user.shops[0].products[i].num_of_stock[j].createdAt,
						stock: data.user.shops[0].products[i].num_of_stock[j].stock,
						status:
							data.user.shops[0].products[i].num_of_stock[j].stockEdit.length > 0
								? ['มีการแก้ไข']
								: ['เสร็จสิ้น']
					});
				}
				dataStockMap.push(dataStock[lengthStock]);
				lengthStock += 1;
			}
			datalengthStock.push(data.user.shops[0].products[i].num_of_stock.length);
		}
		// console.log('datalengthStock-->', datalengthStock);
		// console.log('dataStockMap-->', dataStockMap);

		const columns = [
			{ title: 'จำนวนที่เพิ่มลงสต็อก', dataIndex: 'stock', key: 'stock' },
			{ title: 'วันที่', dataIndex: 'date', key: 'date' },
			{
				title: 'สถานะ',
				key: 'status',
				dataIndex: 'status',
				render: (status) => (
					<>
						{status.map((status) => {
							if (status === 'เสร็จสิ้น') {
								return (
									<span>
										<Badge status="success" />
										เสร็จสิ้น
									</span>
								);
							}

							if (status === 'มีการแก้ไข') {
								return (
									<span>
										<Badge status="success" />
										เสร็จสิ้น (มีการแก้ไข)
									</span>
								);
							}
						})}
					</>
				)
			},
			{
				title: 'Action',
				dataIndex: 'operation',
				key: 'operation',
				render: (text, record) => (
					<Space size="middle">
						<a>
							<EditFilled />
						</a>
						<a>
							<DeleteFilled />
						</a>
					</Space>
				)
			}
		];
		let inTable = [];
		let count = 0;
		for (let i = 0; i < data.user.shops[0].products.length; i++) {
			count = 0;
			for (let k = 0; k <= i; k++) {
				count = count + datalengthStock[k];
			}

			for (let j = 0; j < data.user.shops[0].products[i].num_of_stock.length; j++) {
				if (row.key === i) {
					inTable.push(dataStockMap[count - 1]);
					count = count - 1;
				}

				// console.log(`row[${i}]-->`, row.key);
				// console.log(`inTable[${i}]-->`, inTable[i]);
			}
		}
		// console.log('length-->', totalLengthStock.length);
		// console.log(`inTable-->`, inTable);

		const expandedRowRenderSub = (row) => {
			const dataStockSub = [];
			const dataStockMapSub = [];
			const datalengthStockSub = [];
			let lengthStockSub = 0;
			for (let i = 0; i < data.user.shops[0].products.length; i++) {
				for (let j = 0; j < data.user.shops[0].products[i].num_of_stock.length; j++) {
					for (
						let k = 0;
						k < data.user.shops[0].products[i].num_of_stock[j].stockEdit.length;
						k++
					) {
						{
							dataStockSub.push({
								key: k,
								date:
									data.user.shops[0].products[i].num_of_stock[j].stockEdit.length > 0
										? data.user.shops[0].products[i].num_of_stock[j].stockEdit[k]
												.createdAt
										: [''],
								stock:
									data.user.shops[0].products[i].num_of_stock[j].stockEdit.length > 0
										? data.user.shops[0].products[i].num_of_stock[j].stockEdit[k]
												.stockEdit
										: [''],
								status:
									data.user.shops[0].products[i].num_of_stock[j].stockEdit.length > 0
										? ['มีการแก้ไข']
										: ['เสร็จสิ้น']
							});
						}
						dataStockMapSub.push(dataStockSub[lengthStockSub]);
						lengthStockSub += 1;
					}
					datalengthStockSub.push(
						data.user.shops[0].products[i].num_of_stock[j].stockEdit.length
					);
				}
			}
			// console.log('datalengthStock-->', datalengthStockSub);
			// console.log('dataStockMap-->', dataStockMapSub);
			// console.log('dataStockSub', dataStockSub);

			const columns = [
				{ title: 'จำนวนสต็อกที่แก้ไข', dataIndex: 'stock', key: 'stock' },
				{ title: 'วันที่', dataIndex: 'date', key: 'date' },
				{
					title: 'สถานะ',
					key: 'status',
					dataIndex: 'status',
					render: (status) => (
						<>
							{status.map((status) => {
								if (status === 'เสร็จสิ้น') {
									return (
										<span>
											<Badge status="success" />
											เสร็จสิ้น
										</span>
									);
								}

								if (status === 'มีการแก้ไข') {
									return (
										<span>
											<Badge status="warning" />
											แก้ไข
										</span>
									);
								}
							})}
						</>
					)
				}
			];

			let inTableSub = [];
			let countSub = 0;
			let countSubStockEdit = 0;
			for (let i = 0; i < data.user.shops[0].products.length; i++) {
				console.log('ix', i);
				for (let j = 0; j < data.user.shops[0].products[i].num_of_stock.length; j++) {
					countSub = 0;
					for (let k = 0; k <= j + countSubStockEdit; k++) {
						if (data.user.shops[0].products[i].num_of_stock[j].stockEdit.length === 0) {
							countSub = 1;
						} else {
							countSub = countSub + datalengthStockSub[k];
						}
					}
					if (
						rowKey === i &&
						dataStockMap[j + countSubStockEdit].status[0].toString() ===
							'มีการแก้ไข' &&
						row.key === j &&
						data.user.shops[0].products[i].num_of_stock[j].stockEdit.length > 0
					) {
						for (
							let k = 0;
							k < data.user.shops[0].products[i].num_of_stock[j].stockEdit.length;
							k++
						) {
							if (row.key === j) {
								inTableSub.push(dataStockMapSub[countSub - 1]);
								countSub = countSub - 1;
							}
						}
					}
					if (
						rowKey === i &&
						dataStockMap[j + countSubStockEdit].status[0].toString() ===
							'เสร็จสิ้น' &&
						row.key === j &&
						data.user.shops[0].products[i].num_of_stock[j].stockEdit.length <= 0
					) {
						inTableSub.length = 0;
					}
				}
				for (let j = 0; j < data.user.shops[0].products[i].num_of_stock.length; j++) {
					countSubStockEdit += 1;
				}
			}

			return (
				<Table columns={columns} dataSource={inTableSub} pagination={false} />
			);
		};
		return (
			<Table
				columns={columns}
				expandedRowRender={expandedRowRenderSub}
				dataSource={inTable}
				pagination={false}
			/>
		);
	};

	return (
		<div>
			<link
				href="https://fonts.googleapis.com/css2?family=Mitr:wght@200;300;400;500;600;700&display=swap"
				rel="stylesheet"
			/>
			<link href="style/stockProducts.css" rel="stylesheet" />

			<Drawer
				title="เพิ่มสินค้าใหม่"
				placement="right"
				closable={false}
				onClose={onCloseDrawerAddProduct}
				visible={visibleAddProduct}
				width={720}
				headerStyle={{}}
				bodyStyle={{
					fontSize: '18px',
					fontWeight: '500',
					padding: '0px 0px 0px 20px',
					backgroundColor: '#F5F5F5'
				}}
			>
				<AddProduct prod={data} />
			</Drawer>

			<Drawer
				title="เพิ่มสต็อกสินค้า"
				placement="right"
				closable={false}
				onClose={onCloseDrawerAddStockProduct}
				visible={visibleAddStockProduct}
				width={720}
				bodyStyle={{
					fontSize: '18px',
					fontWeight: '500',
					padding: '0px 20px 0px 20px'
				}}
			>
				<AddStockProduct />
			</Drawer>

			<Drawer
				title="แก้ไขสินค้า"
				placement="right"
				closable={false}
				onClose={onCloseDrawerEditProduct}
				visible={visibleEditProduct}
				width={720}
				bodyStyle={{
					fontSize: '18px',
					fontWeight: '500',
					padding: '20px 20px 20px 20px'
				}}
			>
				<EditProduct />
			</Drawer>

			<Drawer
				title="รายละเอียดสินค้าแบบย่อ"
				placement="right"
				closable={false}
				onClose={onCloseDrawerViewProduct}
				visible={visibleViewProduct}
				width={720}
				bodyStyle={{
					fontSize: '18px',
					fontWeight: '500',
					padding: '20px 20px 20px 20px'
				}}
			>
				<ViewProduct />
			</Drawer>

			<div className="container-span">
				<span>จัดการสต็อกสินค้า</span>
			</div>
			<div className="container-button-add-pro">
				<Button
					type="primary"
					style={{ 'background-color': '#33CC00' }}
					onClick={onOpenDrawerAddProduct}
				>
					เพิ่มสินค้า +
				</Button>
			</div>

			<div style={{ clear: 'both' }} />
			<Tabs
				defaultActiveKey={key}
				type="card"
				onChange={(e) => setKey({ key: e.key })}
			>
				<TabPane tab="ทั้งหมด" key="1">
					<div style={{ marginBottom: 16 }}>
						<Button onClick={clearFilters} style={{ marginRight: 8 }}>
							ลบตัวกรอง
						</Button>
						<Button onClick={clearAll} style={{ marginRight: 8 }}>
							ลบตัวกรองและการจัดเรียง
						</Button>
						<Button
							type="primary"
							danger
							onClick={start}
							disabled={!hasSelected}
							loading={loadingBottomDelete}
						>
							ลบสินค้าที่เลือก
						</Button>
						<span style={{ marginLeft: 8 }}>
							{hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
						</span>
					</div>

					<Table
						rowKey={data.user.shops[0].products === undefined ? null : data.user.shops[0].products.id}
						rowSelection={rowSelection}
						columns={columns}
						dataSource={dataProduct}
						onChange={handleChange}
						expandable={{ expandedRowRender }}
						bordered
						rowClassName={(record, index) =>
							index % 2 === 0 ? 'table-row-light' : 'table-row-dark'
						}
						pagination={{
							position: ['bottomLeft'],
							total: dataProduct.length,
							showSizeChanger: true,
							showQuickJumper: true,
							showTotal: (total) => `Total ${total} item`
						}}
						scroll={{ x: true }}
					/>
				</TabPane>
				<TabPane tab="กำลังจำหน่าย" key="2">
					<div style={{ marginBottom: 16 }}>
						<Button onClick={clearFilters} style={{ marginRight: 8 }}>
							ลบตัวกรอง
						</Button>
						<Button onClick={clearAll} style={{ marginRight: 8 }}>
							ลบตัวกรองและการจัดเรียง
						</Button>
						<Button
							type="primary"
							danger
							onClick={start}
							disabled={!hasSelected}
							loading={loadingBottomDelete}
						>
							ลบสินค้าที่เลือก
						</Button>
						<span style={{ marginLeft: 8 }}>
							{hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
						</span>
					</div>

					<Table
						rowKey={data.user.shops[0].products === undefined ? null : data.user.shops[0].products.id}
						rowSelection={rowSelection}
						columns={columns}
						dataSource={dataProduct}
						onChange={handleChange}
						expandable={{ expandedRowRender }}
						bordered
						rowClassName={(record, index) =>
							index % 2 === 0 ? 'table-row-light' : 'table-row-dark'
						}
						pagination={{
							position: ['bottomLeft'],
							total: dataProduct.length,
							showSizeChanger: true,
							showQuickJumper: true,
							showTotal: (total) => `Total ${total} item`
						}}
						scroll={{ x: true }}
					/>
				</TabPane>
				<TabPane tab="สินค้าหมดสต็อก" key="3">
					<div style={{ marginBottom: 16 }}>
						<Button onClick={clearFilters} style={{ marginRight: 8 }}>
							ลบตัวกรอง
						</Button>
						<Button onClick={clearAll} style={{ marginRight: 8 }}>
							ลบตัวกรองและการจัดเรียง
						</Button>
						<Button
							type="primary"
							danger
							onClick={start}
							disabled={!hasSelected}
							loading={loadingBottomDelete}
						>
							ลบสินค้าที่เลือก
						</Button>
						<span style={{ marginLeft: 8 }}>
							{hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
						</span>
					</div>

					<Table
						rowKey={data.user.shops[0].products === undefined ? null : data.user.shops[0].products.id}
						rowSelection={rowSelection}
						columns={columns}
						dataSource={dataProduct}
						onChange={handleChange}
						expandable={{ expandedRowRender }}
						bordered
						rowClassName={(record, index) =>
							index % 2 === 0 ? 'table-row-light' : 'table-row-dark'
						}
						pagination={{
							position: ['bottomLeft'],
							total: dataProduct.length,
							showSizeChanger: true,
							showQuickJumper: true,
							showTotal: (total) => `Total ${total} item`
						}}
						scroll={{ x: true }}
					/>
				</TabPane>
				<TabPane tab="เลิกจำหน่าย" key="4">
					<div style={{ marginBottom: 16 }}>
						<Button onClick={clearFilters} style={{ marginRight: 8 }}>
							ลบตัวกรอง
						</Button>
						<Button onClick={clearAll} style={{ marginRight: 8 }}>
							ลบตัวกรองและการจัดเรียง
						</Button>
						<Button
							type="primary"
							danger
							onClick={start}
							disabled={!hasSelected}
							loading={loadingBottomDelete}
						>
							ลบสินค้าที่เลือก
						</Button>
						<span style={{ marginLeft: 8 }}>
							{hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
						</span>
					</div>

					<Table
						rowKey={data.user.shops[0].products === undefined ? null : data.user.shops[0].products.id}
						rowSelection={rowSelection}
						columns={columns}
						dataSource={dataProduct}
						onChange={handleChange}
						expandable={{ expandedRowRender }}
						bordered
						rowClassName={(record, index) =>
							index % 2 === 0 ? 'table-row-light' : 'table-row-dark'
						}
						pagination={{
							position: ['bottomLeft'],
							total: dataProduct.length,
							showSizeChanger: true,
							showQuickJumper: true,
							showTotal: (total) => `Total ${total} item`
						}}
						scroll={{ x: true }}
					/>
				</TabPane>
				
				{/* <TabPane tab="กำลังจำหน่าย" key="2">
							<div style={{ marginBottom: 16 }}>
								<Button onClick={this.clearFilters} style={{ marginRight: 8 }}>
									Clear filters
								</Button>
								<Button onClick={this.clearAll} style={{ marginRight: 8 }}>
									Clear filters and sorters
								</Button>
								<Button
									type="primary"
									danger
									onClick={this.start}
									disabled={!hasSelected}
									loading={loadingBottomDelete}
								>
									ลบสินค้าที่เลือก
								</Button>
								<span style={{ marginLeft: 8 }}>
									{hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
								</span>
							</div>
	
							<Table
								rowSelection={rowSelection}
								columns={columns}
								dataSource={dataProduct}
								onChange={this.handleChange}
								bordered
								pagination={{
									position: ['bottomLeft'],
									total: dataProduct.length,
									showSizeChanger: true,
									showQuickJumper: true,
									showTotal: (total) => `Total ${total} item`
								}}
								scroll={{ x: 100 }}
							/>
						</TabPane>
						<TabPane tab="สินค้าหมดสต็อก" key="3">
							<div style={{ marginBottom: 16 }}>
								<Button onClick={this.clearFilters} style={{ marginRight: 8 }}>
									Clear filters
								</Button>
								<Button onClick={this.clearAll} style={{ marginRight: 8 }}>
									Clear filters and sorters
								</Button>
								<Button
									type="primary"
									danger
									onClick={this.start}
									disabled={!hasSelected}
									loading={loadingBottomDelete}
								>
									ลบสินค้าที่เลือก
								</Button>
								<span style={{ marginLeft: 8 }}>
									{hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
								</span>
							</div>
	
							<Table
								rowSelection={rowSelection}
								columns={columns}
								dataSource={dataProduct}
								onChange={this.handleChange}
								bordered
								pagination={{
									position: ['bottomLeft'],
									total: dataProduct.length,
									showSizeChanger: true,
									showQuickJumper: true,
									showTotal: (total) => `Total ${total} item`
								}}
								scroll={{ x: 100 }}
							/>
						</TabPane>
						<TabPane tab="เลิกจำหน่าย" key="4">
							<div style={{ marginBottom: 16 }}>
								<Button onClick={this.clearFilters} style={{ marginRight: 8 }}>
									Clear filters
								</Button>
								<Button onClick={this.clearAll} style={{ marginRight: 8 }}>
									Clear filters and sorters
								</Button>
								<Button
									type="primary"
									danger
									onClick={this.start}
									disabled={!hasSelected}
									loading={loadingBottomDelete}
								>
									ลบสินค้าที่เลือก
								</Button>
								<span style={{ marginLeft: 8 }}>
									{hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
								</span>
							</div>
	
							<Table
								rowSelection={rowSelection}
								columns={columns}
								dataSource={dataProduct}
								onChange={this.handleChange}
								bordered
								pagination={{
									position: ['bottomLeft'],
									total: dataProduct.length,
									showSizeChanger: true,
									showQuickJumper: true,
									showTotal: (total) => `Total ${total} item`
								}}
								scroll={{ x: 100 }}
							/>
						</TabPane> */}
			</Tabs>
		</div>
	);
};
export default StockProducts;
