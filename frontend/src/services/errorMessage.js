export function getApiErrorMessage(error, fallback = "Something went wrong") {
  const detail = error?.response?.data?.detail;

  if (typeof detail === "string") {
    return detail;
  }

  if (Array.isArray(detail) && detail.length > 0) {
    return detail
      .map((item) => {
        const field = item.loc?.at(-1);
        return field ? `${field}: ${item.msg}` : item.msg;
      })
      .join(", ");
  }

  return fallback;
}
