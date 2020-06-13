import {
	Table,
	Input,
	Button,
	Space,
	Tag,
	Tabs,
	Pagination,
	Radio
} from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined, EditFilled, DeleteFilled } from '@ant-design/icons';

const { TabPane } = Tabs;

const data = [
	{
		key: '1',
		name: 'A',
		age: 32,
		address: 'New York No. 1 Lake Park',
		tags: ['nice', 'developer']
	},
	{
		key: '2',
		name: 'C',
		age: 42,
		address: 'London No. 1 Lake Park',
		tags: ['loser']
	},
	{
		key: '3',
		name: 'B',
		age: 32,
		address: 'Sidney No. 1 Lake Park',
		tags: ['cool', 'teacher']
	},
	{
		key: '4',
		name: 'Z',
		age: 32,
		address: 'New York No. 1 Lake Park',
		tags: ['nice', 'developer']
	}
];

class OrderProducts extends React.Component {
	state = {
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
				width: '30%',
				...this.getColumnSearchProps('name'),
				render: (text) => <a>{text}</a>,
				filters: [
					{ text: 'Joe', value: 'Joe' },
					{ text: 'Jim', value: 'Jim' }
				],
				filteredValue: filteredInfo.name || null,
				onFilter: (value, record) => record.name.includes(value),
				sorter: (a, b) => a.name.localeCompare(b.name),
				sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order,
				ellipsis: true
			},
			{
				title: 'Age',
				dataIndex: 'age',
				key: 'age',
				width: '20%',
				...this.getColumnSearchProps('age'),
				sorter: (a, b) => a.age - b.age,
				sortOrder: sortedInfo.columnKey === 'age' && sortedInfo.order,
				ellipsis: true
			},
			{
				title: 'Address',
				dataIndex: 'address',
				key: 'address',
				...this.getColumnSearchProps('address'),
				filters: [
					{ text: 'London', value: 'London' },
					{ text: 'New York', value: 'New York' }
				],
				filteredValue: filteredInfo.address || null,
				onFilter: (value, record) => record.address.includes(value),
				sorter: (a, b) => a.address.localeCompare(b.name),
				sortOrder: sortedInfo.columnKey === 'address' && sortedInfo.order,
				ellipsis: true
			},
			{
				title: 'Tags',
				key: 'tags',
				dataIndex: 'tags',
				filters: [
					{ text: 'London', value: 'London' },
					{ text: 'New York', value: 'New York' }
				],
				filteredValue: filteredInfo.tags || null,
				onFilter: (value, record) => record.tags.includes(value),
				sortOrder: sortedInfo.columnKey === 'tags' && sortedInfo.order,
				ellipsis: true,
				render: (tags) => (
					<>
						{tags.map((tag) => {
							let color = tag.length > 5 ? 'geekblue' : 'green';
							if (tag === 'loser') {
								color = 'volcano';
							}
							return (
								<Tag color={color} key={tag}>
									{tag.toUpperCase()}
								</Tag>
							);
						})}
					</>
				)
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
				onTabClick={(e) => {
					this.state(e.key);
				}}
				type="card"
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
					/>
				</TabPane>
			</Tabs>
		);
	}
}

export default OrderProducts;
