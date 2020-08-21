import React, { useState, useContext } from 'react';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import Cookies from 'js-cookie';
import Router from 'next/router';
import { LoadingOutlined } from '@ant-design/icons';

import PageLayout from '../PageLayout';
import { AuthContext } from '../../appState/AuthProvider';

const LOG_IN = gql`
	mutation LOG_IN($username: String!, $password: String!) {
		login(username: $username, password: $password) {
			user {
				id
				username
				fname
				lname
				birthday
				email
				phone
				address {
					id
					address
					sub_area
					district
					province
					postal_code
					createdAt
					user {
						id
						fname
					}
				}
				products {
					id
					name
					description
					imageUrl {
						id
					}
					price
					num_of_stock {
						id
						stock
						product {
							id
						}
						createdAt
					}
					discountType
					discount
					num_of_sold
					num_put_basket_now
					num_put_basket
					user {
						id
					}
					status_show {
						id
						status
						product {
							id
						}
						createdAt
					}
					status_product {
						id
						status
						product {
							id
						}
						createdAt
					}
					mem_point
					dis_point
					SKU
					createdAt
				}
				authority
				createdAt
			}
			jwt
		}
	}
`;

const Signin = () => {
	const [userInfo, setUserInfo] = useState({
		username: '',
		password: ''
	});

	const { setAuthUser } = useContext(AuthContext);

	const [checkmark, setCheckmark] = useState(false);

	const [login, { loading, error }] = useMutation(LOG_IN, {
		variables: { ...userInfo },
		onCompleted: (data) => {
			setAuthUser(data.login.user);
			Cookies.set('jwt', data.login.jwt);
			setUserInfo({
				username: '',
				password: ''
			});
			Router.push('/dashboard');
		}
	});

	const handleChange = (e) => {
		setUserInfo({
			...userInfo,
			[e.target.name]: e.target.value
		});
	};

	const handleSubmit = async (e) => {
		try {
			e.preventDefault();
			await login();
		} catch (error) {
			console.log(error);
		}
	};

	const rememberMe = (e) => {
		if (checkmark === true) setCheckmark(false);
		else if (checkmark === false) setCheckmark(true);
	};

	if (loading)
		return (
			<p style={{ textAlign: 'center', marginTop: '200px' }}>
				<LoadingOutlined style={{ fontSize: '200px' }} />
				<p style={{ fontSize: '50px', fontWeight: 'bold' }}>Loading</p>
			</p>
		);

	return (
		<PageLayout>
			<link
				href="https://fonts.googleapis.com/css2?family=Mitr:wght@200;300;400;500;600;700&display=swap"
				rel="stylesheet"
			/>
			<link rel="stylesheet" href="HomePage.css" />
			<div className="content-pictur-signin">
				<img src="images/pic4.jpg" className="pictur-signin" />
			</div>

			<div className="content-grid-signin">
				<div className="content-logo-signin">
					<img
						src="images/Rizaness_icon_full.png"
						alt="Rizaness_icon_full.png"
					/>
				</div>

				<div className="content-form-signin">
					<div className="content-logo-form-signin">
						<img
							src="images/Rizaness_icon_leaf.png"
							alt="Rizaness_icon_full.png"
						/>
						<img
							src="images/Rizaness_icon_name.png"
							alt="Rizaness_icon_full.png"
						/>
						<img
							src="images/Rizaness_icon_sine.png"
							alt="Rizaness_icon_full.png"
						/>
					</div>

					<div className="content-form-signin-span-signin">
						<span className="font-mitr">เข้าสู่ระบบ</span>
					</div>

					<form onSubmit={handleSubmit} className="container-form-signin-grid">
						<input
							type="text"
							name="username"
							placeholder="ไอดีผู้ใช้"
							className="font-mitr"
							onChange={handleChange}
							value={userInfo.username}
						/>
						<input
							type="password"
							name="password"
							placeholder="รหัสผ่าน"
							className="font-mitr"
							onChange={handleChange}
							value={userInfo.password}
						/>

						<label className="font-mitr container-form-signin-checkbox">
							จดจำรหัสผ่าน
							<input
								id="checkBoxRememberMe"
								type="checkbox"
								className="font-mitr"
								value={checkmark}
								onChange={rememberMe}
							/>
							<span className="checkmark" />
						</label>

						<div className="font-mitr content-form-signin-forgot-password">
							<span>ฉันลืมรหัสผ่าน?</span>
						</div>

						<div className="font-mitr content-form-signin-button-signin">
							<button
								align="center"
								type="submit"
								onSubmit={handleSubmit}
								disabled={loading}
							>
								เข้าสู่ระบบ
							</button>
						</div>

						<div
							style={{
								marginLeft: '40px',
								marginTop: '360px',
								position: 'absolute'
							}}
						>
							{error && (
								<p
									style={{
										color: 'red'
									}}
								>
									{error.graphQLErrors[0].message}
								</p>
							)}
						</div>

						<div className="font-mitr content-form-signin-other">
							<span>หรือเข้าสู่ระบบด้วย</span>
						</div>

						<div className="content-form-signin-button-signin-other">
							<button>facebook</button>
							<button>gmail</button>
						</div>
					</form>
				</div>
			</div>
		</PageLayout>
	);
};

export default Signin;
