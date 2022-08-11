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
			site: body.host,
			page: body.page || 'unknown',
			time: body.time,
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
