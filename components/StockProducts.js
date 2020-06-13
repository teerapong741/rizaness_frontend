import React from 'react';
import { Tabs, Table, Tag, Space, Button, Input } from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined, EditFilled, DeleteFilled } from '@ant-design/icons';

const { TabPane } = Tabs;

const data = [
	{
		key: '1',
		name: 'A',
		type: 'A',
		imageUrl:
			'data:image/jpeg;base64,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',
		price: 500,
		discountType: 'Percent',
		discount: '20%',
		num_of_sold: '20',
		num_put_basket_now: '2',
		num_put_basket: '30',
		traffic: '235',
		status_show: ['กำลังจำหน่าย', 'หมดสต็อก', 'สินค้าใกล้หมด', 'เลิกจำหน่าย'],
		status_product: ['ขายดี', 'ลดราคา', 'สินค้าใหม่', 'โปรโมชั่น'],
		SKU: 'A'
	},
	{
		key: '2',
		name: 'B',
		type: 'B',
		imageUrl: 'https://inwfile.com/s-dp/tdbj3i.jpg',
		price: 400,
		discountType: 'Baht',
		discount: '50',
		num_of_sold: '20',
		num_put_basket_now: '2',
		num_put_basket: '30',
		traffic: '235',
		status_show: ['กำลังจำหน่าย', 'หมดสต็อก', 'สินค้าใกล้หมด', 'เลิกจำหน่าย'],
		status_product: ['ขายดี', 'ลดราคา', 'สินค้าใหม่', 'โปรโมชั่น'],
		SKU: 'B'
	}
];

class StockProducts extends React.Component {
	state = {
		key: '1',
		searchText: '',
		searchedColumn: '',
		filteredInfo: null,
		sortedInfo: null,
		selectedRowKeys: [], // Check here to configure the default column
		loading: false
	};

	start = () => {
		this.setState({ loading: true });
		// ajax request after empty completing
		setTimeout(() => {
			this.setState({
				selectedRowKeys: [],
				loading: false
			});
		}, 1000);
	};

	onSelectChange = (selectedRowKeys) => {
		console.log('selectedRowKeys changed: ', selectedRowKeys);
		this.setState({ selectedRowKeys });
	};

	handleChange = (pagination, filters, sorter) => {
		console.log('Various parameters', pagination, filters, sorter);
		this.setState({
			filteredInfo: filters,
			sortedInfo: sorter
		});
	};

	clearFilters = () => {
		this.setState({ filteredInfo: null });
	};

	clearAll = () => {
		this.setState({
			filteredInfo: null,
			sortedInfo: null
		});
	};

