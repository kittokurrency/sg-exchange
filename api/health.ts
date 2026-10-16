import { Request, Response, Router } from 'express';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  const masKeyConfigured = Boolean(process.env.MAS_KEY_ID || process.env.MAS_API_KEY_ID);

  res.status(200).json({
    status: 'healthy',
    service: 'LionRate SG Exchange Rate API',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    environment: process.env.NODE_ENV || 'development',
    masApi: {
      configured: masKeyConfigured,
      keyIdPresent: masKeyConfigured,
      targetEndpoint: 'https://eservices.mas.gov.sg/apimg-gw/server/monthly_statistical_bulletin_non610ora/exchange_rates_end_of_period_daily/views/exchange_rates_end_of_period_daily'
    }
  });
});

export default router;
