import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { hotelId, date } = req.query;
  return res.status(200).json({ hotelId, date, available: true });
}
