import React, { useState, useContext } from 'react';
import { Layout, Menu, Drawer } from 'antd';
import {
	LeftCircleFilled,
	RightCircleFilled,
	DashboardOutlined,
	ShopOutlined,
	InboxOutlined,
	ProfileOutlined,
	TeamOutlined,
	TrophyOutlined,
	BarChartOutlined,
	DollarCircleOutlined,
	SmileOutlined,
	DesktopOutlined,
	ExclamationCircleOutlined,
	ImportOutlined,
	MailOutlined,
	SettingOutlined,
	MessageOutlined,
	UserOutlined,
	UnorderedListOutlined,
	BellOutlined,
	CommentOutlined,
	CloseSquareFilled
} from '@ant-design/icons';

import apolloClient from '../../apollo/apolloClient';
import { AuthContext } from '../../appState/AuthProvider';
import Dashboard from '../../components/Dashboard';
import ChatBox from '../../components/ChatBox';
import NotificationBox from '../../components/NotificationBox';
import StockProducts from '../../components/StockProducts';
import OrderProducts from '../../components/OrderProducts';
import Distributors from '../../components/Distributors';
import PointAndReward from '../../components/PointAndReward';
import Statics from '../../components/Statics';
import IncomeExpense from '../../components/IncomeExpense';
import CustomersAndMembers from '../../components/CustomersAndMembers';
import StorefrontProgram from '../../components/StorefrontProgram';
import AboutUs from '../../components/AboutUs';
import ReportProblem from '../../components/ReportProblem';
import ContactUs from '../../components/ContactUs';
import Setting from '../../components/Setting';

const { Header, Sider, Content } = Layout;

