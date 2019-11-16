import * as ip_location from './infrastructure/ip_location';
import express from 'express';

const ipLocationService = new ip_location.MmdbLocationService();

const ip2code = async (ip: string) => {
  return await ipLocationService.countryForIp(ip);
};

// Create Express server
const app = express();

app.get("/", (req, res) => {
  res.send(req.ips);
});

const server = app.listen(3000, () => {
  console.log('OK');
});

export default server;
