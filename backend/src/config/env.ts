import dotenv from 'dotenv';
dotenv.config();


interface Config {
  PORT: number;
  NODE_ENV: string;
  OPENAI_API_KEY?: string;
  MONGO_URI: string;
  SMTP_HOST: string;
  SMTP_PORT: number;
  SMTP_USER: string;
  SMTP_PASS: string;
  SMTP_FROM: string;
}

export const config: Config = {
  PORT: parseInt(process.env.PORT || '5200', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  MONGO_URI: process.env.MONGO_URI || '',
  SMTP_HOST: process.env.SMTP_HOST || '',
  SMTP_PORT: parseInt(process.env.SMTP_PORT || '587', 10),
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASS: process.env.SMTP_PASS || '',
  SMTP_FROM: process.env.SMTP_FROM || '',
};
