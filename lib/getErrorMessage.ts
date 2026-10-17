type ErrorWithMessage = {
  status?: number | string;
  data?: {
    message?: unknown;
    error?: unknown;
    errors?: unknown;
    detail?: unknown;
  };
  error?: unknown;
  message?: unknown;
};

const joinMessages = (messages: Array<string | null>) => {
  const uniqueMessages = [...new Set(messages.filter(Boolean))];
  return uniqueMessages.length > 0 ? uniqueMessages.join(", ") : null;
};

const normalizeMessage = (value: unknown): string | null => {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value === "string") {
    const normalizedValue = value.trim();
    return normalizedValue || null;
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  if (Array.isArray(value)) {
    return joinMessages(value.map((item) => normalizeMessage(item)));
  }

  if (typeof value === "object") {
    const messageObject = value as Record<string, unknown>;
    const prioritizedKeys = ["message", "error", "errors", "detail"];

    for (const key of prioritizedKeys) {
      const normalizedValue = normalizeMessage(messageObject[key]);
      if (normalizedValue) {
        return normalizedValue;
      }
    }

    return joinMessages(
      Object.values(messageObject).map((item) => normalizeMessage(item)),
    );
  }

  return null;
};

export const getErrorMessage = (
  error: unknown,
  fallback = "Something went wrong. Please try again.",
) => {
  if (!error) {
    return fallback;
  }

  if (typeof error === "string") {
    return error;
  }

  if (typeof error === "object") {
    const knownError = error as ErrorWithMessage;
    const dataMessage = normalizeMessage(knownError.data);
    const errorMessage = normalizeMessage(knownError.error);
    const message = normalizeMessage(knownError.message);

    if (dataMessage) {
      return dataMessage;
    }

    if (errorMessage) {
      return errorMessage;
    }

    if (message) {
      return message;
    }

    if (knownError.status === "FETCH_ERROR") {
      return "Network error. Please check your connection and try again.";
    }
  }

  return fallback;
};
