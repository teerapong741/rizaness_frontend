import React from 'react';

const NotificationBox = () => {
	return (
		<div className="container-chatbox">
			<link
				href="https://fonts.googleapis.com/css2?family=Mitr:wght@200;300;400;500;600;700&display=swap"
				rel="stylesheet"
			/>
			<link href="style/NotificationBox.css" rel="stylesheet" />
			<div className="container-chatbox-grid">
				<div className="menu-detial-mini">
					<div className="container-chat-mini">
						<div className="font-mitr container-chat-channel" tabindex="1">
							<div className="mini-chat-img">
								<img
									src="images/Cat.jpg"
									alt="Cat2"
									className="image-user-chat-mini"
								/>
							</div>
							<div className="mini-noti-name">
								<p>คะแนนครบ 1000 แต้มแล้ว</p>
							</div>
							<div className="mini-noti-time">
								<p>1 hour ago</p>
							</div>
						</div>
					</div>
				</div>

				<div className="font-mitr menu-detail-full">
					<div className="contaier-noti-full-grid">
						<div className="message-full-name-notification">
							<p>คะแนนครบ 1000 แต้มแล้ว</p>
						</div>
					</div>
					<div className="content-full-noti">
						<p>
							คะแนนครบ 1000 แต้มแล้ว
							<br />
							<br />
							<br />
							คะแนนครบ 1000 แต้มแล้ว คะแนนครบ 1000 แต้มแล้ว
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default NotificationBox;
