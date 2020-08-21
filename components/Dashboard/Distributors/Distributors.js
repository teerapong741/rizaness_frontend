import React, {useState} from 'react';
import {Tabs, Table, Tag, Input, Space, Button, Popconfirm, Card } from 'antd'
import {
	SearchOutlined, PlusSquareFilled, 
	EditFilled, DeleteFilled, SettingOutlined
} from '@ant-design/icons'
import Highlighter from 'react-highlight-words';
import OrgChart from '../../../node_modules/@balkangraph/orgchart.js'
import $ from 'jquery'

const {TabPane} = Tabs
const { Meta } = Card;

const gridStyle = {
  width: '25%',
  textAlign: 'center'
};

const fakeFamilyTree = [
	{
		id: '1',
		name: 'A',
		img: 'https://cdn.balkan.app/shared/5.jpg',
		subWorkForce: [
			{
				id: '1_1',
				name: 'C',
				img: 'https://cdn.balkan.app/shared/5.jpg',
				subWorkForce: [
					{
						id: '1_1_1',
						name: 'H',
						img: 'https://cdn.balkan.app/shared/5.jpg',
						subWorkForce: []
					},
					{
						id: '1_1_2',
						name: 'I',
						img: 'https://cdn.balkan.app/shared/5.jpg',
						subWorkForce: [
							{
								id: '1_1_2_1',
								name: 'M',
								img: 'https://cdn.balkan.app/shared/5.jpg',
								subWorkForce: []
							},
							{
								id: '1_1_2_2',
								name: 'N',
								img: 'https://cdn.balkan.app/shared/5.jpg',
								subWorkForce: []
							}			
						]
					}
				]
			},
			{
				id: '1_2',
				name: 'D',
				img: 'https://cdn.balkan.app/shared/5.jpg',
				subWorkForce: []
			},
			{
				id: '1_3',
				name: 'E',
				img: 'https://cdn.balkan.app/shared/5.jpg',
				subWorkForce: [
					{
						id: '1_3_1',
						name: 'J',
						img: 'https://cdn.balkan.app/shared/5.jpg',
						subWorkForce: []
					}
				]
			}
		]
	},
	{
		id: '2',
		name: 'B',
		img: 'https://cdn.balkan.app/shared/5.jpg',
		subWorkForce: [
			{
				id: '2_1',
				name: 'F',
				img: 'https://cdn.balkan.app/shared/5.jpg',
				subWorkForce: []
			},
			{
				id: '2_2',
				name: 'G',
				img: 'https://cdn.balkan.app/shared/5.jpg',
				subWorkForce: [
					{
						id: '2_2_1',
						name: 'K',
						img: 'https://cdn.balkan.app/shared/5.jpg',
						subWorkForce: [
							{
								id: '2_2_1_1',
								name: 'O',
								img: 'https://cdn.balkan.app/shared/5.jpg',
								subWorkForce: []
							},
							{
								id: '2_2_1_2',
								name: 'P',
								img: 'https://cdn.balkan.app/shared/5.jpg',
								subWorkForce: [
									{
										id: '2_2_1_2_1',
										name: 'R',
										img: 'https://cdn.balkan.app/shared/5.jpg',
										subWorkForce: []
									}
								]
							},
							{
								id: '2_2_1_3',
								name: 'Q',
								img: 'https://cdn.balkan.app/shared/5.jpg',
								subWorkForce: []
							}
						]
					},
					{
						id: '2_2_2',
						name: 'L',
						img: 'https://cdn.balkan.app/shared/5.jpg',
						subWorkForce: []
					}
				]
			}
		]
	}
]

const fakePattern = {
	layer_depth: 5,
	workforce_per_row: 2
}

