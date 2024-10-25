import Stripe from "stripe"
import { NextResponse, NextRequest } from "next/server"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {

    const payload = await req.text();
    const response = JSON.parse(payload);

    const sig = req.headers.get("Stripe-Signature");

    // Check if response.created exists and convert it properly
    const createdTimestamp = response?.created ? new Date(response.created * 1000) : null;
    
    // Format dateTime and timeString
    const dateTime = createdTimestamp?.toLocaleDateString();  // e.g., "MM/DD/YYYY" or local format
    const timeString = createdTimestamp?.toLocaleTimeString(); // e.g., "HH:MM:SS AM/PM"

    try {
        const event = stripe.webhooks.constructEvent(
            payload,
            sig!,
            process.env.STRIPE_WEBHOOK_SECRET!
        );

        console.log("event", event.type);
        console.log("Event date:", dateTime, "Event time:", timeString);

        return NextResponse.json({ 
            status: "success", 
            event: event.type,
            date: dateTime,     // Include formatted date
            time: timeString    // Include formatted time
        });

    } catch (error) {
        console.error("Webhook error:", error);
        return NextResponse.json({ 
            status: "Failed", 
            error: error instanceof Error ? error.message : "An unknown error occurred"
        });
    }
}