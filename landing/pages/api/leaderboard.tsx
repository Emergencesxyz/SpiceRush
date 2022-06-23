import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const resData = await fetch('http://vps-5a1fae51.vps.ovh.net:3001/')
    const data = await resData.json();
    res.status(200).send(data);    
  }