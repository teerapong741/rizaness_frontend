import React, { useState } from 'react';
import {
	Tabs,
	Pagination,
	Table,
	Tag,
	Space,
	Radio,
	Button,
	Input
} from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;

const data = [
	{
		key: '1',
		name: 'AA',
		age: 32,
		address: 'New York No. 1 Lake Park',
		tags: ['nice', 'developer']
	},
	{
		key: '2',
		name: 'Z',
		age: 42,
		address: 'London No. 1 Lake Park',
		tags: ['loser']
	},
	{
		key: '3',
		name: 'GGGG',
		age: 32,
		address: 'Sidney No. 1 Lake Park',
		tags: ['cool', 'teacher']
	},
	{
		key: '4',
		name: 'Z',
		age: 32,
		address: 'Sidney No. 1 Lake Park',
		tags: ['cool', 'teacher']
	}
];

const StockProducts = () => {
	const [tabState, setTabstate] = useState('1');

	const [filterState, setFilterState] = useState({
		filteredInfo: null,
		sortedInfo: null
	});

	const [searchState, setSearchState] = useState({
		searchText: '',
		searchedColumn: ''
	});

	let { sortedInfo, filteredInfo } = filterState;
	sortedInfo = sortedInfo || {};
	filteredInfo = filteredInfo || {};

	const columns = [
		{
			title: 'Name',
			dataIndex: 'name',
			key: 'name',
			filters: [
				{ text: 'AAA', value: 'AAA' },
				{ text: 'Z', value: 'Z' }
			],
			filteredValue: filteredInfo.name || null,
			onFilter: (value, record) => record.name.includes(value),
			sorter: {
				compare: (a, b) => a.name.localeCompare(b.name),
				multiple: 3
			},
			sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order,
			ellipsis: true,
			...getColumnSearchProps('name')
		},
		{
			title: 'Age',
			dataIndex: 'age',
			key: 'age',
			sorter: {
				compare: (a, b) => a.age - b.age,
				multiple: 2
			},
			sortOrder: sortedInfo.columnKey === 'age' && sortedInfo.order,
			ellipsis: true,
			...getColumnSearchProps('address')
		},
		{
			title: 'Address',
			dataIndex: 'address',
			key: 'address',
			filters: [
				{ text: 'London', value: 'London' },
				{ text: 'New York', value: 'New York' }
			],
			filteredValue: filteredInfo.address || null,
			onFilter: (value, record) => record.address.includes(value),
			sorter: {
				compare: (a, b) => a.address.localeCompare(b.address),
				multiple: 1
			},
			sortOrder: sortedInfo.columnKey === 'address' && sortedInfo.order,
			ellipsis: true,
			...getColumnSearchProps('address')
		}
	];

	function getColumnSearchProps(dataIndex) {
		({
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
							onClick={() => handleResetSearch(clearFilters)}
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
				record[dataIndex]
					.toString()
					.toLowerCase()
					.includes(value.toLowerCase()),
			onFilterDropdownVisibleChange: (visible) => {
				if (visible) {
					setTimeout(() => searchInput.select());
				}
			},
			render: (text) =>
				searchState.searchedColumn === dataIndex ? (
					<Highlighter
						highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
						searchWords={[searchState.searchText]}
						autoEscape
						textToHighlight={text.toString()}
					/>
				) : (
					text
				)
		});
	}

	const handleSearch = (selectedKeys, confirm, dataIndex) => {
		confirm();
		setSearchState({
			searchText: selectedKeys[0],
			searchedColumn: dataIndex
		});
	};

	const handleResetSearch = (clearFilters) => {
		clearFilters();
		setSearchState({ searchText: '' });
	};

	const handleChangeFilter = (pagination, filters, sorter, extra) => {
		setFilterState({
			filteredInfo: filters,
			sortedInfo: sorter
		});
	};

	const clearFilters = () => {
		setFilterState({ filteredInfo: null });
	};

	const clearAll = () => {
		setFilterState({
			filteredInfo: null,
			sortedInfo: null
		});
	};

	const setAgeSort = () => {
		setFilterState({
			sortedInfo: {
				order: 'descend',
				columnKey: 'age'
			}
		});
	};
	return (
		<div>
			<link
				href="https://fonts.googleapis.com/css2?family=Mitr:wght@200;300;400;500;600;700&display=swap"
				rel="stylesheet"
			/>
			<link rel="stylesheet" href="style/stockProducts.css" />
			<div className="container-stock">
				<Space style={{ marginBottom: 16 }}>
					<Button onClick={setAgeSort}>Sort age</Button>
					<Button onClick={clearFilters}>Clear filters</Button>
					<Button onClick={clearAll}>Clear filters and sorters</Button>
				</Space>
				<Tabs
					onTabClick={(e) => {
						setTabstate(e.key);
					}}
					type="card"
				>
					<TabPane tab="ทั้งหมด" key="1">
						<Table
							rowSelection={{
								type: Radio
							}}
							columns={columns}
							dataSource={data}
							onChange={handleChangeFilter}
						/>
					</TabPane>
					<TabPane tab="มีจำหน่าย" key="2">
						<Table columns={columns} dataSource={data} />
					</TabPane>
					<TabPane tab="หมดสต็อก" key="3">
						<Table columns={columns} dataSource={data} />
					</TabPane>
					<TabPane tab="เลิกจำหน่าย" key="4">
						<Table columns={columns} dataSource={data} />
					</TabPane>
				</Tabs>
			</div>
		</div>
	);
};

export default StockProducts;
