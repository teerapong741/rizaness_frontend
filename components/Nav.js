import React from 'react';
import Link from 'next/link';

const Nav = () => {
	return (
		<div>
			<link
				href="https://fonts.googleapis.com/css2?family=Mitr:wght@200;300;400;500;600;700&display=swap"
				rel="stylesheet"
			/>
			<link rel="stylesheet" href="HomePage.css" />
			<header>
				<div className="container">
					<div className="nav-grid">
						<div className="font-mirt, logo">
							<h1>Rizaness</h1>
							<h2>.co.th</h2>
						</div>

						<form className="font-mirt, searchbar">
							<input
								type="text"
								name="seach"
								placeholder="Seach product or shop"
							/>
						</form>

						<ul className="font-mitr, menu-navbar-front-page">
							<li>
								<Link href="/">
									<a>Home</a>
								</Link>
							</li>
							<li>
								<Link href="/signin">
									<a>Login</a>
								</Link>
							</li>
							<li>
								<Link href="/signup">
									<a>Register</a>
								</Link>
							</li>
							<li>
								<Link href="/products">
									<a>Product</a>
								</Link>
							</li>
						</ul>
					</div>
				</div>
			</header>
		</div>
	);
};

export default Nav;
