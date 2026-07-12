/**
 * Structured Error Classes for Critical Dependencies
 * Ref: ANTIGRAVITY_SPEC §13
 */

export class LLMError extends Error {
  constructor(message, cause) {
    super(message);
    this.name = 'LLMError';
    this.cause = cause;
    this.friendlyMessage = 'The AI model failed to generate a response. Please check your Gemini API key and try again.';
  }
}

export class SearchError extends Error {
  constructor(message, cause) {
    super(message);
    this.name = 'SearchError';
    this.cause = cause;
    this.friendlyMessage = 'Failed to retrieve recent market news. We will proceed with historical baseline data.';
  }
}

export class FinanceError extends Error {
  constructor(message, cause) {
    super(message);
    this.name = 'FinanceError';
    this.cause = cause;
    this.friendlyMessage = 'Failed to fetch financial indicators or market prices from Yahoo Finance. Falling back to default baseline metrics.';
  }
}

export class DatabaseError extends Error {
  constructor(message, cause) {
    super(message);
    this.name = 'DatabaseError';
    this.cause = cause;
    this.friendlyMessage = 'We ran into a database error trying to save your report. The report is active in memory but will not be saved.';
  }
}

/**
 * Parses any caught error and returns a human-friendly response message.
 * 
 * @param {Error} error 
 * @returns {string} User-friendly error message
 */
export function getFriendlyErrorMessage(error) {
  if (error instanceof LLMError) return error.friendlyMessage;
  if (error instanceof SearchError) return error.friendlyMessage;
  if (error instanceof FinanceError) return error.friendlyMessage;
  if (error instanceof DatabaseError) return error.friendlyMessage;
  
  // Generic / Default
  return error.message || 'An unexpected error occurred during report generation.';
}
