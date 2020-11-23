import React, {useState} from 'react'
import {Tabs, Table, Tag, Input, Space, Button, Popconfirm, Card, Drawer } from 'antd'
import {
	SearchOutlined, PlusSquareFilled, 
	EditFilled, DeleteFilled, SettingOutlined,
	LoadingOutlined 
} from '@ant-design/icons'
import Highlighter from 'react-highlight-words';

const OutsideDistributor = ({prod}) => {
    let dataDistributor = [];
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
	let [filteredInfo, setFilteredInfo] = useState(null);
	let [sortedInfo, setSortedInfo] = useState(null);

    if (prod) {
		
	}

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
			title: 'ชื่อตัวแทน',
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
			title: 'รหัสตัวแทน',
			dataIndex: 'codeDistributor',
			key: 'codeDistributor',
			fixed: 'left',
			width: 150,
			...getColumnSearchProps('codeDistributor'),
			sorter: (a, b) => a.codeDistributor.localeCompare(b.codeDistributor),
			sortOrder: sortedInfo.columnKey === 'codeDistributor' && sortedInfo.order,
			ellipsis: true
		},
		{
			title: 'ระดับชั้น',
			dataIndex: 'rank',
			key: 'rank',
			width: 150,
			...getColumnSearchProps('rank'),
			sortOrder: sortedInfo.columnKey === 'rank' && sortedInfo.order,
			ellipsis: true,
			render: (rank) => (
				<>
					{rank.map((rank) => {
						let color;
						if (rank[0]) {
							color = '#33CC00';
						}
						if (rank[1]) {
							color = '#FF0000';
						}
						if (rank[2]) {
							color = '#33CC00';
						}
						return (
							<Tag color={color} key={rank}>
								{rank}
							</Tag>
						);
					})}
				</>
			)
		},
		{
			title: 'ยอดขายทั้งหมด',
			dataIndex: 'total_sales',
			key: 'total_sales',
			width: 180,
			...getColumnSearchProps('total_sales'),
			sorter: (a, b) => a.total_sales - b.total_sales,
			sortOrder: sortedInfo.columnKey === 'total_sales' && sortedInfo.order,
			ellipsis: true
		},
		{
			title: 'แต้มสะสม',
			dataIndex: 'point',
			key: 'point',
			width: 150,
			...getColumnSearchProps('point'),
			sorter: (a, b) => a.point - b.point,
			sortOrder: sortedInfo.columnKey === 'point' && sortedInfo.order,
			ellipsis: true
		},
		{
			title: 'รางวัลที่ได้รับ',
			dataIndex: 'reward',
			key: 'reward',
			width: 150,
			...getColumnSearchProps('reward'),
			sorter: (a, b) => a.reward - b.reward,
			sortOrder: sortedInfo.columnKey === 'reward' && sortedInfo.order,
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
            <Table
                // rowKey={data.user.products.id}
                rowSelection={rowSelection}
                columns={columns}
                dataSource={dataDistributor}
                onChange={handleChange}
                bordered
                rowClassName={(record, index) =>
                    index % 2 === 0 ? 'table-row-light' : 'table-row-dark'
                }
                pagination={{
                    position: ['bottomLeft'],
                    total: dataDistributor.length,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total) => `Total ${total} item`
                }}
                scroll={{ x: 100 }}
            />
        </div>
    )
}

export default OutsideDistributor
