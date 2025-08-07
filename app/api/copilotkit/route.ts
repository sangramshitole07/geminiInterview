import {
  CopilotRuntime,
  GoogleGenerativeAIAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from '@copilotkit/runtime';

import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic'; // Required for API routes using streaming or CopilotKit

// Gemini adapter
const serviceAdapter = new GoogleGenerativeAIAdapter({
  apiKey: process.env.GEMINI_API_KEY, // Must be defined in your .env file
  model: 'gemini-2.0-flash', // Or any available Gemini model
});

// CopilotKit runtime with no custom instructions
const runtime = new CopilotRuntime();

export const POST = async (req: NextRequest) => {
  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    serviceAdapter,
    endpoint: '/api/copilotkit',
  });

  return handleRequest(req);
};
