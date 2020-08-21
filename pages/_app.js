import '../public/style/homepage.css';
import '../public/style/nav.css';
import '../public/style/signinpage.css';
import '../public/style/signuppage.css';
import '../public/style/productpage.css';
import '../public/style/productdetailpage.css';
import 'antd/dist/antd.css';

import { ApolloProvider } from '@apollo/react-hooks';
import App from 'next/app';
import fetch from 'isomorphic-unfetch';
import cookie from 'cookie';

import AuthProvider from '../appState/AuthProvider';
import apolloClient from '../apollo/apolloClient';
import { route } from 'next/dist/next-server/server/router';

export const QUERY_USER = {
	query: `
		query {
			user{
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
					imageUrl
					createdAt
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
		}
	`
};

function MyApp({ Component, pageProps, apollo, user }) {
	// console.log('_app-->', user);
	return (
		<ApolloProvider client={apollo}>
			<AuthProvider userData={user}>
				<Component {...pageProps} />
			</AuthProvider>
		</ApolloProvider>
	);
}

MyApp.getInitialProps = async ({ ctx, router }) => {
	if (process.browser) {
		return __NEXT_DATA__.props.pageProps;
	}

	const { headers } = ctx.req;

	const cookies = headers && cookie.parse(headers.cookie || '');

	const token = cookies && cookies.jwt;

	if (!token) {
		if (router.pathname === '/dashboard') {
			ctx.res.writeHead(302, { Location: '/signin' });
			ctx.res.end();
		}
		return null;
	}

	if (token) {
		if (
			router.pathname === '/signin' ||
			router.pathname === '/signup' ||
			router.pathname === '/' ||
			router.pathname === '/products'
		) {
			ctx.res.writeHead(302, { Location: '/dashboard' });
			ctx.res.end();
		}
	}

	const response = await fetch('http://localhost:4444/graphql', {
		method: 'post',
		headers: {
			'Content-Type': 'application/json',
			authorization: `Bearer ${token}` || ''
		},
		body: JSON.stringify(QUERY_USER)
	});

	if (response.ok) {
		const result = await response.json();

		return { user: result.data.user };
	} else {
		if (router.pathname === '/dashboard') {
			ctx.res.writeHead(302, { Location: '/signin' });
			ctx.res.end();
		}
		return null;
	}
};

export default apolloClient(MyApp);
