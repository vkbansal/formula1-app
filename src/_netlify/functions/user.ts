import type { Handler } from '@netlify/functions';
import { MongoClient } from 'mongodb';

const { DB_URL } = process.env;

const handler: Handler = async (event, _context) => {
	if (event.httpMethod !== 'POST') {
		return { statusCode: 504, body: 'Method Not Allowed' };
	}

	if (typeof event.body !== 'string') {
		return { statusCode: 400, body: 'Bad Request' };
	}

	if (!DB_URL) {
		return {
			statusCode: 500,
			body: JSON.stringify({ message: 'Something went wrong', code: 'E001' }),
		};
	}

	const client = new MongoClient(DB_URL);

	try {
		await client.connect();
		const db = client.db('site_visits');
		const collection = db.collection('visits');
		const body = JSON.parse(event.body);

		await collection.insertOne({
			site: body.h,
			page: body.p || 'unknown',
			date: new Date(body.d),
			ua: body.u || null,
			referrer: body.r || null,
			timezone: body.t,
			timeOffset: body.o,
			viewport: {
				width: body.vw,
				height: body.vh,
			},
		});

		return { statusCode: 200, body: JSON.stringify({ message: 'OK' }) };
	} catch (_) {
		return {
			statusCode: 500,
			body: JSON.stringify({ message: 'Something went wrong', code: 'E002' }),
		};
	} finally {
		await client.close();
	}
};

export { handler };
