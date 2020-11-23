import React, { useState, useEffect, useMemo } from 'react';
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
	Space,
	Card,
	Table,
	Switch,
	InputNumber
} from 'antd';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import {
	UploadOutlined,
	PlusOutlined,
	LoadingOutlined,
	MinusCircleOutlined,
	QuestionCircleOutlined
} from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';
import fetch from 'isomorphic-unfetch';
import swal from 'sweetalert';
import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Zoom from '@material-ui/core/Zoom';

import { ME } from './StockProducts';
import { map } from 'jquery';
import { Tab } from '@material-ui/core';

const { Option } = Select;
const { RangePicker } = DatePicker;

const options = [
	{
		value: 'ผงชา',
		label: 'ผงชา',
		children: [
			{
				value: 'ผงชาเขียว',
				label: 'ผงชาเขียว',
				children: [
					{
						value: 'ผงชามัจฉะ',
						label: 'ผงชามัจฉะ'
					}
				]
			},
			{
				value: 'ผงชาไทย',
				label: 'ผงชาไทย',
				children: [
					{
						value: 'ผงชาไทยตรามือ',
						label: 'ผงชาไทยตรามือ'
					},
					{
						value: 'ผงชาไทยตราตีน',
						label: 'ผงชาไทยตราตีน'
					}
				]
			}
		]
	},
	{
		value: 'ชาซอง',
		label: 'ชาซอง',
		children: [
			{
				value: 'ชาแดง',
				label: 'ชาแดง',
				children: [
					{
						value: 'ชาแดงแป๊ด',
						label: 'ชาแดงแป๊ด'
					}
				]
			}
		]
	}
];

const ADD_PRODUCT = gql`
	mutation ADD_PRODUCT(
		$idOwner: ID!
		$idShop: ID!
		$idPickUpFrom: ID!
		$name: String!
		$description: String
		$price: Float!
		$min_of_stock: Float!
		$discountType: String
		$discount: Float
		$discountTimeStart: DateTime
		$discountTimeEnd: DateTime
		$mem_point: Int
		$dis_point: Int
		$SKU: String
		$ParentSKU: String!
	) {
		addProduct(
			idOwner: $idOwner
			idShop: $idShop
			idPickUpFrom: $idPickUpFrom
			name: $name
			description: $description
			price: $price
			min_of_stock: $min_of_stock
			discountType: $discountType
			discount: $discount
			discountTimeStart: $discountTimeStart
			discountTimeEnd: $discountTimeEnd
			mem_point: $mem_point
			dis_point: $dis_point
			SKU: $SKU
			ParentSKU: $ParentSKU
		) {
			id
			name
			type {
				id
				type
				product {
					name
				}
				createdAt
			}
			description
			imageUrl {
				id
				imageUrl
				product {
					name
				}
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
				product {
					name
				}
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
				product {
					name
				}
				createdAt
			}
			status_product {
				id
				status
				product {
					name
				}
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
			owner {
				username
			}
			pickUpFrom {
				username
			}
			shops {
				shopName
			}
			createdAt
		}
	}
`;

const ADD_PRODUCT_WHOLE_SALE = gql`
	mutation ADD_PRODUCT_WHOLE_SALE(
		$idPro: ID!, $price: Float!, $min_sale: Float!, $max_sale: Float!
		) {
		addProductWholeSale(idPro: $idPro, price: $price, min_sale: $min_sale, max_sale: $max_sale) {
			id
			price
			min_sale
			max_sale
			product {
				id
			}
			createdAt
		}
	}
`;

const ADD_IMAGE_PRODUCT = gql`
	mutation ADD_IMAGE_PRODUCT($id: ID!, $imageUrl: String!) {
		addImageUrlProduct(id: $id, imageUrl: $imageUrl) {
			id
			imageUrl
			product {
				id
			}
			createdAt
		}
	}
`;

const ADD_TYPE_PRODUCT = gql`
	mutation ADD_TYPE_PRODUCT($id: ID!, $type: String!) {
		addProductType(id: $id, type: $type) {
			id
			type
			product {
				id
			}
			createdAt
		}
	}
`;

const ADD_STOCK_PRODUCT = gql`
	mutation ADD_STOCK_PRODUCT(
		$id: ID!, 
		$stock: Float!, 
		$price: Float!,
		$cost: Float!,
		$statusExpiration: String!,
		$Expiration: Date
		) {
		addStock(id: $id, stock: $stock, price: $price,
		cost: $cost, statusExpiration: $statusExpiration, 
		Expiration: $Expiration) {
			id
			stock
			price
			cost
			statusExpiration
			Expiration
			product {
				id
			}
			createdAt
		}
	}
`;

const ADD_STATUS_SHOW_PRODUCT = gql`
	mutation ADD_STATUS_SHOW_PRODUCT(
		$id: ID!, 
		$status: String!
		) {
		addStatusShow(id: $id, status: $status) {
			id
			status
			product {
				id
			}
			createdAt
		}
	}
`;

const ADD_STATUS_PRODUCT = gql`
	mutation ADD_STATUS_PRODUCT(
		$id: ID!, 
		$status: String!
		) {
		addStatusPro(id: $id, status: $status) {
			id
			status
			product {
				id
			}
			createdAt
		}
	}
`;

function getBase64(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result);
		reader.onerror = (error) => reject(error);
	});
}

let loadingAddProduct = false;
let success = false;

