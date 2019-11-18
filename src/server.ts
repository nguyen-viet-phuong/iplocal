import * as ip_location from './infrastructure/ip_location';
import express from 'express';
import https from 'https';
import fs from 'fs';

const options = {
  key: fs.readFileSync(process.env.KEY_PATH),
  cert: fs.readFileSync(process.env.CERT_PATH)
};

const ipLocationService = new ip_location.MmdbLocationService();

const ip2code = async (ip: string) => {
  return await ipLocationService.countryForIp(ip);
};

// Create Express server
const app = express();

app.get("/", async (req, res) => {
  const ip = req.headers['x-real-ip'].toString();
  const code = await ip2code(ip);
  res.send({
    ip,
    code
  });
});

app.listen(3001);

const server = https.createServer(options, app).listen(3000);

export default server;