const DashBoardPage = () => {
	const [state, setState] = useState({
		collapsed: false
	});
	const [visibleUserInfo, setVisibleUserInfo] = useState(false);
	const [visibleChatBox, setVisibleChatBox] = useState(false);
	const [chatBox, setChatBox] = useState({
		chat: false,
		notification: false
	});
	const [navState, setNavState] = useState('1');

	const { signout } = useContext(AuthContext);

	const toggle = () => {
		setState({
			collapsed: !state.collapsed
		});

		var navChange = document.querySelector('.site-layout');

		if (state.collapsed === true) {
			navChange.style.marginLeft = '200px';
		}
		if (state.collapsed === false) {
			navChange.style.marginLeft = '80px';
		}
	};

	const showDrawerUserInfo = () => {
		setVisibleUserInfo(true);
	};

	const onCloseDrawerUserInfo = () => {
		setVisibleUserInfo(false);
	};

	const chatBoxState = () => {
		setVisibleChatBox(true);
		setChatBox({
			chat: true,
			notification: false
		});
	};
	const notificatoinBoxState = () => {
		setVisibleChatBox(true);
		setChatBox({
			chat: false,
			notification: true
		});
	};

	const closeChatBox = () => {
		setVisibleChatBox(false);
	};

	return (
		<div>
			<Layout>
				<link
					href="https://fonts.googleapis.com/css2?family=Mitr:wght@200;300;400;500;600;700&display=swap"
					rel="stylesheet"
				/>
				<link href="style/dashboard.css" rel="stylesheet" />
				<Sider
					trigger={null}
					collapsible
					collapsed={state.collapsed}
					mode="inline"
					style={{
						height: '100%',
						overflow: 'auto',
						position: 'fixed',
						left: 0
					}}
				>
					<div className="logo">
						{state.collapsed ? (
							<img src="images/Rizaness_icon_leaf.png" className="logo" />
						) : (
							<img src="images/Rizaness_icon_name.png" className="logo" />
						)}
					</div>
					<div
						style={{
							height: '1px',
							background: 'white',
							marginTop: '16px'
						}}
					/>
					{state.collapsed ? (
						<div style={{ width: '0', height: '0' }} />
					) : (
						<div className="font-mitr profile-container">
							<div className="profile-container-grid">
								<div className="content-profile-photo">
									<div className="profile">
										<img
											className="img-profile"
											src="images/Cat2.jpg"
											alt="Avatar"
										/>
									</div>
								</div>
								<div className="name-grid">
									<div className="name">จี้หัวควย</div>
									<div className="rank">Rank: Diamond</div>
								</div>
								<div className="setting-grid">
									<div className="setting">
										<SettingOutlined />
									</div>
									<div className="user">
										<UserOutlined />
									</div>
								</div>
							</div>
						</div>
					)}

					<div
						style={{
							height: '1px',
							background: 'white'
						}}
					/>
					<Menu
						theme="dark"
						mode="inline"
						defaultSelectedKeys={navState}
						onClick={(e) => setNavState(e.key)}
					>
						<Menu.Item
							key="1"
							icon={<DashboardOutlined />}
							style={{ margin: '0px 0px 8px' }}
						>
							แดชบอร์ด
						</Menu.Item>
						<Menu.Item key="2" icon={<ShopOutlined />}>
							ร้านค้าของฉัน
						</Menu.Item>
						<Menu.Item key="3" icon={<InboxOutlined />}>
							สต็อกสินค้า
						</Menu.Item>
						<Menu.Item key="4" icon={<ProfileOutlined />}>
							คำสั่งซื้อ
						</Menu.Item>
						<Menu.Item key="5" icon={<TeamOutlined />}>
							ตัวแทนจำหน่ายของฉัน
						</Menu.Item>
						<Menu.Item key="6" icon={<TrophyOutlined />}>
							แต้มสะสม & ของรางวัล
						</Menu.Item>
						<Menu.Item key="7" icon={<BarChartOutlined />}>
							สถิติ
						</Menu.Item>
						<Menu.Item key="8" icon={<DollarCircleOutlined />}>
							รายรับ-รายจ่าย
						</Menu.Item>
						<Menu.Item key="9" icon={<SmileOutlined />}>
							ลูกค้าสมาชิก
						</Menu.Item>
						<Menu.Item key="10" icon={<DesktopOutlined />}>
							โปรแกรมหน้าร้าน
						</Menu.Item>
						<div
							style={{ height: '1px', background: 'white', margin: '16px' }}
						/>
						<Menu.Item key="11" icon={<ExclamationCircleOutlined />}>
							เกี่ยวกับเรา
						</Menu.Item>
						<Menu.Item key="12" icon={<MailOutlined />}>
							แจ้งปัญหา
						</Menu.Item>
						<Menu.Item key="13" icon={<MessageOutlined />}>
							ติดต่อเรา
						</Menu.Item>
						<Menu.Item key="14" icon={<SettingOutlined />}>
							ตั้งค่า
						</Menu.Item>
						<Menu.Item key="15" icon={<ImportOutlined />} onClick={signout}>
							ออกจากระบบ
						</Menu.Item>
					</Menu>
				</Sider>
				<Layout className="site-layout">
					<Header
						className="site-layout-background"
						style={{
							padding: '0',
							display: 'grid',
							gridTemplateColumns: 'auto 1fr 1fr',
							height: '64px'
						}}
					>
						{React.createElement(
							state.collapsed ? RightCircleFilled : LeftCircleFilled,
							{
								className: 'trigger',
								onClick: toggle
							}
						)}
						<div className="container-shop-name">
							<p>Maha Shop</p>
						</div>
						<div className="container-navbar">
							<div className="content-nav-grid">
								<div className="content-nav-profile">
									<img
										className="nav-profile"
										src="images/Cat2.jpg"
										alt="Cat2.jpg"
									/>
								</div>

								<div
									className="container-icon-user-info"
									onClick={showDrawerUserInfo}
								>
									<UnorderedListOutlined className="icon-user-info" />
								</div>
							</div>
						</div>
						<Drawer
							title="ข้อมูลผู้ใช้"
							placement="right"
							closable={false}
							onClose={onCloseDrawerUserInfo}
							visible={visibleUserInfo}
							width={720}
							bodyStyle={{ fontSize: '18px', fontWeight: '500' }}
						>
							<p>Some contents...</p>
							<p>Some contents...</p>
							<p>Some contents...</p>
						</Drawer>
					</Header>

					{visibleChatBox === true && (
						<>
							<div className="container-box">
								<div className="content-box">
									{chatBox.chat === true && <ChatBox />}
									{chatBox.notification === true && <NotificationBox />}
								</div>
							</div>
							<div className="button-close-box" onClick={closeChatBox}>
								<CloseSquareFilled />
							</div>
						</>
					)}
					<div className="container-button-right">
						<div className="button-right" onClick={chatBoxState}>
							<CommentOutlined />
						</div>
						<div className="button-right" onClick={notificatoinBoxState}>
							<BellOutlined />
						</div>
						<div className="button-right">
							<ShopOutlined />
						</div>
					</div>

					<Content
						className="site-layout-background"
						style={{
							margin: '24px 16px 0',
							padding: '20px'
						}}
					>
						{navState === '1' && <Dashboard />}
						{navState === '2' && <StockProducts />}
						{navState === '3' && <StockProducts />}
						{navState === '4' && <OrderProducts />}
						{navState === '5' && <Distributors />}
						{navState === '6' && <PointAndReward />}
						{navState === '7' && <Statics />}
						{navState === '8' && <IncomeExpense />}
						{navState === '9' && <CustomersAndMembers />}
						{navState === '10' && <StorefrontProgram />}
						{navState === '11' && <AboutUs />}
						{navState === '12' && <ReportProblem />}
						{navState === '13' && <ContactUs />}
						{navState === '14' && <Setting />}
					</Content>
				</Layout>
			</Layout>
		</div>
	);
};

export default apolloClient(DashBoardPage);
