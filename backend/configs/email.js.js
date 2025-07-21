import fetch from 'node-fetch';

export const sendEmailJS = async (params) => {
  const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      service_id: process.env.EMAILJS_SERVICE_ID,
      template_id: process.env.EMAILJS_TEMPLATE_ID,
      user_id: process.env.EMAILJS_PUBLIC_KEY,
      template_params: params
    })
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`EmailJS failed: ${response.status} - ${errorBody}`);
  }

  return await response.json();
};