const AddProduct = ({prod}) => {
	// console.log('data',prod.user)
	// console.log('data ID',prod.user.id)
	// console.log('data ID',prod.user.id.toString())
	//! Add Product Whole Sale -----------------------------------------------------------------------------------------------

	const [
		addProductWholeSale,
		{ loading: loadingAddProductWholeSale, error: errorAddProductWholeSale }
	] = useMutation(ADD_PRODUCT_WHOLE_SALE, {
		onCompleted: (data) => {
			if (data) {
			}
		},
		refetchQueries: [{ query: ME }],
		awaitRefetchQueries: true
	});
	
	//! Add Product Whole Sale -----------------------------------------------------------------------------------------------

	//! Add Statue Product -----------------------------------------------------------------------------------------------

	const [
		addStatusPro,
		{ loading: loadingAddStatusPro, error: errorAddStatusPro }
	] = useMutation(ADD_STATUS_PRODUCT, {
		onCompleted: (data) => {
			if (data) {
			}
		},
		refetchQueries: [{ query: ME }],
		awaitRefetchQueries: true
	});

	//! Add Statue Product -----------------------------------------------------------------------------------------------

	//! Add Statue Show Product -----------------------------------------------------------------------------------------------

	const [
		addStatusShow,
		{ loading: loadingAddStatusShow, error: errorAddStatusShow }
	] = useMutation(ADD_STATUS_SHOW_PRODUCT, {
		onCompleted: (data) => {
			if (data) {
			}
		},
		refetchQueries: [{ query: ME }],
		awaitRefetchQueries: true
	});

	//! Add Statue Show Product -----------------------------------------------------------------------------------------------


	//! Add Product -----------------------------------------------------------------------------------------------
	const rangeConfig = {
		rules: [{ type: 'array', message: 'Please select time!' }]
	};
	const [optionProduct, setOptionProduct] = useState(false);
	const [option2State, setOption2State] = useState(false);
	const [option_1, setOption_1] = useState({
		status: false,
		firstTime: false
	});
	const [option_2, setOption_2] = useState({
		status: false,
		firstTime: false
	});
	const [lenghtPriceOption, setLenghPriceOption] = useState({
		status: false,
		status_rank_price_product: [],
		min_rank_price: [],
		max_rank_price: [],
		price_per_piece: []
	});
	const [productInfo, setProductInfo] = useState({
		name: '',
		type: '',
		description: '',
		price: '0',
		num_of_stock: '0',
		min_of_stock: '0',
		cost: '0',
		discount: '0',
		discountType: 'none',
		discountTimeStart: '0',
		discountTimeEnd: '0',
		statusExpiration: 'ไม่มี',
		Expiration: null,
		num_of_sold: '0',
		num_put_basket_now: '0',
		num_put_basket: '0',
		traffic: '0',
		status_show: [],
		status_product: [],
		mem_point: '0',
		dis_point: '0',
		ParentSKU: '',
		rank_status: 'none',
		rank: []
	});

	const [takeAllProduct, setTakeAllProduct] = useState({
		price: '',
		stock: '',
		SKU: ''
	})
	const handleChangeTakeAllProduct = (e) => {
		setTakeAllProduct({
			...takeAllProduct,
			[e.target.name] : e.target.value
		})
	}

	const [productInfoOption, setProductInfoOption] = useState({
		option_name_1: [],
		option_1: [],
		option_name_2: [],
		option_2: [],
		status_product: [],
		cost: [],
		price: [],
		dis_point: [],
		mem_point: [],
		num_of_stock: [],
		min_of_stock: [],
		SKU: []
	});

	const handleChange = (e) => {
		setProductInfo({
			...productInfo,
			[e.target.name]: e.target.value
		});
	};
	// console.log('productInfo-->', productInfo);
	// console.log('lenghtPriceOption-->', lenghtPriceOption);
	// console.log('lenghtPriceOption.status-->', lenghtPriceOption.status);

	const [
		addProduct,
		{ loading: loadingMuAddProduct, error: errorAddProduct }
	] = useMutation(ADD_PRODUCT, {
		onCompleted: async (data) => {
			if (data) {
				// await handleChangeLoading()
				if (option_1.status === false) {
					const url = await uploadFiles();
					if (url) {
						for (let i = 0; i < fileList.length; i++) {
							await addImageUrlProduct({
								variables: {
									id: data.addProduct.id.toString(),
									imageUrl: urlFileList[i]
								}
							});
						}
						urlFileList = [];
						await setFileList([]);
					}

					if (productInfo.num_of_stock && productInfo.num_of_stock != '') {
						if (productInfo.statusExpiration === 'ไม่มี') {
							await addStock({
								variables: {
									id: data.addProduct.id.toString(),
									stock: +productInfo.num_of_stock,
									price: +productInfo.price,
									cost: +productInfo.cost,
									statusExpiration: productInfo.statusExpiration,
									Expiration: productInfo.Expiration
								}
							});
						}
						if (productInfo.statusExpiration === 'มี') {	
							await addStock({
								variables: {
									id: data.addProduct.id.toString(),
									stock: +productInfo.num_of_stock,
									price: +productInfo.price,
									cost: +productInfo.cost,
									statusExpiration: productInfo.statusExpiration,
									Expiration: productInfo.Expiration
								}
							});
						}
					}

					await addStatusPro({
							variables: 
							{
								id: data.addProduct.id.toString(),
								status: 'สินค้าใหม่'
							}})
					await addStatusShow({
							variables: 
							{
								id: data.addProduct.id.toString(),
								status: 'ไม่ได้จำหน่าย'
							}})

					if (+productInfo.num_of_stock > 0) {
						await addStatusShow({
							variables: 
							{
								id: data.addProduct.id.toString(),
								status: 'มีในสต็อก'
							}})
						if (+productInfo.num_of_stock <= +productInfo.min_of_stock) {
							await addStatusShow({
							variables: 
							{
								id: data.addProduct.id.toString(),
								status: 'สินค้าใกล้หมด'
							}})
						}
					} else {
						await addStatusShow({
							variables: 
							{
								id: data.addProduct.id.toString(),
								status: 'หมดสต็อก'
							}})
					}

					if (lenghtPriceOption.status === true) {
						for (let i=0; i<lenghtPriceOption.min_rank_price.length; i++) {
							if (lenghtPriceOption.min_rank_price[i] !== undefined 
								&& lenghtPriceOption.min_rank_price[i] !== ""
								&& lenghtPriceOption.min_rank_price[i] !== Empty
								&& lenghtPriceOption.max_rank_price[i] !== undefined 
								&& lenghtPriceOption.max_rank_price[i] !== ""
								&& lenghtPriceOption.max_rank_price[i] !== Empty
								&& lenghtPriceOption.price_per_piece[i] !== undefined 
								&& lenghtPriceOption.price_per_piece[i] !== ""
								&& lenghtPriceOption.price_per_piece[i] !== Empty) {
									addProductWholeSale({
										variables: {
											idPro: data.addProduct.id.toString(),
											price: +lenghtPriceOption.price_per_piece[i],
											min_sale: +lenghtPriceOption.min_rank_price[i],
											max_sale: +lenghtPriceOption.max_rank_price[i]
										}
									})
								}
						}
					}

					if (productInfo.type && productInfo.type != '') {
						for (let i = 0; i < productInfo.type.length; i++) {
							await addProductType({
								variables: {
									id: data.addProduct.id.toString(),
									type: productInfo.type[i]
								}
							});
						}
					}
				} 
				else if (option_1.status === true && option_2.status === false) {
					const url = await uploadFilesOption();
					if (url) {
						for (let i = 0; i < fileList.length; i++) {
							await addImageUrlProduct({
								variables: {
									id: data.addProduct.id.toString(),
									imageUrl: urlFileList[i]
								}
							});
						}
						urlFileList = [];
						await setFileList([]);
					}

					if (productInfo.type && productInfo.type != '') {
						for (let i = 0; i < productInfo.type.length; i++) {
							await addProductType({
								variables: {
									id: data.addProduct.id.toString(),
									type: productInfo.type[i]
								}
							}); 
						}
					}

					if (productInfo.num_of_stock && productInfo.num_of_stock !== '') {
						if (productInfo.statusExpiration === 'ไม่มี') {
							await addStock({
								variables: {
									id: data.addProduct.id.toString(),
									stock: +productInfo.num_of_stock,
									price: +productInfo.price,
									cost: +productInfo.cost,
									statusExpiration: productInfo.statusExpiration,
									Expiration: productInfo.Expiration
								}
							});
						}
						if (productInfo.statusExpiration === 'มี') {	
							await addStock({
								variables: {
									id: data.addProduct.id.toString(),
									stock: +productInfo.num_of_stock,
									price: +productInfo.price,
									cost: +productInfo.cost,
									statusExpiration: productInfo.statusExpiration,
									Expiration: productInfo.Expiration
								}
							});
						}
					}

					if (lenghtPriceOption.status === true) {
						for (let i=0; i<lenghtPriceOption.min_rank_price.length; i++) {
							if (lenghtPriceOption.min_rank_price[i] !== undefined 
								&& lenghtPriceOption.min_rank_price[i] !== ""
								&& lenghtPriceOption.min_rank_price[i] !== Empty
								&& lenghtPriceOption.max_rank_price[i] !== undefined 
								&& lenghtPriceOption.max_rank_price[i] !== ""
								&& lenghtPriceOption.max_rank_price[i] !== Empty
								&& lenghtPriceOption.price_per_piece[i] !== undefined 
								&& lenghtPriceOption.price_per_piece[i] !== ""
								&& lenghtPriceOption.price_per_piece[i] !== Empty) {
									await addProductWholeSale({
										variables: {
											idPro: data.addProduct.id.toString(),
											price: +lenghtPriceOption.price_per_piece[i],
											min_sale: +lenghtPriceOption.min_rank_price[i],
											max_sale: +lenghtPriceOption.max_rank_price[i]
										}
									})
								}
						}
					}
				} else if (option_1.status === true && option_2.status === true) {

				}
				await setProductInfo({
					...productInfo,
					name: '',
					description: '',
					type: '',
					num_of_stock: '0',
					cost: '0',
					price: '0',
					discountType: '',
					discount: '0',
					discountTimeStart: null,
					discountTimeEnd: null,
					mem_point: '0',
					dis_point: '0',
					ParentSKU: ''
				});
			}
		}
	}
	);

	const handleChangeType = (value) => {
		setProductInfo({
			...productInfo,
			type: value
		});
	};

	const handleChangeExpType = (value) => {
		setProductInfo({
			...productInfo,
			statusExpiration: value
		});
	};

	const handleChangeLoading = () => {
		loadingAddProduct = !loadingAddProduct
		return loadingAddProduct
	}

	let handleSubmit = async (e) => {
		try {
			if (fileList.length > 0) {
				if (
					+productInfo.num_of_stock !== 0 &&
					+productInfo.num_of_stock != null
				) {
					await handleChangeLoading()
					if (loadingAddProduct === true) {
						console.log('option_1.status-->',option_1.status)
						if (option_1.status === false) {
							const uploadProduct = await addProduct({
								variables: {
									idOwner: prod.user.id,
									idShop: prod.user.shops[0].id,
									idPickUpFrom: prod.user.id,
									name: productInfo.name,
									description: productInfo.description,
									price: +productInfo.price,
									min_of_stock: +productInfo.min_of_stock,
									discount: +productInfo.discount,
									discountType: productInfo.discountType,
									discountTimeStart: productInfo.discountTimeStart === '0' ? null : productInfo.discountTimeStart,
									discountTimeEnd: productInfo.discountTimeEnd === '0' ? null : productInfo.discountTimeEnd,
									mem_point: +productInfo.mem_point,
									dis_point: +productInfo.dis_point,
									ParentSKU: productInfo.ParentSKU,
									SKU: 'none'
								}
							});
							if (uploadProduct) {
								setProductInfo({
									...productInfo,
									name: '',
									description: '',
									type: '',
									num_of_stock: '0',
									min_of_stock: '0',
									cost: '0',
									price: '0',
									discountType: '',
									discount: '0',
									discountTimeStart: null,
									discountTimeEnd: null,
									mem_point: '0',
									dis_point: '0',
									ParentSKU: ''
								});
							}
						} else {
							await addProduct(
							{
								variables: {
									idOwner: prod.user.id,
									idShop: prod.user.shops[0].id,
									idPickUpFrom: prod.user.id,
									name: productInfo.name,
									description: productInfo.description,
									price: +productInfo.price,
									discountTimeStart:
										productInfo.discount === '0' ? null : productInfo.discountTimeStart,
									discountTimeEnd:
										productInfo.discount === '0' ? null : productInfo.discountTimeEnd,
									mem_point: +productInfo.mem_point,
									dis_point: +productInfo.dis_point,
									SKU: productInfo.SKU,
									ParentSKU: productInfo.ParentSKU
							}});
							if (uploadProduct) {
								setProductInfo({
									...productInfo,
									name: '',
									description: '',
									type: '',
									num_of_stock: '0',
									min_of_stock: '0',
									cost: '0',
									price: '0',
									discountType: '',
									discount: '0',
									discountTimeStart: null,
									discountTimeEnd: null,
									mem_point: '0',
									dis_point: '0',
									ParentSKU: ''
								});
							}
						}
					}
				} else {
					swal('', 'โปรดใส่จำนวนสินค้าในสต็อก', 'warning');
				}
			} else {
				swal('', 'โปรดใส่รูปภาพ', 'warning');
			}
		} catch (error) {
			console.log(error);
		}
		await handleChangeLoading();
	};

	const TimeRelatedForm = (fieldsValue) => {
		// Should format date value before submit.
		const rangeTimeValue = fieldsValue;
		setProductInfo({
			...productInfo,
			discountTimeStart: rangeTimeValue[0].format(
				'YYYY-MM-DD' + 'T' + 'HH:mm:ss' + '+00:00'
			),
			discountTimeEnd: rangeTimeValue[1].format(
				'YYYY-MM-DD' + 'T' + 'HH:mm:ss' + '+00:00'
			)
		});
	};

	const TimeRelatedFormExp = (date, dateString) => {
		// Should format date value before submit.
		setProductInfo({
			...productInfo,
			Expiration: dateString
		});
	};

	//! Add Image Product -----------------------------------------------------------------------------------------
	const [fileList, setFileList] = useState([]);

	// const [urlFileList, setUrlFileList] = useState([]);
	let urlFileList = [];

	const [stateImg, setStateImg] = useState({
		previewVisible: false,
		previewImage: '',
		previewTitle: ''
	});
	const { previewVisible, previewImage, previewTitle } = stateImg;

	const uploadButton = (
		<div>
			<PlusOutlined />
			<div className="ant-upload-text">Upload</div>
		</div>
	);

	const [
		addImageUrlProduct,
		{ loading: loadingAddImageUrlProduct, error: errorAddImageUrlProduct }
	] = useMutation(ADD_IMAGE_PRODUCT, {
		onCompleted: (data) => {
			if (data) {
			}
		}
	});

	const uploadFiles = async () => {
		let secure_url;
		for (let i = 0; i < fileList.length; i++) {
			const data = new FormData();
			data.append('file', fileList[i].originFileObj);
			data.append('upload_preset', 'rizaness-test');
			const res = await fetch(
				'https://api.cloudinary.com/v1_1/automedia/image/upload',
				{
					method: 'post',
					body: data
				}
			);
			const result = await res.json();
			secure_url = await result.secure_url;
			urlFileList[i] = secure_url;
		}
		return secure_url;
	};

	const handleUploadImgPreview = async (file) => {
		if (!file.url && !file.preview) {
			file.preview = await getBase64(file.originFileObj);
		}

		setStateImg({
			previewImage: file.url || file.preview,
			previewVisible: true,
			previewTitle:
				file.name || file.url.substring(file.url.lastIndexOf('/') + 1)
		});
	};
	const handleUploadeImgCancel = () => {
		setStateImg({ previewVisible: false });
	};
	const handleChangeUploadImgPro = ({ fileList: newFileList }) => {
		setFileList(newFileList);
	};

	//! Add Image Option Product -----------------------------------------------------------------------------------------
	const [fileListOption, setFileListOption] = useState({ fileList: [] });

	// const [urlFileList, setUrlFileList] = useState([]);
	let urlFileListOption = [];

	const [stateImgOption, setStateImgOption] = useState({
		previewVisibleOption: false,
		previewImageOption: '',
		previewTitleOption: ''
	});
	const {
		previewVisibleOption,
		previewImageOption,
		previewTitleOption
	} = stateImgOption;

	// const [
	// 	addImageUrlProduct,
	// 	{ loading: loadingAddImageUrlProduct, error: errorAddImageUrlProduct }
	// ] = useMutation(ADD_IMAGE_PRODUCT, {
	// 	onCompleted: (data) => {
	// 		if (data) {
	// 		}
	// 	}
	// });

	const uploadFilesOption = async () => {
		let secure_url;
		for (let i = 0; i < fileListOption.length; i++) {
			const data = new FormData();
			data.append('file', fileListOption[i].originFileObj);
			data.append('upload_preset', 'rizaness-test');
			const res = await fetch(
				'https://api.cloudinary.com/v1_1/automedia/image/upload',
				{
					method: 'post',
					body: data
				}
			);
			const result = await res.json();
			secure_url = await result.secure_url;
			urlFileListOption[i] = secure_url;
		}
		return secure_url;
	};

	const handleUploadImgPreviewOption = async (file) => {
		if (!file.url && !file.preview) {
			file.preview = await getBase64(file.originFileObj);
		}

		setStateImgOption({
			previewImageOption: file.url || file.preview,
			previewVisibleOption: true,
			previewTitleOption:
				file.name || file.url.substring(file.url.lastIndexOf('/') + 1)
		});
	};

	const handleUploadeImgCancelOption = () => {
		setStateImgOption({ previewVisibleOption: false });
	};

	const handleChangeUploadImgProOption = (
		{ fileList: newFileList},
		j
	) => {
		if (fileListOption.fileList === undefined) {
			setFileListOption({ fileList: [] });
		}
		if (fileListOption.fileList != undefined) {
			let newArr = [...fileListOption.fileList];
			newArr[j] = newFileList[0];
			if (newFileList[0] === undefined) {
				setFileListOption({ ...fileListOption, fileList: newArr });
			}
			if (newFileList[0] != undefined) {
				setFileListOption({ ...fileListOption, fileList: newArr });
			}
		}
	};

	//! Add Type Product -----------------------------------------------------------------------------------------
	const [
		addProductType,
		{ loading: loadingAddProductType, error: errorAddProductType }
	] = useMutation(ADD_TYPE_PRODUCT, {
		onCompleted: (data) => {
			if (data) {
			}
		}
	});

	//! Add Stock Product -----------------------------------------------------------------------------------------
	const [
		addStock,
		{ loading: loadingAddProductStock, error: errorAddProductStock }
	] = useMutation(ADD_STOCK_PRODUCT, {
		onCompleted: (data) => {
			if (data) {
			}
		},
		refetchQueries: [{ query: ME }],
		awaitRefetchQueries: true
	});
	if (loadingAddProduct) {
		success = true;
		return (
			<p style={{ textAlign: 'center', marginTop: '200px' }}>
				<LoadingOutlined style={{ fontSize: '200px' }} />
				<p style={{ fontSize: '50px', fontWeight: 'bold' }}>Loading</p>
			</p>
		);
	}
	//! Add Stock Product -----------------------------------------------------------------------------------------------

	

	if (success && loadingAddProduct === false) {
		swal('เพิ่มสินค้าเสร็จสิ้น', 'ขอให้สนุกกับการขาย', 'success');
		success = false;
	}

	const QuestionTooltip = withStyles({
		tooltip: {
			color: 'white',
			fontSize: '15px',
			fontWeight: '600',
			maxWidth: '300px',
			backgroundColor: 'orange'
		}
	})(Tooltip);

	const OptionProduct = () => {
		setOption_1({
			...option_1,
			status: !option_1.status,
			firstTime: !option_1.firstTime
		});
		setOptionProduct(!optionProduct);
	};

	const OptionProduct2 = () => {
		setOption_2({
			...option_2,
			status: !option_2.status,
			firstTime: !option_2.firstTime
		});
	};

	let option1_name_table =
		productInfoOption.option_name_1 != ''
			? `${productInfoOption.option_name_1}`
			: 'ชื่อ';
	let option2_name_table =
		productInfoOption.option_name_2 != ''
			? `${productInfoOption.option_name_2}`
			: 'ชื่อ';
	const columns_one_option = [
		{
			title: `${option1_name_table}`,
			dataIndex: 'option_1',
			key: 'option_1',
			fixed: 'left',
			width: 150
		},
		{
			title: 'ต้นทุน',
			dataIndex: 'cost',
			key: 'cost',
			width: 100,
			render: (text, record) => (
				<Input
					name="cost"
					value={productInfoOption.cost[record.key]}
					onChange={(e) => {
						let newArr = [...productInfoOption.cost];
						newArr[record.key] = e.target.value;

						setProductInfoOption({
							...productInfoOption,
							cost: newArr
						});
					}}
					type="number"
					style={{
						border: 'none',
						borderRadius: '0px',
						width: '100%',
						height: '100%'
					}}
				/>
			)
		},
		{
			title: 'ราคา',
			dataIndex: 'price',
			key: 'price',
			width: 150,
			render: (text, record) => (
				<Input
					name="price"
					value={productInfoOption.price[record.key]}
					onChange={(e) => {
						let newArr = [...productInfoOption.price];
						newArr[record.key] = e.target.value;

						setProductInfoOption({
							...productInfoOption,
							price: newArr
						});
					}}
					type="number"
					style={{
						border: 'none',
						borderRadius: '0px',
						width: '100%',
						height: '100%'
					}}
				/>
			)
		},
		{
			title: 'แต้มสำหรับตัวแทนจำหน่าย',
			dataIndex: 'dis_point',
			key: 'dis_point',
			width: 200,
			render: (text, record) => (
				<Input
					name="dis_point"
					value={productInfoOption.dis_point[record.key]}
					onChange={(e) => {
						let newArr = [...productInfoOption.dis_point];
						newArr[record.key] = e.target.value;

						setProductInfoOption({
							...productInfoOption,
							dis_point: newArr
						});
					}}
					type="number"
					style={{
						border: 'none',
						borderRadius: '0px',
						width: '100%',
						height: '100%'
					}}
				/>
			)
		},
		{
			title: 'แต้มสำหรับสมาชิก',
			dataIndex: 'mem_point',
			key: 'mem_point',
			width: 150,
			render: (text, record) => (
				<Input
					name="mem_point"
					value={productInfoOption.mem_point[record.key]}
					onChange={(e) => {
						let newArr = [...productInfoOption.mem_point];
						newArr[record.key] = e.target.value;

						setProductInfoOption({
							...productInfoOption,
							mem_point: newArr
						});
					}}
					type="number"
					style={{
						border: 'none',
						borderRadius: '0px',
						width: '100%',
						height: '100%'
					}}
				/>
			)
		},
		{
			title: 'จำนวนสินค้าในสต็อก',
			dataIndex: 'num_of_stock',
			key: 'num_of_stock',
			width: 170,
			render: (text, record) => (
				<Input
					name="num_of_stock"
					value={productInfoOption.num_of_stock[record.key]}
					onChange={(e) => {
						let newArr = [...productInfoOption.num_of_stock];
						newArr[record.key] = e.target.value;

						setProductInfoOption({
							...productInfoOption,
							num_of_stock: newArr
						});
					}}
					type="number"
					style={{
						border: 'none',
						borderRadius: '0px',
						width: '100%',
						height: '100%'
					}}
				/>
			)
		},
		{
			title: 'จำนวนสินค้าขั้นต่ำในสต็อก',
			dataIndex: 'min_of_stock',
			key: 'min_of_stock',
			width: 200,
			render: (text, record) => (
				<Input
					name="min_of_stock"
					value={productInfoOption.min_of_stock[record.key]}
					onChange={(e) => {
						let newArr = [...productInfoOption.min_of_stock];
						newArr[record.key] = e.target.value;

						setProductInfoOption({
							...productInfoOption,
							min_of_stock: newArr
						});
					}}
					type="number"
					style={{
						border: 'none',
						borderRadius: '0px',
						width: '100%',
						height: '100%'
					}}
				/>
			)
		},
		{
			title: 'SKU',
			dataIndex: 'SKU',
			key: 'SKU',
			width: 200,
			render: (text, record) => (
				<Input
					name="SKU"
					value={productInfoOption.SKU[record.key]}
					onChange={(e) => {
						let newArr = [...productInfoOption.SKU];
						newArr[record.key] = e.target.value;

						setProductInfoOption({
							...productInfoOption,
							SKU: newArr
						});
					}}
					type="text"
					style={{
						border: 'none',
						borderRadius: '0px',
						width: '100%',
						height: '100%'
					}}
				/>
			)
		}
	];

	const columns_two_option = [
		{
			title: `${option1_name_table}`,
			dataIndex: 'option_1',
			key: 'option_1',
			fixed: 'left',
			width: 120,
			render: (_, row) => {
				return {
					children: row.option_1,
					props: {
						rowSpan: row.rowSpan
					}
				};
			}
		},
		{
			title: `${option2_name_table}`,
			dataIndex: 'option_2',
			key: 'option_2',
			fixed: 'left',
			width: 120
		},
		{
			title: 'สถานะสินค้า',
			dataIndex: 'status_product',
			key: 'status_product',
			width: 140,
			render: (text, record, row) => (
				<Switch
					checkedChildren="มีตัวเลือกนี้"
					unCheckedChildren="ไม่มีตัวเลือกนี้"
					defaultChecked
					name="status_product"
					style={{ border: 'none', width: '100%' }}
					checked={
						productInfoOption.status_product[row] === undefined ||
						productInfoOption.status_product[row] === false
							? false
							: true
					}
					onChange={(e) => {
						let newArr = [...productInfoOption.status_product];
						newArr[row] = !productInfoOption.status_product[row];

						setProductInfoOption({
							...productInfoOption,
							status_product: newArr
						});
					}}
				/>
			)
		},
		{
			title: 'ต้นทุน',
			dataIndex: 'cost',
			key: 'cost',
			width: 100,
			render: (text, record, row) => (
				<Input
					name="cost"
					value={productInfoOption.cost[row]}
					onChange={(e) => {
						let newArr = [...productInfoOption.cost];
						newArr[row] = e.target.value;
						setProductInfoOption({
							...productInfoOption,
							cost: newArr
						});
					}}
					type="text"
					style={{ border: 'none', width: '100%', height: '100%' }}
				/>
			)
		},
		{
			title: 'ราคา',
			dataIndex: 'price',
			key: 'price',
			width: 150,
			render: (text, record, row) => (
				<Input
					name="price"
					value={productInfoOption.price[row]}
					onChange={(e) => {
						let newArr = [...productInfoOption.price];
						newArr[row] = e.target.value;
						setProductInfoOption({
							...productInfoOption,
							price: newArr
						});
					}}
					type="text"
					style={{ border: 'none', width: '100%', height: '100%' }}
				/>
			)
		},
		{
			title: 'แต้มสำหรับตัวแทนจำหน่าย',
			dataIndex: 'dis_point',
			key: 'dis_point',
			width: 200,
			render: (text, record, row) => (
				<Input
					name="dis_point"
					value={productInfoOption.dis_point[row]}
					onChange={(e) => {
						let newArr = [...productInfoOption.dis_point];
						newArr[row] = e.target.value;
						setProductInfoOption({
							...productInfoOption,
							dis_point: newArr
						});
					}}
					type="text"
					style={{ border: 'none', width: '100%', height: '100%' }}
				/>
			)
		},
		{
			title: 'แต้มสำหรับสมาชิก',
			dataIndex: 'mem_point',
			key: 'mem_point',
			width: 150,
			render: (text, record, row) => (
				<Input
					name="mem_point"
					value={productInfoOption.mem_point[row]}
					onChange={(e) => {
						let newArr = [...productInfoOption.mem_point];
						newArr[row] = e.target.value;
						setProductInfoOption({
							...productInfoOption,
							mem_point: newArr
						});
					}}
					type="text"
					style={{ border: 'none', width: '100%', height: '100%' }}
				/>
			)
		},
		{
			title: 'จำนวนสินค้าในสต็อก',
			dataIndex: 'num_of_stock',
			key: 'num_of_stock',
			width: 170,
			render: (text, record, row) => (
				<Input
					name="num_of_stock"
					value={productInfoOption.num_of_stock[row]}
					onChange={(e) => {
						let newArr = [...productInfoOption.num_of_stock];
						newArr[row] = e.target.value;
						setProductInfoOption({
							...productInfoOption,
							num_of_stock: newArr
						});
					}}
					type="text"
					style={{ border: 'none', width: '100%', height: '100%' }}
				/>
			)
		},
		{
			title: 'จำนวนสินค้าขั้นต่ำในสต็อก',
			dataIndex: 'min_of_stock',
			key: 'min_of_stock',
			width: 200,
			render: (text, record, row) => (
				<Input
					name="min_of_stock"
					value={productInfoOption.min_of_stock[row]}
					onChange={(e) => {
						let newArr = [...productInfoOption.min_of_stock];
						newArr[row] = e.target.value;
						setProductInfoOption({
							...productInfoOption,
							min_of_stock: newArr
						});
					}}
					type="text"
					style={{ border: 'none', width: '100%', height: '100%' }}
				/>
			)
		},
		{
			title: 'SKU',
			dataIndex: 'SKU',
			key: 'SKU',
			width: 200,
			render: (text, record, row) => (
				<Input
					name="SKU"
					value={productInfoOption.SKU[row]}
					onChange={(e) => {
						let newArr = [...productInfoOption.SKU];
						newArr[row] = e.target.value;

						setProductInfoOption({
							...productInfoOption,
							SKU: newArr
						});
					}}
					type="text"
					style={{
						border: 'none',
						borderRadius: '0px',
						width: '100%',
						height: '100%'
					}}
				/>
			)
		}
	];

	let dataProducts = [];

	for (let i = 0; i < productInfoOption.option_1.length; i++) {
		for (let j = 0; j < productInfoOption.option_2.length; j++) {
			if (option2State === true && optionProduct === true) {
				if (productInfoOption.option_2.length > 0) {
					if (
						productInfoOption.option_1[i] != null &&
						productInfoOption.option_2[j] != null
					) {
						dataProducts.push({
							key: i,
							option_1: productInfoOption.option_1[i],
							option_2: productInfoOption.option_2[j]
						});
					}
				}
			}
		}
		if (option2State === false && optionProduct === true) {
			if (productInfoOption.option_1[i] != null) {
				dataProducts.push({
					key: i,
					option_1: productInfoOption.option_1[i]
				});
			}
		}
	}

	//Merge array cells
	const createNewArr = (data) => {
		return data
			.reduce((result, item) => {
				//First, take the name field as a new array result
				if (result.indexOf(item.option_1) < 0) {
					result.push(item.option_1);
				}
				return result;
			}, [])

			.reduce((result, name) => {
				//Take the data with the same name as a new array, and add a new field * * rowSpan inside it**
				const children = data.filter((item) => item.option_1 === name);

				result = result.concat(
					children.map((item, index) => ({
						...item,
						rowSpan: index === 0 ? children.length : 0 //Add the first row of data to the rowSpan field
					}))
				);
				return result;
			}, []);
	};

	return (
		<div style={{ backgroundColor: '#F5F5F5' }}>
			<link
				href="https://fonts.googleapis.com/css2?family=Mitr:wght@200;300;400;500;600;700&display=swap"
				rel="stylesheet"
			/>
			<link href="style/addProduct.css" rel="stylesheet" />
			<script src="https://unpkg.com/sweetalert/dist/sweetalert.min.js"></script>
			<div className="container-form-add-pro">
				<Form size="large" onFinish={handleSubmit} autoComplete="off">
					<Card
						className="card-add-stock-product-shadow"
						hoverable
						style={{ margin: '20px 0 0 0 ', width: '100%', padding: '10px' }}
						cover={
							<>
								<span
									style={{
										fontSize: '18px',
										fontWeight: '800',
										color: 'black',
										margin: '0 0 10px 0'
									}}
								>
									ข้อมูลทั่วไป
								</span>
								<Form.Item
									label="ชื่อสินค้า"
									name="pro-name"
									style={{
										width: '100%',
										display: 'block'
									}}
									rules={[
										{
											required: true,
											message: 'โปรดใส่ชื่อสินค้าของคุณ'
										}
									]}
								>
									<Input
										placeholder="โปรดใส่ชื่อสินค้า"
										name="name"
										value={productInfo.name}
										onChange={handleChange}
									/>
								</Form.Item>

								<Form.Item
									style={{
										width: '100%',
										display: 'block'
									}}
									label="รายละเอียดสินค้า"
									name="pro-des"
									rules={[
										{
											required: true,
											min: 5,
											max: 5000,
											message:
												'โปรดใส่รายละเอียดสินค้าเกิน 50 ตัวอักษรและไม่เกิน 5000 ตัวอักษร'
										}
									]}
								>
									<Input.TextArea
										style={{ width: '100%', height: '100px' }}
										placeholder="โปรดใส่รายละเอียดสินค้าอย่างน้อย 50 ตัวอักษร"
										name="description"
										value={productInfo.description}
										onChange={handleChange}
									/>
								</Form.Item>
								<span
									style={{
										width: 'fit-content',
										margin: '0px 0px 10px 0px',
										color: 'gray',
										fontSize: '12px'
									}}
								>
									{productInfo.description.length <= 5000 && (
										<span>
											ไม่เกิน {productInfo.description.length}/5000 ตัวอักษร
										</span>
									)}
									{productInfo.description.length > 5000 && (
										<span style={{ color: 'red' }}>
											ไม่เกิน {productInfo.description.length}/5000 ตัวอักษร
										</span>
									)}
								</span>

								<Form.Item
									style={{ width: '100%' }}
									name="pro-type"
									rules={[
										{
											required: true,
											message: 'โปรดเลือกชนิดสินค้าของคุณ'
										}
									]}
								>
									<Cascader
										options={options}
										name="type"
										value={productInfo.type}
										onChange={handleChangeType}
										placeholder="โปรดเลือกชนิดสินค้า"
										style={{ width: '100%' }}
									/>
								</Form.Item>
							</>
						}
						bodyStyle={{
							padding: '0px'
						}}
					/>
					<div style={{ clear: 'both' }} />
					{optionProduct === false && (
						<Card
							className="card-add-stock-product-shadow"
							hoverable
							style={{ margin: '20px 0 0 0 ', width: '100%', padding: '10px' }}
							cover={
								<>
									<span
										style={{
											fontSize: '18px',
											fontWeight: '800',
											color: 'black',
											margin: '0 0 20px 0'
										}}
									>
										ข้อมูลการขาย
									</span>

									<div style={{ clear: 'both' }} />
									<Form.Item label="ตัวเลือกสินค้า">
										<Button
											style={{ margin: '0 10px 0 70px', width: '73%' }}
											type="dashed"
											onClick={() => {
												OptionProduct();
												setLenghPriceOption({
													...lenghtPriceOption,
													status: false,
													status_rank_price_product: [],
													min_rank_price: [],
													max_rank_price: [],
													price_per_piece: []
												});
											}}
											block
										>
											<PlusOutlined /> เปิดใช้งานตัวเลือกสินค้า
										</Button>

										<QuestionTooltip
											title="สำหรับสินค้าที่มีตัวเลือกหลายแบบ เช่น มีหลายสี มีหลายไซส์"
											TransitionComponent={Zoom}
											placement="top"
										>
											<QuestionCircleOutlined />
										</QuestionTooltip>
									</Form.Item>

									{lenghtPriceOption.status === false &&
										optionProduct === false && (
											<Form.Item label="ขายส่ง">
												<Button
													style={{ margin: '0 10px 0 110px', width: '68%' }}
													type="dashed"
													onClick={() => {
														setLenghPriceOption({
															...lenghtPriceOption,
															status: true,
															status_rank_price_product: []
														});
													}}
													block
												>
													<PlusOutlined /> เพิ่มช่วงราคา
												</Button>
												<QuestionTooltip
													title="สำหรับเพิ่มช่วงราคาสินค้าตามราคาขายส่ง เช่น ซื้อ 5 ชิ้นขึ้นไปราคา 10 บาท/ชิ้น , ซื้อ 10 ชิ้นขึ้นไปราคา 8 บาท/ชิ้น"
													TransitionComponent={Zoom}
													placement="top"
												>
													<QuestionCircleOutlined />
												</QuestionTooltip>
											</Form.Item>
										)}
									{lenghtPriceOption.status === true &&
										optionProduct === false && (
											<Form.Item>
												<Card
													className="card-add-stock-product-shadow"
													hoverable
													extra={
														<a
															onClick={() => {
																if (lenghtPriceOption.status === true) {
																	setLenghPriceOption({
																		...lenghtPriceOption,
																		status: false,
																		status_rank_price_product: []
																	});
																}
															}}
														>
															X
														</a>
													}
													style={{
														backgroundColor: '#F5F5F5',
														padding: '20px 20px 0px 20px',
														borderRadius: '5px'
													}}
													cover={
														<Form.Item
															label="ขายส่ง"
															style={{ display: 'block' }}
														>
															<Form.Item
																label="1. ช่วงราคาที่ 1"
																style={{
																	marginLeft: '27px',
																	marginRight: '30px',
																	display: 'flex'
																}}
																rules={[
																	{
																		required: true,
																		message: 'โปรดใส่ชื่อตัวเลือกสินค้า'
																	}
																]}
															>
																<Form.Item
																	style={{
																		width: '25%',
																		display: 'inline-flex',
																		margin: '0 10px 0 0'
																	}}
																>
																	<Input
																		name="min_rank_price"
																		maxLength='4'
																		value={lenghtPriceOption.min_rank_price[0]}
																		onChange={(e) => {
																			let newArrNext = [
																				...lenghtPriceOption.min_rank_price
																			];
																			for(let i=0; i<5; i++) {
																				if( i===0) {
																					newArrNext[0] = e.target.value;
																				}
																				
																				if(i>0) {
																					if(lenghtPriceOption.max_rank_price[i-1] === undefined 
																						|| lenghtPriceOption.max_rank_price[i-1] === '') 
																					{
																						newArrNext[i] = +newArrNext[i-1] +1
																					}
																					
																				}
																			}
																				
																			setLenghPriceOption({
																				...lenghtPriceOption,
																				min_rank_price: newArrNext
																			});
																		}}
																		placeholder="จำนวนต่ำสุด"
																	/>
																</Form.Item>
																<Form.Item
																	style={{
																		width: '25%',
																		display: 'inline-flex',
																		margin: '0 10px 0 0'
																	}}
																>
																	<Input
																		name="max_rank_price"
																		maxLength='4'
																		value={lenghtPriceOption.max_rank_price[0]}
																		onChange={(e) => {
																			let newArr = [
																				...lenghtPriceOption.max_rank_price
																			];
																			newArr[0] = e.target.value;

																			let newArrNext = [
																				...lenghtPriceOption.min_rank_price
																			];

																			for(let i=0; i<5; i++) {
																				let j = e.target.value
																				if(e.target.value !== '')
																				{
																					if(i===0) {
																						newArrNext[i] = lenghtPriceOption.min_rank_price[i]
																					}
																					if(i===1) {
																						newArrNext[i] = +j +1
																					}
																					if(i>1) {
																						newArrNext[i] = +newArrNext[i-1] +1
																					}
																				}
																				if(e.target.value.length === 0)
																				{
																					if(i===0) {
																						newArrNext[0] = lenghtPriceOption.min_rank_price[i];
																					}
																				
																					if(i>0) {
																							newArrNext[i] = +newArrNext[i-1] +1
																					}
																				}
																			}

																			setLenghPriceOption({
																				...lenghtPriceOption,
																				max_rank_price: newArr,
																				min_rank_price: newArrNext
																			})
																		}}
																		placeholder="จำนวนสูงสุด"
																	/>
																</Form.Item>
																<Form.Item
																	style={{
																		width: '40%',
																		display: 'inline-flex',
																		margin: '0 0 0 0'
																	}}
																>
																	<Input
																		name="rank_price"
																		value={lenghtPriceOption.price_per_piece[0]}
																		prefix="฿"
																		onChange={(e) => {
																			let newArr = [
																				...lenghtPriceOption.price_per_piece
																			];
																			newArr[0] = e.target.value;
																			setLenghPriceOption({
																				...lenghtPriceOption,
																				price_per_piece: newArr
																			});
																		}}
																		placeholder="หน่วยราคาต่อชิ้น"
																	/>
																</Form.Item>
															</Form.Item>

															<Form.List name="options_1">
																{(fields, { add, remove }) => {
																	if (
																		option_1.status === true &&
																		option_1.firstTime === true
																	) {
																		for (let i = 0; i < fields.length; i++) {
																			remove(fields[i].name);
																			remove(fields[i].fieldKey);
																			remove(fields[i].key);
																		}
																		setOption_1({
																			...option_1,
																			firstTime: false
																		});
																	}

																	return (
																		<div>
																			<Card
																				bodyStyle={{
																					padding: '0',
																					backgroundColor: '#F5F5F5'
																				}}
																			>
																				{fields.map((field) => {
																					let arr = 0;
																					if (field.name === 0) {
																						arr = 0;
																					}
																					if (field.name > 0) {
																						arr = +field.name;
																					}

																					return (
																						<div
																							key={field.key}
																							style={{
																								display: 'flex'
																							}}
																						>
																							<Form.Item
																								label={`${
																									field.name + 2
																								}. ช่วงราคาที่ ${
																									field.name + 2
																								}`}
																								{...field}
																								style={{
																									marginLeft: '25px',
																									marginRight: '10px'
																								}}
																								name={[field.name, 'option']}
																								fieldKey={[
																									field.fieldKey,
																									'option'
																								]}
																							>
																								<Input
																									name="min_rank_price"
																									disabled
																									maxLength='4'
																									value={lenghtPriceOption.min_rank_price[field.name+1]}
																									style={{
																										width: '25%',
																										display: 'inline-flex',
																										margin: '0 10px 0 0'
																									}}
																									placeholder="จำนวนต่ำสุด"
																								/>
																								<Input
																									name="max_rank_price"
																									maxLength='4'
																									value={
																										lenghtPriceOption
																											.max_rank_price[
																											field.name +  
																											1
																										]
																									}
																									onChange={(e) => {
																										let newArr = [
																											...lenghtPriceOption.max_rank_price
																										];

																										newArr[field.name + 1] = e.target.value;

																										let newArrNext = [
																											...lenghtPriceOption.min_rank_price
																										];

																										for(let i=0; i<5; i++) {
																											let j = e.target.value
																											if(i===0) {
																												newArrNext[i] = lenghtPriceOption.min_rank_price[i]
																											}

																											if(i>0) {
																												if(i===field.name+2) {
																													if(e.target.value.length <= 0) {
																														newArrNext[i] = +newArrNext[i-1] + 1
																													} else {
																														newArrNext[i] = +j + 1
																													}
																												}else{
																													if(newArr[i-1] === undefined || newArr[i-1] === '' ){
																														newArrNext[i] = +newArrNext[i-1] + 1
																													}else{
																														newArrNext[i] = +newArr[i-1] + 1
																													}
																												}
																											}
																										}
																										setLenghPriceOption({
																											...lenghtPriceOption,
																											max_rank_price: newArr,
																											min_rank_price: newArrNext
																										})
																									}}
																									style={{
																										width: '25%',
																										display: 'inline-flex',
																										margin: '0 10px 0 0'
																									}}
																									placeholder="จำนวนสูงสุด"
																								/>
																								<Input
																									name="rank_price"
																									maxLength='4'
																									value={
																										lenghtPriceOption.price_per_piece[field.name + 1]
																									}
																									prefix="฿"
																									onChange={(e) => {
																										let newArr = [
																											...lenghtPriceOption.price_per_piece
																										];
																										newArr[
																											field.name+1
																										] = e.target.value;

																										setLenghPriceOption({
																											...lenghtPriceOption,
																											price_per_piece: newArr
																										});
																									}}
																									style={{
																										width: '40%',
																										display: 'inline-flex'
																									}}
																									placeholder="หน่วยราคาต่อชิ้น"
																								/>
																							</Form.Item>
																							<Form.Item>
																								<MinusCircleOutlined
																									onClick={(e) => {
																										let newArrMin = [
																											...lenghtPriceOption.min_rank_price
																										];
																										let newArrMax = [
																											...lenghtPriceOption.max_rank_price
																										];
																										let newArrPrice = [
																											...lenghtPriceOption.price_per_piece
																										];

																										newArrMin[field.name+1] = undefined
																										newArrMax[field.name+1] = undefined
																										newArrPrice[field.name+1] = undefined

																										newArrMin = newArrMin.filter(item => item !== undefined)
																										newArrMax =	newArrMax.filter(item => item !== undefined)
																										newArrPrice = newArrPrice.filter(item => item !== undefined)

																										for(let i=0; i< newArrMin.length ; i++) {
																											if(i===0) {
																												newArrMin[i] = lenghtPriceOption.min_rank_price[i]
																											}

																											if(i>0) {
																												if(i===field.name+2) {
																													newArrMin[i] = +newArrMax[i-1] + 1
																												}else{
																													if(newArrMax[i-1] === undefined || newArrMax[i-1] === '' ){
																														newArrMin[i] = +newArrMin[i-1] + 1
																													}else{
																														newArrMin[i] = +newArrMax[i-1] + 1
																													}
																												}
																											}
																										}

																										setLenghPriceOption({
																											...lenghtPriceOption,
																											min_rank_price: newArrMin,
																											max_rank_price: newArrMax,
																											price_per_piece: newArrPrice
																										});
																										
																										remove(field.name);
																									}}
																								/>
																							</Form.Item>
																						</div>
																					);
																				})}
																			</Card>

																			{fields.length <= 3 && (
																				<Form.Item
																					style={{
																						marginLeft: '70px',
																						marginRight: '30px'
																					}}
																				>
																					<Button
																						type="dashed"
																						onClick={() => {
																							add();
																						}}
																						block
																					>
																						<PlusOutlined /> เพิ่มช่วงราคา
																					</Button>
																				</Form.Item>
																			)}
																		</div>
																	);
																}}
															</Form.List>
														</Form.Item>
													}
													bodyStyle={{ padding: '0' }}
												/>
											</Form.Item>
										)}

									<Form.Item
										label="ต้นทุนสินค้า"
										name="form-cost"
										style={{}}
										rules={[
											{
												required: true,
												message: 'โปรดใส่ต้นทุนสินค้า'
											}
										]}
									>
										<Input
											type="number"
											name="cost"
											value={productInfo.cost}
											onChange={handleChange}
											style={{ margin: '0 0 0 70px', width: '73%' }}
										/>
									</Form.Item>
										<span
											style={{
												margin: '0 10px 0 5px',
												color: 'black'
											}}
										>
											บาท/ชิ้น
										</span>
										<QuestionTooltip
											title="คือราคาต้นทุนของสินค้าของคุณรวมกับค่าใช้จ่ายจิปาถะอื่นๆ"
											TransitionComponent={Zoom}
											placement="top"
										>
											<QuestionCircleOutlined />
										</QuestionTooltip>

									<Form.Item
										label="ราคา"
										name="form-price"
										style={{}}
										rules={[
											{
												required: true,
												message: 'โปรดใส่ราคาสินค้า'
											}
										]}
									>
										<Input
											type="number"
											name="price"
											value={productInfo.price}
											onChange={handleChange}
											style={{ margin: '0 0px 0 110px', width: '68%' }}
										/>
										
									</Form.Item>
										<span
											style={{
												margin: '0 0px 0 5px',
												color: 'black'
											}}
										>
											บาท
										</span>

									{/* <Form.Item label="ส่วนลด" style={{}}>
									<Input
										type="Number"
										name="discount"
										value={productInfo.discount}
										onChange={handleChange}
										style={{ width: 210 }}
									/>
									<Select
										style={{
											margin: '0 0 0 5px',
											width: 80
										}}
										name="discountType"
										onChange={handleChangeDisType}
										defaultActiveFirstOption={productInfo.discountType}
										value={productInfo.discountType}
									>
										<Option value="บาท">บาท</Option>
										<Option value="เปอร์เซ็น">%</Option>
									</Select>
									<span
										style={{
											margin: '0 0 0 5px',
											fontSize: '14px',
											fontWeight: '500',
											color: 'black'
										}}
									>
										เท่ากับลด{' '}
										{productInfo.discountType === '' && (
											<span
												style={{
													color: 'red'
												}}
											>
												0 บาท
											</span>
										)}
										{productInfo.discountType === 'บาท' && (
											<span
												style={{
													color: 'red'
												}}
											>
												{productInfo.discount === '' ? (
													<span>0 บาท</span>
												) : (
													<span>{productInfo.discount} บาท</span>
												)}
											</span>
										)}
										{productInfo.discountType === 'เปอร์เซ็น' && (
											<span
												style={{
													color: 'red'
												}}
											>
												{productInfo.discount === '' ? (
													<span>0 บาท</span>
												) : (
													<span>
														{(productInfo.price * productInfo.discount) / 100}{' '}
														บาท
													</span>
												)}
											</span>
										)}{' '}
										เหลือ{' '}
										{productInfo.discountType === '' && (
											<span
												style={{
													color: 'green'
												}}
											>
												{productInfo.price === '' ? (
													<span>0 บาท</span>
												) : (
													<span>{productInfo.price} บาท</span>
												)}
											</span>
										)}
										{productInfo.discountType === 'บาท' && (
											<span
												style={{
													color: 'green'
												}}
											>
												{productInfo.price === '' ? (
													<span>0 บาท</span>
												) : (
													<span>
														{productInfo.price - productInfo.discount} บาท
													</span>
												)}
											</span>
										)}
										{productInfo.discountType === 'เปอร์เซ็น' && (
											<span
												style={{
													color: 'green'
												}}
											>
												{productInfo.price === '' ? (
													<span>0 บาท</span>
												) : (
													<span>
														{productInfo.price -
															(productInfo.price * productInfo.discount) /
																100}{' '}
														บาท
													</span>
												)}
											</span>
										)}
									</span>
								</Form.Item>

								{(productInfo.discount === '0' ||
									productInfo.discount === 0 ||
									productInfo.discount === '') && (
									<Form.Item
										style={{
											width: '100%'
										}}
										name="range-time-picker"
										label="ระยะเวลาลดราคา"
										{...rangeConfig}
									>
										<RangePicker
											showTime
											format="YYYY-MM-DD HH:mm:ss"
											onChange={TimeRelatedForm}
											style={{ width: '100%', padding: '0 10px 0 30px' }}
										/>
									</Form.Item>
								)}
								{productInfo.discount && productInfo.discount != 0 && (
									<Form.Item
										style={{
											width: '100%'
										}}
										name="range-time-picker"
										label="ระยะเวลาลดราคา"
										{...rangeConfig}
										rules={[
											{
												required: true,
												message: 'โปรดระบุระยะเวลาส่วนลด'
											}
										]}
									>
										<RangePicker
											showTime
											format="YYYY-MM-DD HH:mm:ss"
											onChange={TimeRelatedForm}
											style={{ width: '100%', padding: '0 10px 0 30px' }}
										/>
									</Form.Item>
								)} */}

									<Form.Item label="สินค้าหมดอายุสินค้า" style={{}}>
										<Select
											style={{
												width: 80
											}}
											name="statusExpiration"
											onChange={handleChangeExpType}
											defaultActiveFirstOption={productInfo.statusExpiration}
											value={productInfo.statusExpiration}
										>
											<Option value="ไม่มี">ไม่มี</Option>
											<Option value="มี">มี</Option>
										</Select>
										{(productInfo.statusExpiration === 'ไม่มี' ||
											productInfo.statusExpiration === '') && (
											<Form.Item
												style={{
													display: 'inline-flex',
													margin: '0 10px 0 10px'
												}}
												name="range-time-picker-exp"
												label="วันหมดอายุของสินค้า"
												{...rangeConfig}
											>
												<DatePicker
													format="YYYY-MM-DD"
													onChange={TimeRelatedFormExp}
													style={{
														width: '220px',
														padding: '0 10px 0 30px',
														margin: '0 10px 0 0'
													}}
												/>
												<QuestionTooltip
													title="สามารถกำหนดวันหมดอายุของสินค้าของคุณได้ เพื่อแจ้งเตือนคุณเมื่อสินค้าถึงวันหมดอายุ"
													TransitionComponent={Zoom}
													placement="top"
												>
													<QuestionCircleOutlined />
												</QuestionTooltip>
											</Form.Item>
										)}
										{productInfo.statusExpiration === 'มี' && (
											<Form.Item
												style={{
													display: 'inline-flex',
													margin: '0 10px 0 10px'
												}}
												name="range-time-picker-exp"
												label="วันหมดอายุของสินค้า"
												{...rangeConfig}
												rules={[
													{
														required: true,
														message: 'โปรดระบุวันหมดอายุสินค้า'
													}
												]}
											>
												<DatePicker
													format="YYYY-MM-DD"
													onChange={TimeRelatedFormExp}
													style={{
														width: '210px',
														padding: '0 10px 0 30px',
														margin: '0 10px 0 0'
													}}
												/>
												<QuestionTooltip
													title="สามารถกำหนดวันหมดอายุของสินค้าของคุณได้ เพื่อแจ้งเตือนคุณเมื่อสินค้าถึงวันหมดอายุ"
													TransitionComponent={Zoom}
													placement="top"
												>
													<QuestionCircleOutlined />
												</QuestionTooltip>
											</Form.Item>
										)}
									</Form.Item>

									<Form.Item
										label="แต้มสำหรับตัวแทนจำหน่าย"
										style={{}}
										rules={[
											{
												type: 'number',
												min: 0,
												max: 999999
											}
										]}
									>
										<Input
											type="Number"
											name="dis_point"
											value={productInfo.dis_point}
											onChange={handleChange}
											style={{ margin: '0 0 0 0px', width: '84%' }}
										/>
										<span
											style={{
												margin: '0 10px 0 10px',
												color: 'black'
											}}
										>
											แต้ม
										</span>
										<QuestionTooltip
											title="แต้มสำหรับตัวแทนจำหน่ายที่จะได้รับเมื่อซื้อสินค้าชิ้นนี้"
											TransitionComponent={Zoom}
											placement="top"
										>
											<QuestionCircleOutlined />
										</QuestionTooltip>
									</Form.Item>
									<Form.Item
										label="แต้มสำหรับสมาชิก"
										style={{}}
										rules={[
											{
												type: 'number',
												min: 0,
												max: 999999
											}
										]}
									>
										<Input
											type="Number"
											name="mem_point"
											value={productInfo.mem_point}
											onChange={handleChange}
											style={{ margin: '0 0 0 49px', width: '76%' }}
										/>
										<span style={{ margin: '0 10px 0 10px', color: 'black' }}>
											แต้ม
										</span>
										<QuestionTooltip
											title="แต้มสำหรับสมาชิกที่จะได้รับเมื่อซื้อสินค้าชิ้นนี้"
											TransitionComponent={Zoom}
											placement="top"
										>
											<QuestionCircleOutlined />
										</QuestionTooltip>
									</Form.Item>
									<Form.Item
										label="จำนวนสินค้าในสต็อก"
										style={{
											width: '100%'
										}}
									>
										<Input
											placeholder="โปรดใส่จำนวนสินค้าในสต็อก"
											name="num_of_stock"
											value={productInfo.num_of_stock}
											onChange={handleChange}
											style={{ margin: '0 0 0 36px', width: '78%' }}
										/>
										<span
											style={{
												margin: '0 10px 0 10px',
												color: 'black'
											}}
										>
											ชิ้น
										</span>
										<QuestionTooltip
											title="จำนวนสินค้าที่มีในสต็อก"
											TransitionComponent={Zoom}
											placement="top"
										>
											<QuestionCircleOutlined />
										</QuestionTooltip>
									</Form.Item>

									<Form.Item
										label="จำนวนสินค้าขั้นต่ำในสต็อก"
										style={{
											width: '100%'
										}}
									>
										<Input
											placeholder="โปรดใส่จำนวนสินค้าขั้นต่ำในสต็อก"
											name="min_of_stock"
											value={productInfo.min_of_stock}
											onChange={handleChange}
											style={{ margin: '0 0 0 5px', width: '83%' }}
										/>
										<span
											style={{
												margin: '0 10px 0 10px',
												color: 'black'
											}}
										>
											ชิ้น
										</span>
										<QuestionTooltip
											title="เราจะแจ้งเตือนคุณเมื่อสินค้าชิ้นนี้มีจำนวนในสต็อกถึงขั้นต่ำที่กำหนด"
											TransitionComponent={Zoom}
											placement="top"
										>
											<QuestionCircleOutlined />
										</QuestionTooltip>
									</Form.Item>

									{/* <Form.List name="users">
									{(fields, { add, remove }) => {
										return (
											<div
												style={{
													width: '100%'
												}}
											>
												{fields.map((field) => (
													<Space key={field.key} style={{ marginBottom: 8 }}>
														<Form.Item
															{...field}
															name={[field.name, 'option_name']}
															fieldKey={[field.fieldKey, 'option_name']}
															rules={[
																{
																	required: true,
																	message: 'โปรดใส่ชื่อตัวเลือกสินค้า'
																}
															]}
														>
															<Input placeholder="ใส่ชื่อตัวเลือกสินค้า เช่น สี ไซส์..." />
														</Form.Item>

														<Form.Item
															{...field}
															name={[field.name, 'option']}
															fieldKey={[field.fieldKey, 'option']}
															rules={[
																{
																	required: true,
																	message: 'โปรดใส่ตัวเลือกสินค้า'
																}
															]}
														>
															<Input placeholder="ใส่ข้อมูลตัวเลือกสินค้า เช่น สีดำ สีแดง..." />
														</Form.Item>

														<MinusCircleOutlined
															onClick={() => {
																remove(field.name);
															}}
														/>
													</Space>
												))}

												<Form.Item label="ตัวเลือกสินค้า">
													<Button
														type="dashed"
														onClick={() => {
															add();
														}}
														block
													>
														<PlusOutlined /> เปิดใช้งานตัวเลือกสินค้า
													</Button>
												</Form.Item>
											</div>
										);
									}}
								</Form.List> */}
								</>
							}
							bodyStyle={{
								padding: '0px'
							}}
						/>
					)}
					{optionProduct === true && (
						<Card
							className="card-add-stock-product-shadow"
							hoverable
							style={{ margin: '20px 0 0 0 ', width: '100%', padding: '10px' }}
							cover={
								<>
									<span
										style={{
											fontSize: '18px',
											fontWeight: '800',
											color: 'black',
											margin: '0 0 0 0'
										}}
									>
										ข้อมูลการขาย
									</span>

									<div style={{ clear: 'both' }} />
									<Form.Item>
										<Card
											className="card-add-stock-product-shadow"
											hoverable
											style={{
												margin: '20px 0 0 0 ',
												width: '100%',
												padding: '10px'
											}}
											cover={
												<>
													<div style={{ clear: 'both' }} />
													<Form.Item label="ตัวเลือกที่ 1">
														<Card
															extra={
																option_1.status === true &&
																option_2.status === false && (
																	<a
																		onClick={() => {
																			if (
																				option_1.status === true &&
																				option_2.status === false
																			) {
																				OptionProduct();
																				setOption_1({
																					...option_1,
																					status: false,
																					firstTime: false
																				});
																				dataProducts = [];
																				setProductInfoOption({
																					option_name_1: [],
																					option_1: [],
																					option_name_2: [],
																					option_2: [],
																					cost: [],
																					price: [],
																					dis_point: [],
																					mem_point: [],
																					num_of_stock: [],
																					min_of_stock: [],
																					SKU: []
																				});
																				setLenghPriceOption({
																					...lenghtPriceOption,
																					status: false,

																					status_rank_price_product: []
																				});
																			}
																		}}
																	>
																		X
																	</a>
																)
															}
															style={{
																backgroundColor: '#F5F5F5',
																padding: '20px 20px 0px 20px',
																borderRadius: '5px'
															}}
														>
															<Form.Item
																label="ชื่อ"
																style={{
																	marginLeft: '27px',
																	marginRight: '30px'
																}}
																rules={[
																	{
																		required: true,
																		message: 'โปรดใส่ชื่อตัวเลือกสินค้า'
																	}
																]}
															>
																<Input
																	name="name"
																	value={option_1.name}
																	onChange={(e) => {
																			setProductInfoOption({
																				...productInfoOption,
																				option_name_1: e.target.value
																			});
																		}}
																	placeholder="ใส่ชื่อตัวเลือกสินค้า เช่น สี ไซส์..."
																/>
															</Form.Item>

															<Form.List name="options_1">
																{(fields, { add, remove }) => {
																	if (
																		option_1.status === true &&
																		option_1.firstTime === true
																	) {
																		for (let i = 0; i < fields.length; i++) {
																			remove(fields[i].name);
																			remove(fields[i].fieldKey);
																			remove(fields[i].key);
																		}
																		setOption_1({
																			...option_1,
																			firstTime: false
																		});
																	}

																	return (
																		<div>
																			<Card
																				bodyStyle={{
																					padding: '0',
																					backgroundColor: '#F5F5F5'
																				}}
																			>
																				{fields.map((field) => (
																					<div
																						key={field.key}
																						style={{
																							display: 'flex'
																						}}
																					>
																						<Form.Item
																							{...field}
																							style={{
																								marginLeft: '70px',
																								marginRight: '10px'
																							}}
																							name={[field.name, 'option']}
																							fieldKey={[
																								field.fieldKey,
																								'option'
																							]}
																							rules={[
																								{
																									required: true,
																									message:
																										'โปรดใส่ตัวเลือกสินค้า'
																								}
																							]}
																						>
																							<Input
																								name="option"
																								value={
																									productInfoOption.option_1[
																										field.fieldKey
																									]
																								}
																								onChange={(e) => {
																									let newArrOption = [
																										...productInfoOption.option_1
																									];
																									newArrOption[field.fieldKey] =
																										e.target.value;
																									setProductInfoOption({
																										...productInfoOption,
																										option_1: newArrOption
																									});
																								}}
																								style={{
																									width: '365px'
																								}}
																								placeholder="ใส่ข้อมูลตัวเลือกสินค้า เช่น สีดำ สีแดง..."
																							/>
																						</Form.Item>
																						<Form.Item>
																							<MinusCircleOutlined
																								onClick={(e) => {
																									remove(field.name);
																									let newArr = [
																										...productInfoOption.option_1
																									];

																									newArr[field.fieldKey] = null;

																									setProductInfoOption({
																										...productInfoOption,
																										option_1: newArr,
																										status_product: [],
																										cost: [],
																										price: [],
																										dis_point: [],
																										mem_point: [],
																										num_of_stock: [],
																										min_of_stock: [],
																										SKU: []
																									});
																								}}
																							/>
																						</Form.Item>
																					</div>
																				))}
																			</Card>

																			<Form.Item
																				style={{
																					marginLeft: '70px',
																					marginRight: '30px'
																				}}
																			>
																				<Button
																					type="dashed"
																					onClick={() => {
																						add();
																					}}
																					block
																				>
																					<PlusOutlined /> เพิ่มตัวเลือก
																				</Button>
																			</Form.Item>
																		</div>
																	);
																}}
															</Form.List>
														</Card>
													</Form.Item>
													<Form.Item label="ตัวเลือกที่ 2">
														{option2State === true && (
															<Card
																extra={
																	<a
																		onClick={() => {
																			setOption2State(false);
																			setOption_2({
																				...option_2,
																				status: false,
																				firstTime: false
																			});
																			dataProducts = [];
																			setProductInfoOption({
																				...productInfoOption,
																				option_name_2: [],
																				option_2: [],
																				status_product: [],
																				cost: [],
																				price: [],
																				dis_point: [],
																				mem_point: [],
																				num_of_stock: [],
																				min_of_stock: [],
																				SKU: []
																			});
																			setLenghPriceOption({
																				...lenghtPriceOption,
																				status_rank_price_product: []
																			});
																		}}
																	>
																		X
																	</a>
																}
																style={{
																	backgroundColor: '#F5F5F5',
																	padding: '20px 20px 0px 20px',
																	borderRadius: '5px'
																}}
															>
																<Form.Item
																	label="ชื่อ"
																	style={{
																		marginLeft: '27px',
																		marginRight: '30px'
																	}}
																	rules={[
																		{
																			required: true,
																			message: 'โปรดใส่ชื่อตัวเลือกสินค้า'
																		}
																	]}
																>
																	<Input
																		name="name"
																		value={productInfoOption.option_name_2}
																		onChange={(e) => {
																			setProductInfoOption({
																				...productInfoOption,
																				option_name_2: e.target.value
																			});
																		}}
																		placeholder="ใส่ชื่อตัวเลือกสินค้า เช่น สี ไซส์..."
																	/>
																</Form.Item>

																<Form.List name="options_2">
																	{(fields, { add, remove }) => {
																		if (
																			option_2.status === true &&
																			option_2.firstTime === true
																		) {
																			for (let i = 0; i < fields.length; i++) {
																				remove(fields[i].name);
																				remove(fields[i].fieldKey);
																				remove(fields[i].key);
																			}
																			setOption_2({
																				...option_2,
																				firstTime: false
																			});
																		}

																		return (
																			<div>
																				<Card
																					bodyStyle={{
																						padding: '0',
																						backgroundColor: '#F5F5F5'
																					}}
																				>
																					{fields.map((field) => (
																						<div
																							style={{
																								display: 'flex'
																							}}
																						>
																							<Form.Item
																								style={{
																									marginLeft: '70px',
																									marginRight: '10px'
																								}}
																								name={[field.name, 'option']}
																								fieldKey={[
																									field.fieldKey,
																									'option'
																								]}
																								rules={[
																									{
																										required: true,
																										message:
																											'โปรดใส่ตัวเลือกสินค้า'
																									}
																								]}
																							>
																								<Input
																									name="option_2"
																									onChange={(e) => {
																										let newArrOption = [
																											...productInfoOption.option_2
																										];
																										newArrOption[
																											field.fieldKey
																										] = e.target.value;
																										setProductInfoOption({
																											...productInfoOption,
																											option_2: newArrOption,
																											status_product: [],
																											cost: [],
																											price: [],
																											dis_point: [],
																											mem_point: [],
																											num_of_stock: [],
																											min_of_stock: [],
																											SKU: []
																										});
																									}}
																									style={{
																										width: '365px'
																									}}
																									placeholder="ใส่ข้อมูลตัวเลือกสินค้า เช่น สีดำ สีแดง..."
																								/>
																							</Form.Item>
																							<Form.Item>
																								<MinusCircleOutlined
																									onClick={() => {
																										remove(field.name);
																										let newArr = [
																											...productInfoOption.option_2
																										];

																										newArr[
																											field.fieldKey
																										] = null;

																										setProductInfoOption({
																											...productInfoOption,
																											option_2: newArr,
																											status_product: [],
																											cost: [],
																											price: [],
																											dis_point: [],
																											mem_point: [],
																											num_of_stock: [],
																											min_of_stock: [],
																											SKU: []
																										});
																									}}
																								/>
																							</Form.Item>
																						</div>
																					))}
																				</Card>

																				<Form.Item
																					style={{
																						marginLeft: '70px',
																						marginRight: '30px'
																					}}
																				>
																					<Button
																						type="dashed"
																						onClick={() => {
																							add();
																						}}
																						block
																					>
																						<PlusOutlined /> เพิ่มตัวเลือก
																					</Button>
																				</Form.Item>
																			</div>
																		);
																	}}
																</Form.List>
															</Card>
														)}

														{option2State === false && (
															<Form.Item>
																<Button
																	type="dashed"
																	onClick={() => {
																		setOption2State(true);
																		setOption_2({
																			...option_2,
																			status: true,
																			firstTime: true
																		});
																	}}
																	block
																>
																	<PlusOutlined /> เพิ่ม
																</Button>
															</Form.Item>
														)}
													</Form.Item>

													<Form.Item
														label="ข้อมูลตัวเลือกสินค้า"
													>
														<Input 
															name="price" prefix="฿" placeholder="ราคา" 
															style={{width: '18%', margin: '0 5px 0 0'}} value={takeAllProduct.price}
															onChange={(e) => handleChangeTakeAllProduct(e)}/>
														<Input 
															name="stock" placeholder="คลัง" 
															style={{width: '18%', margin: '0 5px 0 0'}} value={takeAllProduct.stock}
															onChange={(e) => handleChangeTakeAllProduct(e)}/>
														<Input 
															name="SKU" placeholder="SKU" value={takeAllProduct.SKU}
															style={{width: '30%', margin: '0 5px 0 0'}} 
															onChange={(e) => handleChangeTakeAllProduct(e)}/>
														<Button 
															style={{backgroundColor: 'orange', color: 'white', 
															fontWeight: '700', fontSize: '12px'}}
															onClick={(e) => {
																let arrPrice = [...productInfoOption.price]
																let arrStock = [...productInfoOption.num_of_stock]
																let arrSKU = [...productInfoOption.SKU]

																if (option_1.status === true && option_2.status === false) {
																	for (let i=0; i< productInfoOption.option_name_1.length; i++ ){
																		arrPrice[i] = takeAllProduct.price
																		arrStock[i] = takeAllProduct.stock
																		arrSKU[i] = takeAllProduct.SKU
																	}
																}
																if (option_1.status === true && option_2.status === true) {
																	let Length = productInfoOption.option_name_1.length * productInfoOption.option_name_2.length
																	for (let i=0; i< Length; i++ ){
																		arrPrice[i] = takeAllProduct.price
																		arrStock[i] = takeAllProduct.stock
																		arrSKU[i] = takeAllProduct.SKU
																	}
																}
																setProductInfoOption({
																	...productInfoOption,
																	price: arrPrice,
																	num_of_stock: arrStock,
																	SKU: arrSKU
																})
																setTakeAllProduct({
																	price: [],
																	stock: [],
																	SKU: []
																})
															}}>
															อัพเดตกับสินค้าทั้งหมด
														</Button>

													</Form.Item>

													<Form.Item
														label="รายการตัวเลือกสินค้า"
														style={{ display: 'block' }}
													>
														<Table
															scroll={{ x: 100 }}
															bordered
															columns={
																option_2.status === false
																	? columns_one_option
																	: columns_two_option
															}
															dataSource={
																option_2.status === false
																	? dataProducts
																	: createNewArr(dataProducts)
															}
															pagination={false}
														/>
													</Form.Item>
												</>
											}
											bodyStyle={{
												padding: '0px'
											}}
										/>
									</Form.Item>
									{lenghtPriceOption.status === false && (
										<Form.Item>
											<Card
												className="card-add-stock-product-shadow"
												hoverable
												style={{
													margin: '0 0 0 0 ',
													width: '100%',
													padding: '20px 20px 0px 20px'
												}}
												cover={
													<>
														<Form.Item label="ขายส่ง">
															<Button
																style={{ margin: '0 10px 0 0px', width: '95%' }}
																type="dashed"
																onClick={() => {
																	let arrPrice = [...productInfoOption.price]
																	let arrStatus = [...productInfoOption.status_product]
																	let price
																	let state = true

																	if (option_1.status === true && option_2.status === false) {
																		for (let i=0; i< productInfoOption.option_name_1.length; i++ ){
																			if (arrPrice[i] !== '') {
																				price = arrPrice[i]
																				break
																			}
																		}
																		for (let i=0; i< productInfoOption.option_name_1.length; i++ ){
																			if (arrPrice[i] === price) {
																				state = true
																			} else {
																				state = false
																				break
																			}
																		}
																		if (state === true) {
																			setLenghPriceOption({
																				...lenghtPriceOption,
																				status: true
																			});									
																		} else {
																			swal('', 'โปรดใส่ราคาสินค้าให้เท่ากัน', 'warning');
																		}
																	}
																	if (option_1.status === true && option_2.status === true) {
																		let Length = productInfoOption.option_1.length * productInfoOption.option_2.length
																		// for (let i=0; i< productInfoOption.option_name_1.length * productInfoOption.option_name_2.length; i++ ){
																		// 	if (arrPrice[i] !== '' && arrStatus[i] === true 
																		// 	){
																		// 		Length++
																		// 	}
																		// }
																		for (let i=0; i< Length; i++ ) {
																			if (arrPrice[i] !== '' && arrStatus[i] === true
																			&& arrPrice[i] !== undefined &&  arrStatus[i] !== undefined) {
																				price = arrPrice[i]
																				break
																			}
																		}
																		for (let i=0; i< Length; i++ ) {
																			if (arrPrice[i] !== undefined && arrPrice[i] !== '' 
																			&& arrStatus[i] === true){
																				if (+arrPrice[i] === +price) {
																					state = true
																				} else {
																					state = false
																					break
																				}
																			}
																		}
																		if (state === true) {
																			setLenghPriceOption({
																				...lenghtPriceOption,
																				status: true
																			});									
																		} else {
																			swal('', 'โปรดใส่ราคาสินค้าให้เท่ากัน', 'warning');
																		}
																	}
																	
																}}
																block
															>
																<PlusOutlined /> เพิ่มช่วงราคา
															</Button>
															<QuestionTooltip
																title="สำหรับเพิ่มช่วงราคาสินค้าตามราคาขายส่ง เช่น ซื้อ 5 ชิ้นขึ้นไปราคา 10 บาท/ชิ้น , ซื้อ 10 ชิ้นขึ้นไปราคา 8 บาท/ชิ้น"
																TransitionComponent={Zoom}
																placement="top"
															>
																<QuestionCircleOutlined />
															</QuestionTooltip>
														</Form.Item>
													</>
												}
												bodyStyle={{ padding: '0' }}
											/>
										</Form.Item>
									)}
									{lenghtPriceOption.status === true && (
										<Form.Item>
											<Card
												className="card-add-stock-product-shadow"
												hoverable
												extra={
													<a
														onClick={() => {
															if (lenghtPriceOption.status === true) {
																setLenghPriceOption({
																	...lenghtPriceOption,
																	status: false,
																	status_rank_price_product: []
																});
															}
														}}
													>
														X
													</a>
												}
												style={{
													backgroundColor: '#F5F5F5',
													padding: '20px 20px 0px 20px',
													borderRadius: '5px'
												}}
												cover={
													<Form.Item
														label="ขายส่ง"
														style={{ display: 'block' }}
													>
														<Form.Item
															label="1. ช่วงราคาที่ 1"
															style={{
																marginLeft: '27px',
																marginRight: '30px',
																display: 'flex'
															}}
															rules={[
																{
																	required: true,
																	message: 'โปรดใส่ชื่อตัวเลือกสินค้า'
																}
															]}
														>
															<Form.Item
																style={{
																	width: '25%',
																	display: 'inline-flex',
																	margin: '0 10px 0 0'
																}}
															>
																<Input
																	name="min_rank_price"
																	maxLength='4'
																	value={lenghtPriceOption.min_rank_price[0]}
																	onChange={(e) => {
																		let newArrNext = [
																			...lenghtPriceOption.min_rank_price
																		];
																		for(let i=0; i<5; i++) {
																			if( i===0) {
																				newArrNext[0] = e.target.value;
																			}
																			
																			if(i>0) {
																				if(lenghtPriceOption.max_rank_price[i-1] === undefined 
																					|| lenghtPriceOption.max_rank_price[i-1] === '') 
																				{
																					newArrNext[i] = +newArrNext[i-1] +1
																				}
																				
																			}
																		}
																			
																		setLenghPriceOption({
																			...lenghtPriceOption,
																			min_rank_price: newArrNext
																		});
																	}}
																	placeholder="จำนวนต่ำสุด"
																/>
															</Form.Item>
															<Form.Item
																style={{
																	width: '25%',
																	display: 'inline-flex',
																	margin: '0 10px 0 0'
																}}
															>
																<Input
																	name="max_rank_price"
																	maxLength='4'
																	value={lenghtPriceOption.max_rank_price[0]}
																	onChange={(e) => {
																		let newArr = [
																			...lenghtPriceOption.max_rank_price
																		];
																		newArr[0] = e.target.value;

																		let newArrNext = [
																			...lenghtPriceOption.min_rank_price
																		];

																		for(let i=0; i<5; i++) {
																			let j = e.target.value
																			if(e.target.value !== '')
																			{
																				if(i===0) {
																					newArrNext[i] = lenghtPriceOption.min_rank_price[i]
																				}
																				if(i===1) {
																					newArrNext[i] = +j +1
																				}
																				if(i>1) {
																					newArrNext[i] = +newArrNext[i-1] +1
																				}
																			}
																			if(e.target.value.length === 0)
																			{
																				if(i===0) {
																					newArrNext[0] = lenghtPriceOption.min_rank_price[i];
																				}
																			
																				if(i>0) {
																						newArrNext[i] = +newArrNext[i-1] +1
																				}
																			}
																		}

																		setLenghPriceOption({
																			...lenghtPriceOption,
																			max_rank_price: newArr,
																			min_rank_price: newArrNext
																		})
																	}}
																	placeholder="จำนวนสูงสุด"
																/>
															</Form.Item>
															<Form.Item
																style={{
																	width: '40%',
																	display: 'inline-flex',
																	margin: '0 0 0 0'
																}}
															>
																<Input
																	name="rank_price"
																	value={lenghtPriceOption.price_per_piece[0]}
																	prefix="฿"
																	onChange={(e) => {
																		let newArr = [
																			...lenghtPriceOption.price_per_piece
																		];
																		newArr[0] = e.target.value;
																		setLenghPriceOption({
																			...lenghtPriceOption,
																			price_per_piece: newArr
																		});
																	}}
																	placeholder="หน่วยราคาต่อชิ้น"
																/>
															</Form.Item>
														</Form.Item>

														<Form.List name="options_1">
															{(fields, { add, remove }) => {
																if (
																	option_1.status === true &&
																	option_1.firstTime === true
																) {
																	for (let i = 0; i < fields.length; i++) {
																		remove(fields[i].name);
																		remove(fields[i].fieldKey);
																		remove(fields[i].key);
																	}
																	setOption_1({
																		...option_1,
																		firstTime: false
																	});
																}

																return (
																	<div>
																		<Card
																			bodyStyle={{
																				padding: '0',
																				backgroundColor: '#F5F5F5'
																			}}
																		>
																			{fields.map((field) => {
																				let arr = 0;
																				if (field.name === 0) {
																					arr = 0;
																				}
																				if (field.name > 0) {
																					arr = +field.name;
																				}

																				return (
																					<div
																						key={field.key}
																						style={{
																							display: 'flex'
																						}}
																					>
																						<Form.Item
																							label={`${
																								field.name + 2
																							}. ช่วงราคาที่ ${
																								field.name + 2
																							}`}
																							{...field}
																							style={{
																								marginLeft: '25px',
																								marginRight: '10px'
																							}}
																							name={[field.name, 'option']}
																							fieldKey={[
																								field.fieldKey,
																								'option'
																							]}
																						>
																							<Input
																								name="min_rank_price"
																								disabled
																								maxLength='4'
																								value={lenghtPriceOption.min_rank_price[field.name+1]}
																								style={{
																									width: '25%',
																									display: 'inline-flex',
																									margin: '0 10px 0 0'
																								}}
																								placeholder="จำนวนต่ำสุด"
																							/>
																							<Input
																								name="max_rank_price"
																								maxLength='4'
																								value={
																									lenghtPriceOption
																										.max_rank_price[
																										field.name +  
																										1
																									]
																								}
																								onChange={(e) => {
																									let newArr = [
																										...lenghtPriceOption.max_rank_price
																									];

																									newArr[field.name + 1] = e.target.value;

																									let newArrNext = [
																										...lenghtPriceOption.min_rank_price
																									];

																									for(let i=0; i<5; i++) {
																										let j = e.target.value
																										if(i===0) {
																											newArrNext[i] = lenghtPriceOption.min_rank_price[i]
																										}

																										if(i>0) {
																											if(i===field.name+2) {
																												if(e.target.value.length <= 0) {
																													newArrNext[i] = +newArrNext[i-1] + 1
																												} else {
																													newArrNext[i] = +j + 1
																												}
																											}else{
																												if(newArr[i-1] === undefined || newArr[i-1] === '' ){
																													newArrNext[i] = +newArrNext[i-1] + 1
																												}else{
																													newArrNext[i] = +newArr[i-1] + 1
																												}
																											}
																										}
																									}
																									setLenghPriceOption({
																										...lenghtPriceOption,
																										max_rank_price: newArr,
																										min_rank_price: newArrNext
																									})
																								}}
																								style={{
																									width: '25%',
																									display: 'inline-flex',
																									margin: '0 10px 0 0'
																								}}
																								placeholder="จำนวนสูงสุด"
																							/>
																							<Input
																								name="rank_price"
																								maxLength='4'
																								value={
																									lenghtPriceOption.price_per_piece[field.name + 1]
																								}
																								prefix="฿"
																								onChange={(e) => {
																									let newArr = [
																										...lenghtPriceOption.price_per_piece
																									];
																									newArr[
																										field.name+1
																									] = e.target.value;

																									setLenghPriceOption({
																										...lenghtPriceOption,
																										price_per_piece: newArr
																									});
																								}}
																								style={{
																									width: '40%',
																									display: 'inline-flex'
																								}}
																								placeholder="หน่วยราคาต่อชิ้น"
																							/>
																						</Form.Item>
																						<Form.Item>
																							<MinusCircleOutlined
																								onClick={(e) => {
																									let newArrMin = [
																										...lenghtPriceOption.min_rank_price
																									];
																									let newArrMax = [
																										...lenghtPriceOption.max_rank_price
																									];
																									let newArrPrice = [
																										...lenghtPriceOption.price_per_piece
																									];

																									newArrMin[field.name+1] = undefined
																									newArrMax[field.name+1] = undefined
																									newArrPrice[field.name+1] = undefined

																									newArrMin = newArrMin.filter(item => item !== undefined)
																									newArrMax =	newArrMax.filter(item => item !== undefined)
																									newArrPrice = newArrPrice.filter(item => item !== undefined)

																									for(let i=0; i< newArrMin.length ; i++) {
																										if(i===0) {
																											newArrMin[i] = lenghtPriceOption.min_rank_price[i]
																										}

																										if(i>0) {
																											if(i===field.name+2) {
																												newArrMin[i] = +newArrMax[i-1] + 1
																											}else{
																												if(newArrMax[i-1] === undefined || newArrMax[i-1] === '' ){
																													newArrMin[i] = +newArrMin[i-1] + 1
																												}else{
																													newArrMin[i] = +newArrMax[i-1] + 1
																												}
																											}
																										}
																									}

																									setLenghPriceOption({
																										...lenghtPriceOption,
																										min_rank_price: newArrMin,
																										max_rank_price: newArrMax,
																										price_per_piece: newArrPrice
																									});
																									
																									remove(field.name);
																								}}
																							/>
																						</Form.Item>
																					</div>
																				);
																			})}
																		</Card>

																		{fields.length <= 3 && (
																			<Form.Item
																				style={{
																					marginLeft: '70px',
																					marginRight: '30px'
																				}}
																			>
																				<Button
																					type="dashed"
																					onClick={() => {
																						add();
																					}}
																					block
																				>
																					<PlusOutlined /> เพิ่มช่วงราคา
																				</Button>
																			</Form.Item>
																		)}
																	</div>
																);
															}}
														</Form.List>
													</Form.Item>
												}
												bodyStyle={{ padding: '0' }}
											/>
										</Form.Item>
									)}
								</>
							}
							bodyStyle={{
								padding: '0px'
							}}
						/>
					)}
					{/* //! จัดการสื่อ */}
					{optionProduct === false && (
						<Card
							className="card-add-stock-product-shadow"
							hoverable
							style={{ margin: '20px 0 0 0 ', width: '100%', padding: '10px' }}
							cover={
								<>
									<span
										style={{
											fontSize: '18px',
											fontWeight: '800',
											color: 'black',
											margin: '0 0 10px 0'
										}}
									>
										การจัดการสื่อ
									</span>

									<Form.Item style={{ width: '100%', margin: '0' }}>
										<div className="clearfix">
											<label>อัพโหลดรูปสินค้า</label>
											<ImgCrop rotate>
												<Upload
													listType="picture-card"
													fileList={fileList}
													onPreview={handleUploadImgPreview}
													onChange={handleChangeUploadImgPro}
												>
													{fileList != null && fileList.length >= 9
														? null
														: uploadButton}
												</Upload>
											</ImgCrop>
											<Modal
												visible={previewVisible}
												footer={null}
												onCancel={handleUploadeImgCancel}
											>
												<img
													alt="example"
													style={{ width: '100%' }}
													src={previewImage}
												/>
											</Modal>
										</div>
										<label
											style={{
												fontSize: '12px',
												fontWeight: '500',
												color: 'gray'
											}}
										>
											อัพโหลดรูปสินค้าได้ 9 รูปภาพต่อ 1 สินค้า
											{fileList.length < 1 && productInfo.name != '' && (
												<span style={{ color: 'red' }}>
													{[' ']}(โปรดใส่รูปภาพสินค้าอย่างน้อย 1 รูป)
												</span>
											)}
										</label>
									</Form.Item>
								</>
							}
							bodyStyle={{
								padding: '0px'
							}}
						/>
					)}
					{optionProduct === true && (
						<Card
							className="card-add-stock-product-shadow"
							hoverable
							style={{ margin: '20px 0 0 0 ', width: '100%', padding: '10px' }}
							cover={
								<>
									<span
										style={{
											fontSize: '18px',
											fontWeight: '800',
											color: 'black',
											margin: '0 0 10px 0'
										}}
									>
										การจัดการสื่อ
									</span>

									<Form.Item style={{ width: '100%', margin: '0' }}>
										<div className="clearfix" />
										<label>อัพโหลดรูปสินค้า</label>

										<ImgCrop rotate>
											<Upload
												listType="picture-card"
												fileList={fileList}
												onPreview={handleUploadImgPreview}
												onChange={handleChangeUploadImgPro}
											>
												{fileList != null && fileList.length >= 9
													? null
													: uploadButton}
											</Upload>
										</ImgCrop>
										<Modal
											visible={previewVisible}
											footer={null}
											onCancel={handleUploadeImgCancel}
										>
											<img
												alt="example"
												style={{ width: '100%' }}
												src={previewImage}
											/>
										</Modal>

										<label
											style={{
												fontSize: '12px',
												fontWeight: '500',
												color: 'gray'
											}}
										>
											อัพโหลดรูปสินค้าได้ 9 รูปภาพต่อ 1 สินค้า
											{fileList.length < 1 && productInfo.name != '' && (
												<span style={{ color: 'red' }}>
													{[' ']}(โปรดใส่รูปภาพสินค้าอย่างน้อย 1 รูป)
												</span>
											)}
										</label>
									</Form.Item>

									<Form.Item
										style={{
											width: '100%',
											margin: '0'
										}}
									>
										<div className="clearfix" />
										<label style={{ display: 'flex', marginTop: '10px' }}>
											รูปภาพตัวเลือกสินค้า
											<p style={{ marginLeft: '10px' }} />
											{productInfoOption.option_name_1} : <br />
										</label>

										{productInfoOption.option_1.map((option) => {
											let j;
											for (
												let i = 0;
												i < productInfoOption.option_1.length;
												i++
											) {
												if (productInfoOption.option_1[i] === option) {
													j = i;
												}
											}

											let fileListLength = 0;
											for (let i = 0; i < fileListOption.fileList.length; i++) {
												if (fileListOption.fileList[i] !== undefined) {
													fileListLength++;
												}
											}
											return (
												<Form.Item style={{ display: 'inline-block' }}>
													<div
														style={{
															display: 'inline',
															width: '20%'
														}}
													>
														<ImgCrop rotate>
															<Upload
																style={{
																	display: 'inline'
																}}
																listType="picture-card"
																// fileList={fileListOption}
																onPreview={handleUploadImgPreviewOption}
																onChange={(e) => {
																	handleChangeUploadImgProOption(e, j);
																}}
															>
																{fileListOption.fileList != null &&
																fileListOption.fileList[j]
																	? // fileListLength ===
																	  // 	productInfoOption.option_1.length
																	  null
																	: uploadButton}
															</Upload>
														</ImgCrop>

														<Modal
															visible={previewVisibleOption}
															footer={null}
															onCancel={handleUploadeImgCancelOption}
														>
															<img
																alt="example"
																style={{ width: '100%' }}
																src={previewImageOption}
															/>
														</Modal>
														<label
															style={{
																fontSize: '12px',
																fontWeight: '500',
																color: 'gray',
																paddingLeft: '10px'
															}}
														>
															{option}
															{fileListOption.length < 1 &&
																productInfo.name != '' && (
																	<span style={{ color: 'red' }}>
																		{[' ']}(โปรดใส่รูปภาพสินค้าอย่างน้อย 1 รูป)
																	</span>
																)}
														</label>
													</div>
												</Form.Item>
											);
										})}
									</Form.Item>
								</>
							}
							bodyStyle={{
								padding: '0px'
							}}
						/>
					)}
					{/* //! การจัดส่ง */}
					<Card
						className="card-add-stock-product-shadow"
						hoverable
						style={{ margin: '20px 0 0 0 ', width: '100%', padding: '10px' }}
						cover={
							<>
								<span
									style={{
										fontSize: '18px',
										fontWeight: '800',
										color: 'black'
									}}
								>
									การจัดส่ง
								</span>
							</>
						}
						bodyStyle={{
							padding: '0px'
						}}
					/>
					<Card
						className="card-add-stock-product-shadow"
						hoverable
						style={{ margin: '20px 0 0 0 ', width: '100%', padding: '10px' }}
						cover={
							<>
								<span
									style={{
										fontSize: '18px',
										fontWeight: '800',
										color: 'black'
									}}
								>
									อื่นๆ
								</span>
								<Form.Item
									label="Parent SKU"
									style={{
										width: '100%'
									}}
									name="form-sku"
									rules={[
										{
											required: true,
											message: 'โปรดใส่ SKU สินค้า'
										}
									]}
								>
									<Input
										placeholder="โปรดใส่ SKU สินค้า"
										name="ParentSKU"
										value={productInfo.ParentSKU}
										onChange={handleChange}
										style={{ margin: '0 10px 0 0', width: '95%' }}
									/>
								</Form.Item>
								<QuestionTooltip
									title="prompt text"
									TransitionComponent={Zoom}
									placement="top"
								>
									<QuestionCircleOutlined />
								</QuestionTooltip>
							</>
						}
						bodyStyle={{
							padding: '0px'
						}}
					/>
					<Form.Item>
						<Button
							htmlType="submit"
							style={{
								width: '100%',
								height: '70px',
								margin: '20px 0px 0px 0px',
								background: 'linear-gradient(to right, #67b26b, #4ca2cb)',
								color: 'white',
								fontSize: '18px',
								fontWeight: '500'
							}}
						>
							เพิ่มสินค้า
						</Button>
					</Form.Item>
				</Form>
			</div>
		</div>
	);
};

export default AddProduct;
