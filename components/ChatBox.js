import React from 'react';
import {
	InstagramOutlined,
	CommentOutlined,
	FacebookOutlined,
	LinkedinOutlined,
	TeamOutlined,
	SettingOutlined,
	SearchOutlined,
	PhoneOutlined,
	VideoCameraOutlined,
	EllipsisOutlined,
	SendOutlined,
	PaperClipOutlined,
	SmileFilled,
	CloseOutlined,
	WechatFilled,
	InstagramFilled,
	FacebookFilled,
	PhoneFilled,
	MailFilled,
	EnvironmentFilled,
	UserOutlined,
	ShopFilled
} from '@ant-design/icons';
import { Layout, Menu, Input } from 'antd';

const chat = [
	{
		id: 1,
		message: 'เจด',
		user: 'Gee',
		time: '09:17AM'
	},
	{
		id: 2,
		message: 'ว่าไงว้ะ',
		user: 'Jade',
		time: '09:17AM'
	},
	{
		id: 3,
		message: 'ว่างม้ะไปกินข้าวกัน',
		user: 'Gee',
		time: '09:17AM'
	},
	{
		id: 4,
		message: 'ไม่ว่างดิ นอนอยู่อะชวนจิตดีไปดิ',
		user: 'Jade',
		time: '09:17AM'
	},
	{
		id: 5,
		message: 'จิตดีว่าไม่หิวดิ เซ็งเลยไม่อยากไปคนเดียว T_T',
		user: 'Gee',
		time: '09:17AM'
	},
	{
		id: 6,
		message: 'ไปเหอะ นะะะๆๆๆ',
		user: 'Gee',
		time: '09:17AM'
	},
	{
		id: 7,
		message: 'เออๆไปก็ได้ แต่เลี้ยงกูนะไอนัทมันยืมตังกูไปหมดเลย',
		user: 'Jade',
		time: '09:17AM'
	},
	{
		id: 8,
		message: 'ได้เลยเพื่อนนนนน เย้ๆ',
		user: 'Gee',
		time: '09:17AM'
	},
	{
		id: 9,
		message: 'เจอกันหน้าปากซอยนะ',
		user: 'Gee',
		time: '09:17AM'
	},
	{
		id: 10,
		message: 'เคร',
		user: 'Jade',
		time: '09:17AM'
	}
];

const user = 'Gee';

const { Sider } = Layout;

