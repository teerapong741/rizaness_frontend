import React from 'react';
import Head from 'next/head';

import Nav from './Nav';

const PageLayout = ({ children }) => {
	return (
		<div>
			<Head>
				<title>Rizaness</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<Nav />
			{children}
		</div>
	);
};

export default PageLayout;
