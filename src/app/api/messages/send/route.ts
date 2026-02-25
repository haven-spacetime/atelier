import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Convert any phone format to E.164: "+17147250215"
function toE164(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return digits.startsWith("1") ? `+${digits}` : `+1${digits}`;
}

export async function POST(request: NextRequest) {
  const bbUrl = process.env.BLUEBUBBLES_URL;
  const bbPassword = process.env.BLUEBUBBLES_PASSWORD;

  if (!bbUrl || !bbPassword) {
    return NextResponse.json(
      {
        error: "BlueBubbles not configured",
        hint: "Add BLUEBUBBLES_URL and BLUEBUBBLES_PASSWORD to .env.local",
      },
      { status: 503 },
    );
  }

  const body = await request.json();
  const { phone, message, customerId } = body as {
    phone: string;
    message: string;
    customerId?: string;
  };

  if (!phone || !message?.trim()) {
    return NextResponse.json({ error: "phone and message are required" }, { status: 400 });
  }

  const e164 = toE164(phone);
  const chatGuid = `iMessage;-;${e164}`;
  const tempGuid = `temp-${Date.now()}-${Math.random().toString(36).slice(2)}`;

  try {
    const res = await fetch(
      `${bbUrl}/api/v1/message/text?password=${encodeURIComponent(bbPassword)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatGuid, message: message.trim(), tempGuid }),
      },
    );

    const text = await res.text();

    if (!res.ok) {
      return NextResponse.json(
        { error: `BlueBubbles error ${res.status}: ${text}` },
        { status: 502 },
      );
    }

    // Parse response if possible, but don't fail if it's not JSON
    let data: unknown = null;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }

    // Stamp lastContactedAt + method on the customer after a successful send
    if (customerId) {
      await prisma.customer.update({
        where: { id: customerId },
        data: { lastContactedAt: new Date(), lastContactMethod: "iMessage" },
      });
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: `Failed to reach BlueBubbles: ${errMsg}` }, { status: 502 });
  }
}
