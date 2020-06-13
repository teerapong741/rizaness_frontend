import React from 'react';
import { Carousel, Layout, Typography, Button } from 'antd';

import PageLayout from '../components/PageLayout';
import Link from 'next/link';

const homePage = () => {
	return (
		<PageLayout>
			<div className="content-homepage">
				<Carousel autoplay style={{ marginBottom: '-10px' }}>
					<div>
						<img src="images/pic1.jpg" className="pictur-carousel-homepage" />
					</div>
					<div>
						<img src="images/pic2.jpg " className="pictur-carousel-homepage" />
					</div>
					<div>
						<img src="images/pic3.jpg" className="pictur-carousel-homepage" />
					</div>
					<div>
						<img src="images/pic4.jpg" className="pictur-carousel-homepage" />
					</div>
				</Carousel>
			</div>
			<div className="content-logo-homepage">
				<img src="images/Rizaness_icon_full.png" alt="Image" />
				<link
					href="https://fonts.googleapis.com/css2?family=Mitr:wght@200;300;400;500;600;700&display=swap"
					rel="stylesheet"
				/>
				<link rel="stylesheet" href="HomePage.css" />
				<span className="font-mitr">
					ให้การดูแลการขายของคุณเป็นเรื่องง่ายและฟรี
				</span>
				<p className="font-mitr">
					พร้อมเครื่องมือช่วยจัดการร้านค้าทั้งออนไลน์และหน้าร้าน
				</p>
				<div className="site-button-ghost-wrapper">
					<Link id="Link" href="/signup">
						<button for="Link" className="font-mitr, button-register">
							<a>Register</a>
						</button>
					</Link>
				</div>
			</div>
		</PageLayout>
	);
};

export default homePage;