const ChatBox = () => {
	const submitMessage = (e) => {
		var key = e.keyCode || e.which;
		if (key === 13 && !e.shiftKey) {
			//Stops enter from creating a new line
			e.preventDefault();
			submitForm();
			return true;
		}

		function submitForm() {
			var form = document.getElementById('formMessage'); //submits the form.
			form.submit();
		}
	};
	return (
		<div className="container-chatbox">
			<link
				href="https://fonts.googleapis.com/css2?family=Mitr:wght@200;300;400;500;600;700&display=swap"
				rel="stylesheet"
			/>
			<link href="style/ChatBox.css" rel="stylesheet" />
			<div className="container-chatbox-grid">
				<div className="menu-chat">
					<Layout>
						<Sider width="100%">
							<Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
								<Menu.Item key="1" style={{ height: '75px', padding: '21px' }}>
									<CommentOutlined
										style={{
											fontSize: '30px',
											textAlign: 'center',
											paddingTop: '4px'
										}}
									/>
								</Menu.Item>
								<Menu.Item key="2" style={{ height: '75px', padding: '21px' }}>
									<FacebookOutlined
										style={{
											fontSize: '30px',
											textAlign: 'center',
											paddingTop: '4px'
										}}
									/>
								</Menu.Item>
								<Menu.Item key="3" style={{ height: '75px', padding: '21px' }}>
									<InstagramOutlined
										style={{
											fontSize: '30px',
											textAlign: 'center',
											paddingTop: '4px'
										}}
									/>
								</Menu.Item>
								<Menu.Item key="4" style={{ height: '75px', padding: '21px' }}>
									<LinkedinOutlined
										style={{
											fontSize: '30px',
											textAlign: 'center',
											paddingTop: '4px'
										}}
									/>
								</Menu.Item>
								<Menu.Item key="5" style={{ height: '75px', padding: '21px' }}>
									<TeamOutlined
										style={{
											fontSize: '30px',
											textAlign: 'center',
											paddingTop: '4px'
										}}
									/>
								</Menu.Item>
								<Menu.Item key="6" style={{ height: '75px', padding: '21px' }}>
									<SettingOutlined
										style={{
											fontSize: '30px',
											textAlign: 'center',
											paddingTop: '4px'
										}}
									/>
								</Menu.Item>
							</Menu>
						</Sider>
					</Layout>
				</div>
				<div className="menu-detial-mini">
					<div className="container-menu-detail-mini-grid">
						<div className="container-searchbar">
							<form className="font-mirt">
								<Input
									className="searchbar-chat"
									type="text"
									name="seach"
									placeholder="Search"
									prefix={<SearchOutlined className="site-form-item-icon" />}
								/>
							</form>
						</div>

						<div className="container-chat-mini">
							<div className="font-mitr container-chat-channel" tabindex="1">
								<div className="mini-chat-img">
									<img
										src="images/Cat.jpg"
										alt="Cat2"
										className="image-user-chat-mini"
									/>
								</div>
								<div className="mini-chat-name-user">
									<p>Mr.Jade Sada</p>
								</div>
								<div className="mini-chat-message">
									<p>Hello mr.nat.Kuy I sas...</p>
								</div>
								<div className="mini-chat-num-chat-no-read">
									<p>4</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="font-mitr menu-detail-full">
					<div className="contaier-nav-message-grid">
						<div className="message-full-name-user">
							<p>Mr.Jade Sada</p>
						</div>
						<div className="message-full-icon">
							<PhoneOutlined />
						</div>
						<div className="message-full-icon">
							<VideoCameraOutlined />
						</div>
						<div className="message-full-icon">
							<EllipsisOutlined />
						</div>
						<div className="message-full-icon">
							<CloseOutlined />
						</div>
					</div>
					<div className="container-messages">
						<div className="container-messages-table">
							<div className="container-messages-table-cell">
								{chat.map((prod) => (
									<>
										<div className="container-message">
											<div style={{ clear: 'both' }} />
											{prod.user === user && (
												<div className="chat-user">
													<p>{prod.message}</p>
												</div>
											)}
											{prod.user != user && (
												<>
													<div className="container-profile-friend">
														<img
															src="images/Cat.jpg"
															className="message-full-img-friend"
														/>
													</div>
													<div className="chat-friend">
														<p>{prod.message}</p>
													</div>
												</>
											)}
										</div>

										<div className="container-message-time">
											<div style={{ clear: 'both' }} />
											{prod.user === user && (
												<div className="time-user">
													<p>{prod.time}</p>
												</div>
											)}
											{prod.user != user && (
												<div className="time-friend">
													<p>{prod.time}</p>
												</div>
											)}
										</div>
									</>
								))}
							</div>
						</div>
					</div>
					<div className="contaier-input-message-grid">
						<div className="message-full-emoji">
							<SmileFilled />
						</div>
						<div className="message-full-file">
							<PaperClipOutlined />
						</div>
						<form className="message-full-text" id="formMessage" for="Message">
							<textarea
								id="Message"
								className="message-full-input-text"
								placeholder="Type something to send..."
								onKeyPress={submitMessage}
								cols="18"
							/>
						</form>
						<div className="message-full-send">
							<SendOutlined />
						</div>
					</div>
				</div>
				<div className="font-mitr detail-user-grid">
					<div className="container-detail-img-profile">
						<img className="detail-profile" src="images/Cat.jpg" alt="Car2" />
					</div>
					<div className="container-detail-name-friend">
						<div>
							<p className="detail-name-friend">Mr.Jade Sada</p>
							<p className="detail-rank-friend">Rank: Diamond</p>
							<button className="detail-friend-icon-home">
								<UserOutlined />
							</button>
							<button className="detail-friend-icon-shop">
								<ShopFilled />
							</button>
						</div>
					</div>
					<div className="container-detail-profile">
						<div className="content-detail-freind">
							<span className="icon-detail">
								<EnvironmentFilled />
							</span>
							<p className="text-detail">Phayao</p>
						</div>
						<div className="content-detail-freind">
							<span className="icon-detail">
								<MailFilled />
							</span>
							<p className="text-detail">jadelnw@gmail.com</p>
						</div>
						<div className="content-detail-freind">
							<span className="icon-detail">
								<PhoneFilled />
							</span>
							<p className="text-detail">093234xxxx</p>
						</div>
						<div className="content-detail-freind">
							<span className="icon-detail">
								<FacebookFilled />
							</span>
							<p className="text-detail">เจษฏาสุดหล่อ</p>
						</div>
						<div className="content-detail-freind">
							<span className="icon-detail">
								<InstagramFilled />
							</span>
							<p className="text-detail">jade_za_007</p>
						</div>
						<div className="content-detail-freind">
							<span className="icon-detail">
								<WechatFilled />
							</span>
							<p className="text-detail">@Jade_Kuy</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ChatBox;
