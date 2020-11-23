import React, {useState} from 'react'
import {Tabs, Table, Tag, Input, Space, Button, Popconfirm, Card, Drawer, Avatar, Typography   } from 'antd'
import {
	SearchOutlined, PlusSquareFilled, 
	EditFilled, DeleteFilled, SettingOutlined,
	LoadingOutlined,ToolTwoTone
} from '@ant-design/icons'
import Highlighter from 'react-highlight-words';
import gql from 'graphql-tag'
import {useQuery} from '@apollo/react-hooks'

import SettingDiscount from './SettingDiscount'
import EditDistrbutor from './EditDistributor'
import ViewDistributor from './ViewDistributor'

const {Text} = Typography

const QUERY_DISTRIBUTOR = gql`
	query QUERY_DISTRIBUTOR {
		user {
			id
			shops {
				id
				rank_distributors {
					id
					rank_name
					color
					icon
				}
				distributors {
					id
					rank {
						id
						rank_name
						discount
					}
					discount
					codeDistributor
					data {
						id
						imageUrl
						fname
						lname
					}
					shop {
						id
						shopName
					}
					point {
						id
						addPoint
						delPoint
					}
					reward {
						id
						rewardPoint {
							id
							reward
						}
						rewardRank {
							reward {
								id
								reward
								createdAt
							}
						}
						addPoint
						delPoint
						createdAt
					}
					createdAt
				}
			}
		}
	}
`

