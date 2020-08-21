import React, { useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import Link from 'next/link';

import PageLayout from '../PageLayout';

const SIGN_UP = gql`
	mutation SIGN_UP(
		$username: String!
		$password: String!
		$confirmPassword: String!
		$fname: String!
		$lname: String!
		$birthday: Date!
		$sex: String!
		$phone: String
		$email: String!
		$authority: String!
	) {
		signup(
			username: $username
			password: $password
			confirmPassword: $confirmPassword
			fname: $fname
			lname: $lname
			birthday: $birthday
			sex: $sex
			phone: $phone
			email: $email
			authority: $authority
		) {
			id
			username
			password
			fname
			lname
			birthday
			sex
			phone
			email
			authority
		}
	}
`;

const SignupPage = () => {
	const [userInfo, setUserInfo] = useState({
		username: '',
		password: '',
		confirmPassword: '',
		fname: '',
		lname: '',
		birthday: '',
		sex: 'men',
		phone: '',
		email: '',
		authority: 'buyer'
	});

	const [success, setSuccess] = useState(false);

	const [signup, { loading, error }] = useMutation(SIGN_UP, {
		variables: { ...userInfo },
		onCompleted: (data) => {
			if (data) {
				setSuccess(true);
				setUserInfo({
					username: '',
					password: '',
					confirmPassword: '',
					fname: '',
					lname: '',
					birthday: '',
					sex: 'men',
					phone: '',
					email: '',
					authority: 'buyer'
				});
			}
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
			await signup();
		} catch (error) {
			console.log(error);
		}
	};

	const openNav = () => {
		var open = document.querySelector('.bg-modal');
		var close = document.querySelector('.modal-close-condition');
		var accept = document.querySelector('.modal-accept-condition');

		if (open.style.display === 'none' || open.style.display === '') {
			open.style.display = 'flex';
		} else {
			open.style.display = 'none';
		}

		close.addEventListener('click', function () {
			open.style.display = 'none';
		});

		accept.addEventListener('click', function () {
			open.style.display = 'none';
		});
	};

	const setRadio = () => {
		var setTop = document.querySelector('.container-form-signup-radio-grid');

		if (setTop.style.top || setTop.style.top === '') {
			setTop.style.top = '-375px';
		} else {
			setTop.style.top = '-340px';
		}
	};

	if (loading) return <p>Loading...</p>;

	return (
		<PageLayout>
			<link
				href="https://fonts.googleapis.com/css2?family=Mitr:wght@200;300;400;500;600;700&display=swap"
				rel="stylesheet"
			/>
			<link rel="stylesheet" href="HomePage.css" />
			<div className="content-pictur-signup">
				<img src="images/pic4.jpg" className="pictur-signup" />
			</div>

			<div className="content-grid-signup">
				<div className="content-logo-signup">
					<img
						src="images/Rizaness_icon_full.png"
						alt="Rizaness_icon_full.png"
					/>
				</div>

				<div className="content-form-signup">
					<div className="content-logo-form-signup">
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

					<div className="content-form-signup-span-signup">
						<span className="font-mitr">สมัครสมาชิก</span>
					</div>

					<form
						className="content-form-signup-input-data"
						onSubmit={handleSubmit}
					>
						<div>
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
						</div>
						<div>
							<input
								type="password"
								name="confirmPassword"
								placeholder="ยืนยันรหัสผ่าน"
								className="font-mitr"
								onChange={handleChange}
								value={userInfo.confirmPassword}
							/>
						</div>

						<div>
							<input
								type="text"
								name="fname"
								placeholder="ชื่อจริง"
								className="font-mitr"
								onChange={handleChange}
								value={userInfo.fname}
							/>
							<input
								type="text"
								name="lname"
								placeholder="นามสกุล"
								className="font-mitr"
								onChange={handleChange}
								value={userInfo.lname}
							/>
						</div>

						<div>
							<input
								type="email"
								name="email"
								placeholder="อีเมล"
								className="font-mitr"
								onChange={handleChange}
								value={userInfo.email}
							/>
						</div>

						<span className="font-mitr form-signup-input-data-span-birthday">
							วันเกิดของคุณ :
						</span>

						<div>
							<input
								type="date"
								name="birthday"
								placeholder="วัน"
								className="font-mitr"
								onChange={handleChange}
								value={userInfo.birthday}
							/>
						</div>

						<span className="font-mitr form-signup-input-data-span-sex">
							เพศของคุณ :
						</span>

						<div>
							<input
								type="text"
								name="phone"
								placeholder="หมายเลขโทรศัพท์"
								className="font-mitr"
								onChange={handleChange}
								value={userInfo.phone}
							/>
						</div>

						<div>
							<span className="font-mitr">
								คุณเข้าใจและยอมรับ <a onClick={openNav}>ข้อตกลงการใช้งาน</a>{' '}
								แล้ว (โปรดเข้าไปยอมรับข้อตกลง)
							</span>
						</div>

						<div className="font-mitr content-form-signup-button-signup">
							<button
								align="center"
								type="submit"
								disabled={loading || userInfo.birthday === ''}
								onClick={setRadio}
							>
								สมัครสมาชิก
							</button>
						</div>

						<div style={{ marginLeft: '40px', marginTop: '10px' }}>
							{success && (
								<p>
									You successfully signed up, please{' '}
									<Link href="/signin">
										<a>Login</a>
									</Link>
									.
								</p>
							)}

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

						<div className="font-mitr">
							<span>หรือสมัครสมาชิกด้วย</span>
						</div>

						<div className="content-form-signup-button-signup-other">
							<button>facebook</button>
							<button>gmail</button>
						</div>
					</form>

					<form className="font-mitr container-form-signup-radio-grid">
						<label className=" container-form-signup-radio">
							ชาย
							<input
								type="radio"
								checked="checked"
								name="sex"
								onChange={handleChange}
								value="men"
							/>
							<span className="form-signup-radio-checkmark" />
						</label>

						<label className="container-form-signup-radio">
							หญิง
							<input
								type="radio"
								name="sex"
								onChange={handleChange}
								value="women"
							/>
							<span className="form-signup-radio-checkmark" />
						</label>
					</form>
				</div>

				<div className="bg-modal">
					<div className="modal-content">
						<span>
							Some people send the most random text messages about the most
							random things. Often, for the recipient, getting one of these
							strange texts can be nothing short of hilarious! You’ve probably
							received something similar to one of these odd, yet funny, texts
							before. If you did, you most likely took a screenshot of the
							conversation so you could show it to all your friends at a later
							time and have a good laugh! Here, we’ve collected 13 screenshots
							of the most random text message conversations we could find on the
							Internet! Take a look! There's no mention that by clicking the "I
							Accept" button you are accepting the terms of the Service
							Agreement. In fact, quite the opposite because a user would
							rightfully assume that by clicking the button, they are doing
							exactly what TransUnion stated, which does not involve agreeing to
							any terms. Other issues that the court pointed out that worked
							against finding the disclosure to be sufficient includes the
							following: The consumer wasn't required to click on or scroll
							through the scroll box. The hyperlinked version of the Service
							Agreement located near the box was labeled only with "Printable
							Version." This downplayed its importance. The court held that the
							scrollable box on its own is insufficient to create an agreement,
							and based on the above factors, the only real reference to any of
							the agreement terms was within the scroll box and nowhere else.
							These issues could have been solved by adding noticeable and clear
							text: Either near the Service Agreement scroll box, within the
							visible portion of the box Or in the paragraph above the "I
							Accept" button that gave a consumer notice that the purchase would
							be subject to the terms and conditions of the service agreement.
							As a result of this case, clickwrap agreements should strive to
							meet the two-part "reasonable communicativeness" test by
							adequately communicating terms to consumers. Don't just hide the
							terms in a small scroll box or in a way that downplays their
							importance or relevance to the consumer. If a consumer will be
							bound by terms, he should be informed of that as blatantly as
							possible and in a clear and reasonable way. Examples of clickwrap
							methods Here are a few examples of adequate clickwrap methods that
							use "Click to Accept" or "I Agree" buttons to successfully let
							users know about terms and obtain agreement to these terms. Amazon
							AWS uses a checkbox that users must click before creating an
							account. This checkbox is next to a sentence that says, "Check
							here to indicate that you have read and agree to the terms of the
							AWS Customer Agreement." This box must be checked before an
							account can be created. The Customer Agreement of AWS is linked
							for convenience for the user and to show that the agreement is
							important. The language used makes sure a user knows that by
							checking that box and then clicking Create Account and Continue,
							an agreement will be formed There's no mention that by clicking
							the "I Accept" button you are accepting the terms of the Service
							Agreement. In fact, quite the opposite because a user would
							rightfully assume that by clicking the button, they are doing
							exactly what TransUnion stated, which does not involve agreeing to
							any terms. Other issues that the court pointed out that worked
							against finding the disclosure to be sufficient includes the
							following: The consumer wasn't required to click on or scroll
							through the scroll box. The hyperlinked version of the Service
							Agreement located near the box was labeled only with "Printable
							Version." This downplayed its importance. The court held that the
							scrollable box on its own is insufficient to create an agreement,
							and based on the above factors, the only real reference to any of
							the agreement terms was within the scroll box and nowhere else.
							These issues could have been solved by adding noticeable and clear
							text: Either near the Service Agreement scroll box, within the
							visible
						</span>
						<button className="modal-close-condition">Cancel</button>
						<button className="modal-accept-condition">I Agree to Terms</button>
					</div>
				</div>
			</div>
		</PageLayout>
	);
};

export default SignupPage;