	getColumnSearchProps = (dataIndex) => ({
		filterDropdown: ({
			setSelectedKeys,
			selectedKeys,
			confirm,
			clearFilters
		}) => (
			<div style={{ padding: 8 }}>
				<Input
					ref={(node) => {
						this.searchInput = node;
					}}
					placeholder={`Search ${dataIndex}`}
					value={selectedKeys[0]}
					onChange={(e) =>
						setSelectedKeys(e.target.value ? [e.target.value] : [])
					}
					onPressEnter={() =>
						this.handleSearch(selectedKeys, confirm, dataIndex)
					}
					style={{ width: 188, marginBottom: 8, display: 'block' }}
				/>
				<Space>
					<Button
						type="primary"
						onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
						icon={<SearchOutlined />}
						size="small"
						style={{ width: 90 }}
					>
						Search
					</Button>
					<Button
						onClick={() => this.handleReset(clearFilters)}
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
				setTimeout(() => this.searchInput.select());
			}
		},
		render: (text) =>
			this.state.searchedColumn === dataIndex ? (
				<Highlighter
					highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
					searchWords={[this.state.searchText]}
					autoEscape
					textToHighlight={text.toString()}
				/>
			) : (
				text
			)
	});

	handleSearch = (selectedKeys, confirm, dataIndex) => {
		confirm();
		this.setState({
			searchText: selectedKeys[0],
			searchedColumn: dataIndex
		});
	};

	handleReset = (clearFilters) => {
		clearFilters();
		this.setState({ searchText: '' });
	};

	render() {
		const { loading, selectedRowKeys } = this.state;
		const rowSelection = {
			selectedRowKeys,
			onChange: this.onSelectChange
		};
		const hasSelected = selectedRowKeys.length > 0;

		let { sortedInfo, filteredInfo } = this.state;
		sortedInfo = sortedInfo || {};
		filteredInfo = filteredInfo || {};

		const columns = [
			{
				title: 'Name',
				dataIndex: 'name',
				key: 'name',
				...this.getColumnSearchProps('name'),
				render: (text) => <a>{text}</a>,
				sorter: (a, b) => a.name.localeCompare(b.name),
				sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order,
				ellipsis: true
			},
			{
				title: 'Type',
				dataIndex: 'type',
				key: 'type',
				...this.getColumnSearchProps('type'),
				sorter: (a, b) => a.type.localeCompare(b.type),
				sortOrder: sortedInfo.columnKey === 'type' && sortedInfo.order,
				ellipsis: true
			},
			{
				title: 'Images',
				dataIndex: 'imageUrl',
				key: 'imageUrl',
				render: (text) => (
					<img style={{ width: '60px', height: '60px' }} src={text} />
				)
			},
			{
				title: 'Price',
				dataIndex: 'price',
				key: 'price',
				...this.getColumnSearchProps('price'),
				sorter: (a, b) => a.price - b.price,
				sortOrder: sortedInfo.columnKey === 'price' && sortedInfo.order,
				ellipsis: true
			},
			{
				title: 'Discount Type',
				dataIndex: 'discountType',
				key: 'discountType',
				filters: [
					{ text: 'Percent', value: 'Percent' },
					{ text: 'Baht', value: 'Baht' }
				],
				filteredValue: filteredInfo.discountType || null,
				onFilter: (value, record) => record.discountType.includes(value),
				sortOrder: sortedInfo.columnKey === 'discountType' && sortedInfo.order,
				ellipsis: true
			},
			{
				title: 'Discount',
				dataIndex: 'discount',
				key: 'discount',
				...this.getColumnSearchProps('discount'),
				sorter: (a, b) => a.price - b.price,
				sortOrder: sortedInfo.columnKey === 'discount_type' && sortedInfo.order,
				ellipsis: true
			},
			{
				title: 'Number of sold',
				dataIndex: 'num_of_sold',
				key: 'num_of_sold',
				...this.getColumnSearchProps('num_of_sold'),
				sorter: (a, b) => a.num_of_sold - b.num_of_sold,
				sortOrder: sortedInfo.columnKey === 'num_of_sold' && sortedInfo.order,
				ellipsis: true
			},
			{
				title: 'Number put in basket',
				dataIndex: 'num_put_basket',
				key: 'num_put_basket',
				...this.getColumnSearchProps('num_put_basket'),
				sorter: (a, b) => a.num_put_basket - b.num_put_basket,
				sortOrder:
					sortedInfo.columnKey === 'num_put_basket' && sortedInfo.order,
				ellipsis: true
			},
			{
				title: 'Number put in basket now',
				dataIndex: 'num_put_basket_now',
				key: 'num_put_basket_now',
				...this.getColumnSearchProps('num_put_basket_now'),
				sorter: (a, b) => a.num_put_basket_now - b.num_put_basket_now,
				sortOrder:
					sortedInfo.columnKey === 'num_put_basket_now' && sortedInfo.order,
				ellipsis: true
			},
			{
				title: 'Traffic',
				dataIndex: 'traffic',
				key: 'traffic',
				...this.getColumnSearchProps('traffic'),
				sorter: (a, b) => a.traffic - b.traffic,
				sortOrder: sortedInfo.columnKey === 'traffic' && sortedInfo.order,
				ellipsis: true
			},
			{
				title: 'Status Normal',
				key: 'status_show',
				dataIndex: 'status_show',
				filters: [
					{ text: 'ขายดี', value: 'ขายดี' },
					{ text: 'ลดราคา', value: 'ลดราคา' },
					{ text: 'สินค้ามาใหม่', value: 'สินค้ามาใหม่' },
					{ text: 'โปรโมชั่น', value: 'โปรโมชั่น' }
				],
				filteredValue: filteredInfo.status_show || null,
				sorter: (a, b) => a.status_show.localeCompare(b.status_show),
				sortOrder: sortedInfo.columnKey === 'status_show' && sortedInfo.order,
				ellipsis: true,
				render: (status_show) => (
					<>
						{status_show.map((status_show) => {
							let color;
							if (status_show === 'ขายดี') {
								color = '#99FF33';
							} else if (status_show === 'ลดราคา') {
								color = '#FF9999';
							} else if (status_show === 'สินค้าใหม่') {
								color = '#FF0000';
							} else if (status_show === 'โปรโมชั่น') {
								color = '#66FFFF';
							}
							return (
								<Tag color={color} key={status_show}>
									{status_show.toUpperCase()}
								</Tag>
							);
						})}
					</>
				)
			},
			{
				title: 'Status Sale',
				key: 'status_product',
				dataIndex: 'status_product',
				filters: [
					{ text: 'กำลังจำหน่าย', value: 'กำลังจำหน่าย' },
					{ text: 'หมดสต็อก', value: 'หมดสต็อก' },
					{ text: 'สินค้าใกล้หมด', value: 'สินค้าใกล้หมด' },
					{ text: 'เลิกจำหน่าย', value: 'เลิกจำหน่าย' }
				],
				filteredValue: filteredInfo.status_product || null,
				sorter: (a, b) => a.status_product.localeCompare(b.status_product),
				sortOrder:
					sortedInfo.columnKey === 'status_product' && sortedInfo.order,
				ellipsis: true,
				render: (status_product) => (
					<>
						{status_product.map((status_product) => {
							let color;
							if (status_product === 'กำลังจำหน่าย') {
								color = '#99FF33';
							} else if (status_product === 'หมดสต็อก') {
								color = '#FF9999';
							} else if (status_product === 'สินค้าใกล้หมด') {
								color = '#FF0000';
							} else if (status_product === 'เลิกจำหน่าย') {
								color = '#BEBEBE';
							}
							return (
								<Tag color={color} key={status_product}>
									{status_product.toUpperCase()}
								</Tag>
							);
						})}
					</>
				)
			},
			{
				title: 'SKU',
				dataIndex: 'SKU',
				key: 'SKU',
				...this.getColumnSearchProps('SKU'),
				sorter: (a, b) => a.SKU.localeCompare(b.SKU),
				sortOrder: sortedInfo.columnKey === 'SKU' && sortedInfo.order,
				ellipsis: true
			},
			{
				title: 'Action',
				key: 'action',
				render: (text, record) => (
					<Space size="middle">
						<a>
							<EditFilled />
						</a>
						<a>
							<DeleteFilled />
						</a>
						<a>
							<SearchOutlined />
						</a>
					</Space>
				)
			}
		];
		return (
			<Tabs
				defaultActiveKey={this.state.key}
				type="card"
				onChange={(e) => this.setState({ key: e.key })}
			>
				<TabPane tab="ทั้งหมด" key="1">
					<div style={{ marginBottom: 16 }}>
						<Button onClick={this.clearFilters} style={{ marginRight: 8 }}>
							Clear filters
						</Button>
						<Button onClick={this.clearAll} style={{ marginRight: 8 }}>
							Clear filters and sorters
						</Button>
						<Button
							type="primary"
							onClick={this.start}
							disabled={!hasSelected}
							loading={loading}
						>
							Reload
						</Button>
						<span style={{ marginLeft: 8 }}>
							{hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
						</span>
					</div>

					<Table
						rowSelection={rowSelection}
						columns={columns}
						dataSource={data}
						onChange={this.handleChange}
						pagination={{
							position: ['bottomLeft'],
							total: data.length,
							showQuickJumper: true,
							showSizeChanger: true,
							showTotal: (total) => `Total ${total} item`
						}}
					/>
				</TabPane>
				<TabPane tab="กำลังจำหน่าย" key="2">
					<div style={{ marginBottom: 16 }}>
						<Button onClick={this.clearFilters} style={{ marginRight: 8 }}>
							Clear filters
						</Button>
						<Button onClick={this.clearAll} style={{ marginRight: 8 }}>
							Clear filters and sorters
						</Button>
						<Button
							type="primary"
							onClick={this.start}
							disabled={!hasSelected}
							loading={loading}
						>
							Reload
						</Button>
						<span style={{ marginLeft: 8 }}>
							{hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
						</span>
					</div>

					<Table
						rowSelection={rowSelection}
						columns={columns}
						dataSource={data}
						onChange={this.handleChange}
						pagination={{
							position: ['bottomLeft'],
							total: data.length,
							showQuickJumper: true,
							showSizeChanger: true,
							showTotal: (total) => `Total ${total} item`
						}}
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
							onClick={this.start}
							disabled={!hasSelected}
							loading={loading}
						>
							Reload
						</Button>
						<span style={{ marginLeft: 8 }}>
							{hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
						</span>
					</div>

					<Table
						rowSelection={rowSelection}
						columns={columns}
						dataSource={data}
						onChange={this.handleChange}
						pagination={{
							position: ['bottomLeft'],
							total: data.length,
							showQuickJumper: true,
							showSizeChanger: true,
							showTotal: (total) => `Total ${total} item`
						}}
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
							onClick={this.start}
							disabled={!hasSelected}
							loading={loading}
						>
							Reload
						</Button>
						<span style={{ marginLeft: 8 }}>
							{hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
						</span>
					</div>

					<Table
						rowSelection={rowSelection}
						columns={columns}
						dataSource={data}
						onChange={this.handleChange}
						pagination={{
							position: ['bottomLeft'],
							total: data.length,
							showQuickJumper: true,
							showSizeChanger: true,
							showTotal: (total) => `Total ${total} item`
						}}
					/>
				</TabPane>
			</Tabs>
		);
	}
}

export default StockProducts;
