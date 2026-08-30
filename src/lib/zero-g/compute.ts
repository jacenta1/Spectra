/**
 * 0G Compute client via Router API.
 * OpenAI-compatible endpoint for AI inference through 0G's decentralized compute network.
 * 
 * Used in Wave 4 for anomaly detection on agent behavior.
 * Placeholder for now -- will be expanded when we add AI-powered safety scoring.
 */

import { ZERO_G_COMPUTE } from "./constants";

interface ComputeRequest {
  model: string;
  messages: { role: string; content: string }[];
  temperature?: number;
  max_tokens?: number;
}

interface ComputeResponse {
  id: string;
  choices: { message: { role: string; content: string } }[];
  usage: { prompt_tokens: number; completion_tokens: number; total_tokens: number };
}

/**
 * Call 0G Compute Router API (OpenAI-compatible).
 */
export async function callComputeRouter(request: ComputeRequest): Promise<ComputeResponse | null> {
  if (!ZERO_G_COMPUTE.apiKey) {
    console.warn("0G Compute API key not configured");
    return null;
  }

  try {
    const response = await fetch(`${ZERO_G_COMPUTE.routerUrl}/v1/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${ZERO_G_COMPUTE.apiKey}`,
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      console.error("Compute Router error:", response.status);
      return null;
    }

    return response.json();
  } catch {
    console.error("Failed to call 0G Compute Router");
    return null;
  }
}

/**
 * Check if 0G Compute is configured and reachable.
 */
export async function checkComputeStatus(): Promise<{
  configured: boolean;
  reachable: boolean;
}> {
  const configured = !!ZERO_G_COMPUTE.apiKey;
  if (!configured) return { configured: false, reachable: false };

  try {
    const response = await fetch(`${ZERO_G_COMPUTE.routerUrl}/v1/models`, {
      headers: { "Authorization": `Bearer ${ZERO_G_COMPUTE.apiKey}` },
    });
    return { configured: true, reachable: response.ok };
  } catch {
    return { configured: true, reachable: false };
  }
}
