import React, {useState} from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import {Tabs, Typography,Badge, Button, Drawer} from 'antd'
import {
	SearchOutlined, PlusSquareFilled, 
	EditFilled, DeleteFilled, SettingOutlined,
	LoadingOutlined ,BellFilled
} from '@ant-design/icons'
import Highlighter from 'react-highlight-words';
import OrgChart from '../../../node_modules/@balkangraph/orgchart.js'

import DistributorModel from './DistributorModel.js';
import RankDistributorModel from './RankDistributorModel'
import OverviewDistributor from './OverviewDistributor'
import AllDistributor from './AllDistributor.js';
import OutsideDistributor from './OutsideDistributor.js';
import RequestDistributor from './RequestDistributor.js';

const {TabPane} = Tabs
const {Text} = Typography

export const QUERY_SHOP_RANK_DIS_MODEL = gql`
	query QUERY_SHOP_RANK_DIS_MODEL {
		user {
			id
			shops {
				id
				shopName
				layer_depth
     			workforce_per_row
				rank_distributors {
					id
				}
				layer_depth_rewards {
                    id
                    layer
                    type
                    discount
                    shop {
                        id
                    }
                    createdAt
                }
			}
		}
	}
`


const Distributors = () => {
	let dataDistributor = [];
	const [key, setKey] = useState('1')
	const [selectedRowKeys, setSelectedRowKeys] = useState([]);
	let [filteredInfo, setFilteredInfo] = useState(null);
	let [sortedInfo, setSortedInfo] = useState(null);
	const [statusFamilyTreeDemo, setStatusFamilyTreeDemo] = useState(false)
	const [visibleDrawerReqDis,setVisibleDrawerReqDis] = useState(false)
	const demoTree = []
	const DemoClink = []
	const layerDepth = []

	const {data, loading, error, refetch } = useQuery(QUERY_SHOP_RANK_DIS_MODEL, {
		onCompleted: (data) => {
		}
	})
	refetch()

	if (data) {
		demoTree.push(
			{
				id: 1,
				name: 'Maha Shop',
				img: 'https://cdn.balkan.app/shared/1.jpg'
			}
		)
		
		if (data.user.shops[0].layer_depth == -1) {
			for (let i=0; i<1; i++){
				layerDepth.push(i)
			}
		} else {
			for (let i=0; i<data.user.shops[0].layer_depth; i++){
				layerDepth.push(i)
			}
		}
		
			
		let ID = 2
		let row = 1
		let count = 1
		for (let i=1; i<=data.user.shops[0].layer_depth;i++){
			for(let j=0; j<count;j++){
				let arrID = []
				for(let k=0; k<data.user.shops[0].workforce_per_row; k++){
					demoTree.push({
						id: ID,
						pid: row,
						tags: [`depth${i}`]
					})
					arrID.push(ID)
					ID += 1
				}
				DemoClink.push({
					from: arrID[0],
					to: arrID[1],
					label: 'มีตัวแทนในชั้นนี้สูงสุด 5 คน',
					template: "yellow"
				})
				row +=1
			}
			count *= data.user.shops[0].workforce_per_row
		}
	}

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
				nodes: demoTree
			})
		}
	}

	const onOpenDrawerRequestDis = () => {
		setVisibleDrawerReqDis(true)
	}
	const onCloseDrawerRequestDis = () => {
		setVisibleDrawerReqDis(false)
	}
	
	if (loading) {
		return (
			<p style={{ textAlign: 'center', marginTop: '200px' }}>
				<LoadingOutlined style={{ fontSize: '200px' }} />
				<p style={{ fontSize: '50px', fontWeight: 'bold' }}>Loading</p>
			</p>
		);
	}
	
	console.log(loading)

	return (
		<div>
			<link
				href="https://fonts.googleapis.com/css2?family=Mitr:wght@200;300;400;500;600;700&display=swap"
				rel="stylesheet"
			/>
			<link rel="stylesheet" href="style/distributors.css" />
			<Drawer
				title="คำขอตัวแทนจำหน่าย"
				placement="right"
				closable={false}
				onClose={onCloseDrawerRequestDis}
				visible={visibleDrawerReqDis}
				width={720}
				bodyStyle={{
					fontSize: '18px',
					fontWeight: '500',
					padding: '20px 20px 20px 20px'
				}}
			>
				<RequestDistributor />
			</Drawer>

			<div>
				<div className="container-span" 
					style={{width: '100%', textAlign: 'center', fontSize: '30px', fontWeight: '800'}}
				>
					<span>จัดการตัวแทนจำหน่าย</span>
				</div>

				<Badge
						count={4}
						overflowCount={100}
					>
						<Button 
							type="primary" 
							ghost
							style={{ 'background-color': '#33CC00', margin: '0 0 15px 0' }} 
							onClick={onOpenDrawerRequestDis}
						><BellFilled />คำขออนุมัติ</Button>
				</Badge>

				<Tabs
					defaultActiveKey={key}
					type="card"
					onChange={(e) =>{ 
						setKey({key: e.key})
						handleChangeStatusFamilyTreeDemo()
					}}
				>
					<TabPane disabled={loading} tab="รูปแบบตัวแทน" key="1">
						<DistributorModel/>
					</TabPane>
					<TabPane disabled={loading} tab="ระดับขั้นตัวแทนจำหน่าย" key="2">
						{data && data.user.shops[0].layer_depth == 0 && data.user.shops[0].workforce_per_row == 0 
						? (<div style={{width: '100%', textAlign: 'center'}}><Text mark style={{fontSize: '50px', fontFamily: 'bold'}}>ไม่มีระบบตัวแทนจำหน่าย</Text><br/><Text type="danger" style={{fontSize: '20px', fontFamily: 'bold'}}>**กรุณาตั้งค่ารูปแบบตัวแทนเพื่อเปิดใช้งานภาพรวมตัวแทน</Text></div>)
						: (<RankDistributorModel/>)}
					</TabPane>
					<TabPane disabled={loading} tab="ภาพรวมรูปแบบตัวแทน" key="3" >
						{data && data.user.shops[0].layer_depth == 0 && data.user.shops[0].workforce_per_row == 0 
						? (<div style={{width: '100%', textAlign: 'center'}}><Text mark style={{fontSize: '50px', fontFamily: 'bold'}}>ไม่มีระบบตัวแทนจำหน่าย</Text><br/><Text type="danger" style={{fontSize: '20px', fontFamily: 'bold'}}>**กรุณาตั้งค่ารูปแบบตัวแทนเพื่อเปิดใช้งานระดับขั้นตัวแทน</Text></div>)
						: (<OverviewDistributor style={{width: '100%'}} data={data} layerDepth={layerDepth}/>)}
					</TabPane>
					<TabPane disabled={loading} tab="ตัวแทนทั้งหมด" key="4">
						<AllDistributor/>
					</TabPane>
					{/* <TabPane disabled={loading} tab="ตัวแทนที่ออกแล้ว" key="5">
						<OutsideDistributor/>
					</TabPane> */}
				</Tabs>
			</div>
		</div>
	);
};

export default Distributors;