const Distributors = () => {
	let dataProduct = [];
	const [key, setKey] = useState('1')
	const [selectedRowKeys, setSelectedRowKeys] = useState([]);
	let [filteredInfo, setFilteredInfo] = useState(null);
	let [sortedInfo, setSortedInfo] = useState(null);
	const [statusFamilyTreeDemo, setStatusFamilyTreeDemo] = useState(false)
	let treeData = []
	const fakeData = []
	const fakeClink = []

	fakeData.push(
		{
			id: 1,
			name: 'Maha Shop',
			img: 'https://cdn.balkan.app/shared/1.jpg'
		}
	)
			
	let ID = 2
	let row = 1
	let count = 1
	for (let i=1; i<=fakePattern.layer_depth;i++){
		for(let j=0; j<count;j++){
			let arrID = []
			for(let k=0; k<fakePattern.workforce_per_row; k++){
				console.log(name)
				fakeData.push({
					id: ID,
					pid: row,
					tags: [`depth${i}`]
				})
				arrID.push(ID)
				ID += 1
			}
			fakeClink.push({
				from: arrID[0],
				to: arrID[1],
				label: 'มีตัวแทนในชั้นนี้สูงสุด 5 คน',
				template: "yellow"
			})
			row +=1
		}
		count *= fakePattern.workforce_per_row
	}
	console.log(fakeClink)

	const rowSelection = {
		selectedRowKeys,
		onChange: onSelectChange
	};

	const hasSelected = selectedRowKeys.length > 0;
	sortedInfo = sortedInfo || {};
	filteredInfo = filteredInfo || {};

	const handleChange = (pagination, filters, sorter) => {
		// console.log('Various parameters', pagination, filters, sorter);
		setFilteredInfo(filters);
		setSortedInfo(sorter);
	};

	const onSelectChange = (selectedRowKeys) => {
		setSelectedRowKeys(selectedRowKeys);
	};

	const handleChangeStatusFamilyTreeDemo = () => {
		setTimeout(async function(){
			await setStatusFamilyTreeDemo(!statusFamilyTreeDemo)
			await setFamilyTreeDemo()
		}, 500)
		
	}

	const setFamilyTreeDemo = () => {
	let treeData = document.getElementById("tree")
		if (treeData !== null){
			OrgChart.templates.deborah = Object.assign({}, OrgChart.templates.deborah);
			OrgChart.templates.deborah.field_0 = 
			'<text width="350px" text-overflow="ellipsis"  style="font-size: 60px; font-weight: 800;" fill="#000000" x="75" y="-20" text-anchor="middle">{val}</text>';
			var chart = new OrgChart(treeData, {
				template: "deborah",
				layout: OrgChart.tree,
				align: OrgChart.ORIENTATION,
				scaleInitial: -100 ,
				toolbar: {
					layout: true,
					zoom: true,
					fit: true
				},
				nodeBinding: {
					field_0: "name",
					field_number_children: function(sender, node){
						return OrgChart.childrenCount(sender, node);
					}
				},
				nodes: fakeData
			})
		}
		
	}	

	// if (loading) {
	// 	return (
	// 		<p style={{ textAlign: 'center', marginTop: '200px' }}>
	// 			<LoadingOutlined style={{ fontSize: '200px' }} />
	// 			<p style={{ fontSize: '50px', fontWeight: 'bold' }}>Loading</p>
	// 		</p>
	// 	);
	// }

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

	return (
		<div>
			<link
				href="https://fonts.googleapis.com/css2?family=Mitr:wght@200;300;400;500;600;700&display=swap"
				rel="stylesheet"
			/>
			<link rel="stylesheet" href="style/distributors.css" />
			<div>
			<div className="container-span" 
				style={{width: '100%', textAlign: 'center', fontSize: '30px', fontWeight: '800'}}
			>
				<span>จัดการตัวแทนจำหน่าย</span>
			</div>
			<Tabs
				defaultActiveKey={key}
				type="card"
				onChange={(e) => setKey({key: e.key})}
			>
				<TabPane tab="รูปแบบตัวแทน" key="1">
					<div style={{position:'relative', width: '100%', height: '40px'}}>
						<Button style={{position:'absolute', right: '0px'}} size="large" type="primary" icon={<SettingOutlined />}>ตั้งค่ารูปแบบตัวแทน</Button>
					</div>
					<div style={{fontWeight: 'bold', fontSize: '20px', textAlign: 'center'}}>
						<Card style={{margin: '10px 0 0 0 '}} title="รูปแบบตัวแทนของร้านคุณ">
							<Card.Grid style={gridStyle}>
							มีลูกทีมติดตัวได้สูงสุด 5 คน
							</Card.Grid>
							<Card.Grid style={gridStyle}>
							มีรายได้ลึกลงไป 4 ชั้น
							</Card.Grid>
							<Card.Grid style={gridStyle}>
							มีระบบขั้นตัวแทน 3 ระบบ
							</Card.Grid>
							<Card.Grid style={gridStyle}>
							มีระบบแต้มสะสม
							</Card.Grid>
						</Card>
					</div>
					<Tabs type="card" onChange={handleChangeStatusFamilyTreeDemo} style={{width: '100%', height: '100%', margin: '20px 0 0 0'}}>
						<TabPane tab="ระดับขั้นตัวแทนจำหน่าย" key="1" style={{width: '100%', backgroundColor: 'red'}}>
							<Card headStyle={{backgroundColor: 'none', fontWeight: '700', fontSize: '18px', color: 'black', textAlign: 'center'}} title="ระดับขั้นตัวแทนจำหน่าย">
								<Card headStyle={{backgroundColor: 'none', fontWeight: '700', fontSize: '18px', color: 'black'}} type="inner" title="ระดับ Starter" style={{margin: '20px 0 0 0'}}>
									<p style={{color: 'black', fontSize: '13px', fontWeight: 'bold'}}>สิ่งที่ได้รับจากระดับขั้น</p>
									<p>- ส่วนลดในการซื้อสินค้า 0.2 %</p>
									<p>– ใช้สื่อต่างๆของทางบริษัทได้ (โดยทางบริษัทจะจัดทำแจกให้เรื่อยๆ)</p>
									<br/>
									<p style={{color: 'black', fontSize: '13px', fontWeight: 'bold'}}>เงื่อนไขการเป็นตัวแทน</p>
									<p>- ซื้อ Ubereen Collagen 10 กระป๋อง ขึ้นไป</p>
									<br/>
									<p style={{color: 'black', fontSize: '13px', fontWeight: 'bold'}}>เงื่อนไขการรักษาสภาพระดับขั้น</p>
									<p>– เปิดบิล Ubereen ไม่ต่ำกว่า 5 กระป๋อง / เดือน</p>
								</Card>
								<Card headStyle={{backgroundColor: '#87CEFA', fontWeight: '700', fontSize: '18px', color: 'black'}} type="inner" title="ระดับ Business" style={{margin: '20px 0 0 0'}}>
									<p style={{color: 'black', fontSize: '13px', fontWeight: 'bold'}}>สิ่งที่ได้รับจากระดับขั้น</p>
									<p>- ส่วนลดในการซื้อสินค้า 0.5 %</p>
									<p>– ใช้สื่อต่างๆของทางบริษัทได้ (โดยทางบริษัทจะจัดทำแจกให้เรื่อยๆ)</p>
									<br/>
									<p style={{color: 'black', fontSize: '13px', fontWeight: 'bold'}}>เงื่อนไขการเป็นตัวแทน</p>
									<p>- ซื้อ Ubereen Collagen 50 กระป๋อง ขึ้นไป</p>
									<br/>
									<p style={{color: 'black', fontSize: '13px', fontWeight: 'bold'}}>เงื่อนไขการรักษาสภาพระดับขั้น</p>
									<p>– เปิดบิล Ubereen ไม่ต่ำกว่า 10 กระป๋อง / เดือน</p>
								</Card>
								<Card headStyle={{backgroundColor: 'gold', fontWeight: '700', fontSize: '18px', color: 'black'}} type="inner" title="ระดับ VIP" style={{margin: '20px 0 0 0'}}>
									<p style={{color: 'black', fontSize: '13px', fontWeight: 'bold'}}>สิ่งที่ได้รับจากระดับขั้น</p>
									<p>- ส่วนลดในการซื้อสินค้า 5 %</p>
									<p>– ใช้สื่อต่างๆของทางบริษัทได้ (โดยทางบริษัทจะจัดทำแจกให้เรื่อยๆ)</p>
									<br/>
									<p style={{color: 'black', fontSize: '13px', fontWeight: 'bold'}}>เงื่อนไขการเป็นตัวแทน</p>
									<p>- ซื้อ Ubereen Collagen 500 กระป๋อง ขึ้นไป</p>
									<br/>
									<p style={{color: 'black', fontSize: '13px', fontWeight: 'bold'}}>เงื่อนไขการรักษาสภาพระดับขั้น</p>
									<p>– เปิดบิล Ubereen ไม่ต่ำกว่า 100 กระป๋อง / ต่อเดือน</p>
								</Card>
							</Card>
						</TabPane>
						<TabPane tab="ภาพรวมรูปแบบตัวแทน" key="2" style={{width: '100%'}}>
							<script src="https://balkangraph.com/js/latest/OrgChart.js"/>
							<div id="tree" style={{backgroundColor: 'white',width: '100%', height: '400px'}}/>
							<div style={{backgroundColor: 'red', width: '100%', height: '100%'}}>
								<Card>
									<Card.Grid
										style={gridStyle}
									>
										<Meta
										style={{height: '100%'}}
										title="จะมีตัวแทนได้สูงสุด"
										description={<code>781 คนต่อ 1 สายงาน</code>}
										/>
									</Card.Grid>
									<Card.Grid
										style={gridStyle}
									>
										<Meta
										avatar={<div style={{width: '20px', height: '20px', backgroundColor: '#F57C00'}} />}
										title="ตัวแทนชั้นที่ 1"
										description={<code>- มีจำนวนตัวแทนในชั้นนีได้ไม่จำกัด<br/>- ได้รับส่วนลดในการซื้อสินค้า 12 %</code>}
										/>
									</Card.Grid>
									<Card.Grid
										style={gridStyle}
									>
										<Meta
										avatar={<div style={{width: '20px', height: '20px', backgroundColor: '#F57C'}} />}
										title="ตัวแทนชั้นที่ 2"
										description={<code>- มีจำนวนตัวแทนในชั้นนีได้สูงสุด 5 คน<br/>- ได้รับส่วนลดในการซื้อสินค้า 9 %</code>}
										/>
									</Card.Grid>
									<Card.Grid
										style={gridStyle}
									>
										<Meta
										avatar={<div style={{width: '20px', height: '20px', backgroundColor: '#FFFF00'}} />}
										title="ตัวแทนชั้นที่ 3"
										description={<code>- มีจำนวนตัวแทนในชั้นนีได้สูงสุด 5 คน<br/>- ได้รับส่วนลดในการซื้อสินค้า 7 %</code>}
										/>
									</Card.Grid>
									<Card.Grid
										style={gridStyle}
									>
										<Meta
										avatar={<div style={{width: '20px', height: '20px', backgroundColor: '#99FF00'}} />}
										title="ตัวแทนชั้นที่ 4"
										description={<code>- มีจำนวนตัวแทนในชั้นนีได้สูงสุด 5 คน<br/>- ได้รับส่วนลดในการซื้อสินค้า 5 %</code>}
										/>
									</Card.Grid>
									<Card.Grid
										style={gridStyle}
									>
										<Meta
										avatar={<div style={{width: '20px', height: '20px', backgroundColor: '#00CED1'}} />}
										title="ตัวแทนชั้นที่ 5"
										description={<code>- มีจำนวนตัวแทนในชั้นนีได้สูงสุด 5 คน<br/>- ได้รับส่วนลดในการซื้อสินค้า 3 %</code>}
										/>
									</Card.Grid>	
								</Card>
							</div>
						</TabPane>
					</Tabs>
				</TabPane>
				<TabPane tab="ตัวแทนทั้งหมด" key="2">
					<Table
						// rowKey={data.user.products.id}
						rowSelection={rowSelection}
						columns={columns}
						dataSource={dataProduct}
						onChange={handleChange}
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
						scroll={{ x: 100 }}
					/>
				</TabPane>
			</Tabs>
			</div>
		</div>
	);
};

export default Distributors;
