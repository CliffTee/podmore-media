export default async function handler(request, response) {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    return response.status(405).json({ error: "Method not allowed" });
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return response.status(500).json({ error: "Stripe is not configured" });
  }

  const sessionId = request.query.session_id;
  if (!sessionId || typeof sessionId !== "string" || !sessionId.startsWith("cs_")) {
    return response.status(400).json({ error: "Missing or invalid Stripe checkout session" });
  }

  try {
    const stripeResponse = await fetch(`https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`, {
      headers: {
        Authorization: `Bearer ${secretKey}`,
      },
    });

    const session = await stripeResponse.json();

    if (!stripeResponse.ok) {
      return response.status(stripeResponse.status).json({
        error: session?.error?.message || "Unable to retrieve Stripe checkout session",
      });
    }

    const email = session?.customer_details?.email || session?.customer_email || "";

    if (!email) {
      return response.status(404).json({ error: "No customer email found for this checkout session" });
    }

    return response.status(200).json({
      email,
      paymentStatus: session?.payment_status || null,
      status: session?.status || null,
    });
  } catch {
    return response.status(500).json({ error: "Unable to contact Stripe right now" });
  }
}
