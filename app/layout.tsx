// app/layout.tsx
import './globals.css';
import { ReactNode } from 'react';
import { CopilotKit } from '@copilotkit/react-core'; // ✅ Import the provider

export const metadata = {
  title: 'AI Interview Platform',
  description: 'Practice interviews with AI',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CopilotKit runtimeUrl="/api/copilotkit">{children}</CopilotKit>
      </body>
    </html>
  );
}
