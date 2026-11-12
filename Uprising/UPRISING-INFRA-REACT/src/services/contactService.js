export async function submitContactRequest(payload) {
  const endpoint = import.meta.env.VITE_CONTACT_API_URL;
  if (!endpoint) {
    throw new Error('The contact form is not connected to a submission service yet.');
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`The contact request could not be sent (HTTP ${response.status}).`);
  }

  return response;
}
