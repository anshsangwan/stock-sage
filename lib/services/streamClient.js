/**
 * streamResearch
 * 
 * Establishes a POST request to /api/stream and parses the Server-Sent Events (SSE) stream.
 * 
 * @param {string} query - The search query (company or ticker)
 * @param {string} apiKey - The user's Gemini API key
 * @param {object} callbacks - Event callbacks
 * @param {function} callbacks.onProgress - Called with (stage, statusInfo)
 * @param {function} callbacks.onComplete - Called with (reportId)
 * @param {function} callbacks.onError - Called with (errorMsg)
 */
export async function streamResearch(query, apiKey, { onProgress, onComplete, onError }) {
  try {
    const response = await fetch('/api/stream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || `Server returned ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n\n');
      
      // Save the last incomplete chunk back into buffer
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (!line.trim()) continue;

        if (line.startsWith('data: ')) {
          try {
            const rawData = line.slice(6).trim();
            const data = JSON.parse(rawData);

            if (data.type === 'progress') {
              onProgress(data.stage, { status: data.status, companyName: data.companyName, ticker: data.ticker });
            } else if (data.type === 'complete') {
              onComplete(data.reportId);
            } else if (data.type === 'error') {
              onError(data.message);
            }
          } catch (err) {
            console.error('Failed to parse SSE line:', line, err);
          }
        }
      }
    }
  } catch (error) {
    onError(error.message || 'Network stream error');
  }
}