const AllDistributor = () => {
    let dataDistributor = [];
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
	let [filteredInfo, setFilteredInfo] = useState(null);
	let [sortedInfo, setSortedInfo] = useState(null);
	const [searchedColumn, setSearchedColumn] = useState('');
	const [key, setKey] = useState('1');
	const [searchText, setSearchText] = useState('');
	const [keySelectedDistributor, setKeySelectedDistributor] = useState(null);
	const [dataDisState, setDataDisState] = useState(false);
	const [loadingBottomDelete, setLoadingBottomDelete] = useState(false);
	let searchInput;

	const [visibleSettingDiscount, setVisibleSettingDiscount] = useState(false);
	const [visibleEditDis, setVisibleEditDis] = useState(false);
	const [visibleViewDis, setVisibleViewDis] = useState(false);
	const [visibleViewDisTree, setVisibleViewDisTree] = useState(false);

	const {data, error: errorDistributor, loading: loadingDistributor, refetch} = useQuery(QUERY_DISTRIBUTOR, {
		onCompleted: async (data) => {
			// console.log('data-->',data)
		}
	})

	if (data) {
		if (data.user.shops && data.user.shops[0] && data.user.shops[0].distributors) {
			for (let i = 0; i < data.user.shops[0].distributors.length; i++) {
				let point = 0;
				let month_sales = 0;
				let total_sales = 0;
				let dis_per = 0;
				let dis_thb = 0;

				if (data.user.shops[0].distributors[i].point) {
					for (let j = 0; j<data.user.shops[0].distributors[i].point.length; j++) {
						point += data.user.shops[0].distributors[i].point[j].addPoint
						point -= data.user.shops[0].distributors[i].point[j].delPoint
					}
				}

				if (data.user.shops[0].distributors[i].reward && data.user.shops[0].distributors[i].discount && data.user.shops[0].distributors[i].rank) {
					dis_per += data.user.shops[0].distributors[i].discount
					dis_per += data.user.shops[0].distributors[i].rank.discount

					for (let j = 0; j<data.user.shops[0].distributors[i].reward.length; j++) {
						dis_per += data.user.shops[0].distributors[i].reward[j].addPoint
						dis_per -= data.user.shops[0].distributors[i].reward[j].delPoint
					}
				}

				dataDistributor.push({
					key: i,
					imageUrl: data.user.shops[0].distributors[i].data.imageUrl,
					name: `${data.user.shops[0].distributors[i].data.fname} ${data.user.shops[0].distributors[i].data.lname}`,
					codeDistributor: data.user.shops[0].distributors[i].codeDistributor,
					rank:  data.user.shops[0].distributors[i].rank.rank_name,
					month_sales: month_sales,
					total_sales: total_sales,
					discount_percent: dis_per,
					discount_baht: dis_thb,
					point: point, 
					reward: 'reward',
				});
			}
		} else {
			dataDistributor = []
		}
	}

	const onOpenDrawerSettingDiscount = (key) => {
		setVisibleSettingDiscount(true)
		setKeySelectedDistributor(key)
	}
	const onCloseDrawerSettingDiscount = () => {
		setVisibleSettingDiscount(false)
	}

	const onOpenDrawerEditDistributor = (key) => {
		setVisibleEditDis(true);
		setKeySelectedDistributor(key);
	};
	const onCloseDrawerEditDistributor = () => {
		setVisibleEditDis(false)
	}

	const onOpenDrawerViewDistributor = (key) => {
		setVisibleViewDis(true);
		setKeySelectedDistributor(key);
	};
	const onCloseDrawerViewDistributor = () => {
		setVisibleViewDis(false)
	}

	const onSetViewDisTree = () => {
		setVisibleViewDisTree(!visibleViewDisTree);
	};

	// console.log(dataDistributor)

	const onSelectChange = (selectedRowKeys) => {
		console.log('selectedRowKeys changed: ', selectedRowKeys);
		setSelectedRowKeys(selectedRowKeys);
	};

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
	
	const handleSearch = (selectedKeys, confirm, dataIndex) => {
		confirm();
		setSearchText(selectedKeys[0]);
		setSearchedColumn(dataIndex);
	};

	const handleReset = (clearFilters) => {
		clearFilters();
		setSearchText('');
	};

	const start = () => {
		setLoadingBottomDelete(true);
		// ajax request after empty completing
		setTimeout(() => {
			setSelectedRowKeys([]);
			setLoadingBottomDelete(false);
		}, 1000);
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

	const handleDeleteDistributor = (key) => {
		const dataSource = [...dataDistributor];
		dataDistributor = dataSource.filter((item) => item.key !== key);
		setDataDisState(!dataDisState);
		console.log('dataDistributor', dataDistributor);
		console.log('dataSource', dataSource);
	};

	const clearFilters = () => {
		setFilteredInfo({ filteredInfo: null });
	};

	const clearAll = () => {
		setFilteredInfo(null);
		setSortedInfo(null);
	};

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
			width: 200,
			...getColumnSearchProps('rank'),
			sortOrder: sortedInfo.columnKey === 'rank' && sortedInfo.order,
			ellipsis: true,
			render: (rank) => (
				<>
					{data.user.shops[0].rank_distributors.map(r => {
						if (r.rank_name == rank) {
							// console.log(r.color)
							return (
								<div>
									<Avatar shape="square" src={r.icon} style={{margin: '10px'}}/>
									<Tag style={{border: '1px solid #D3D3D3'}} color={r.color}  key={rank}>
										<Text style={{margin: '0 0 0 0'}}>{rank}</Text>
									</Tag>
								</div>
							);
						}
					})}
				</>
			)
		},
		{
			title: 'ยอดขายเดือนนี้',
			dataIndex: 'month_sales',
			key: 'month_sales',
			width: 180,
			...getColumnSearchProps('month_sales'),
			sorter: (a, b) => a.month_sales - b.month_sales,
			sortOrder: sortedInfo.columnKey === 'month_sales' && sortedInfo.order,
			ellipsis: true
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
			title: 'ส่วนลด(%)',
			dataIndex: 'discount_percent',
			key: 'discount_percent',
			width: 180,
			...getColumnSearchProps('discount_percent'),
			sorter: (a, b) => a.discount_percent - b.discount_percent,
			sortOrder: sortedInfo.columnKey === 'discount_percent' && sortedInfo.order,
			ellipsis: true
		},
		{
			title: 'ส่วนลด(THB)',
			dataIndex: 'discount_baht',
			key: 'discount_baht',
			width: 180,
			...getColumnSearchProps('discount_baht'),
			sorter: (a, b) => a.discount_baht - b.discount_baht,
			sortOrder: sortedInfo.columnKey === 'discount_baht' && sortedInfo.order,
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
			width: 150,
			render: (text, record) => {
				// console.log('record', record)
				return (
				<Space size="middle">
					<a onClick={() => onOpenDrawerSettingDiscount(record.key)}>
						
						<ToolTwoTone />
					</a>
					<a onClick={() => onOpenDrawerEditDistributor(record.key)}>
						<EditFilled />
					</a>
					<Popconfirm
						title="คุณแน่ใจว่าจะลบสินค้าชิ้นนี้?"
						onConfirm={() => handleDeleteDistributor(record.key)}
					>
						<a>
							<DeleteFilled />
						</a>
					</Popconfirm>

					<a onClick={() => onOpenDrawerViewDistributor(record.key)}>
						<SearchOutlined />
					</a>
				</Space>
			)
			}
		}
	];

	if (loadingDistributor) {
		return (
			<p style={{ textAlign: 'center', marginTop: '200px' }}>
				<LoadingOutlined style={{ fontSize: '200px' }} />
				<p style={{ fontSize: '50px', fontWeight: 'bold' }}>Loading</p>
			</p> 
		);
    }

    return (
        <div>
			<link
				href="https://fonts.googleapis.com/css2?family=Mitr:wght@200;300;400;500;600;700&display=swap"
				rel="stylesheet"
			/>
			<link href="style/allDistributor.css" rel="stylesheet" />

			<Drawer
				title="สร้างบิลแก้ไขส่วนลดตัวแทนจำหน่าย"
				placement="right"
				closable={false}
				onClose={onCloseDrawerSettingDiscount}
				visible={visibleSettingDiscount}
				width={720}
				headerStyle={{}}
				bodyStyle={{
					fontSize: '18px',
					fontWeight: '500',
					padding: '0px 0px 0px 20px',
					backgroundColor: '#F5F5F5'
				}}
			>
				<SettingDiscount prod={data} keyDis={keySelectedDistributor}/>
			</Drawer>

			<Drawer
				title="แก้ไขข้อมูลตัวแทนจำหน่าย"
				placement="right"
				closable={false}
				onClose={onCloseDrawerEditDistributor}
				visible={visibleEditDis}
				width={720}
				headerStyle={{}}
				bodyStyle={{
					fontSize: '18px',
					fontWeight: '500',
					padding: '0px 0px 0px 20px',
					backgroundColor: '#F5F5F5'
				}}
			>
				<EditDistrbutor prod={data} keyDis={keySelectedDistributor}/>
			</Drawer>

			<Drawer
				title="รายละเอียดตัวแทนจำหน่าย"
				placement="right"
				closable={false}
				onClose={onCloseDrawerViewDistributor}
				visible={visibleViewDis}
				width={720}
				headerStyle={{}}
				bodyStyle={{
					fontSize: '18px',
					fontWeight: '500',
					padding: '0px 0px 0px 20px',
					backgroundColor: '#F5F5F5'
				}}
			>
				<ViewDistributor prod={data} keyDis={keySelectedDistributor}/>
			</Drawer>

			<div style={{ marginBottom: 16, width: '100%', position: 'relative' }}>
				<Button 
					onClick={clearFilters} 
					style={{ marginRight: 8 }}
				>
					ลบตัวกรอง
				</Button>
				<Button 
					onClick={clearAll} 
					style={{ marginRight: 8 }}
				>
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
				<div style={{position: 'absolute',top: 0, right: 0}}>
					<Button
						type="primary"
						style={{ 'background-color': '#33CC00' }}
						onClick={onSetViewDisTree}
					>
						ดูแผนผังตัวแทนจำหน่าย (Family Tree)
					</Button>
				</div>
			</div>

            {!visibleViewDisTree && (
				<Table
					rowKey={data.user.shops[0].distributors.id}
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
			)}
			{visibleViewDisTree && (
				<div>Hello Dis tree</div>
			)}
        </div>
    )
}

export default AllDistributor
