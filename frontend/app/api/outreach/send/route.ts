import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { buyerId, startupId, email, message, pitchDeck, productFiles } = await req.json();

    if (!buyerId || !startupId || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!process.env.RESEND_API_KEY) {
      console.warn("No RESEND_API_KEY found, falling back to mock send");
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return NextResponse.json({ success: true, message: "Outreach mock-sent successfully!" });
    }

    const attachments = [];
    if (pitchDeck) {
      try {
        const PptxGenJS = (await import('pptxgenjs')).default;
        const pptx = new PptxGenJS();
        
        pptx.author = "MediFlow Nexus AI";
        pptx.company = "MediFlow Nexus";
        pptx.title = "AI Strategy Pitch";
        pptx.layout = "LAYOUT_16x9";

        // Slide 1: Title
        if (pitchDeck.slide1) {
          const slide1 = pptx.addSlide();
          slide1.background = { color: "0D0D15" };
          slide1.addText(pitchDeck.slide1.headline, { x: "10%", y: "40%", w: "80%", fontSize: 44, color: "FFFFFF", bold: true, align: "center" });
          slide1.addText(pitchDeck.slide1.subline, { x: "10%", y: "60%", w: "80%", fontSize: 24, color: "888888", align: "center" });
        }

        // Slide 2: Pain Points
        if (pitchDeck.slide2) {
          const slide2 = pptx.addSlide();
          slide2.background = { color: "0D0D15" };
          slide2.addText(pitchDeck.slide2.title, { x: "5%", y: "10%", w: "90%", fontSize: 32, color: "FFFFFF", bold: true });
          slide2.addText(pitchDeck.slide2.pain_points.map((p: string) => ({ text: p, options: { bullet: true } })), { x: "5%", y: "25%", w: "90%", fontSize: 20, color: "E2E8F0" });
          slide2.addText(`Key Stat: ${pitchDeck.slide2.key_stat}`, { x: "5%", y: "80%", w: "90%", fontSize: 22, color: "F87171", bold: true });
        }

        // Slide 3: Status Quo
        if (pitchDeck.slide3) {
          const slide3 = pptx.addSlide();
          slide3.background = { color: "0D0D15" };
          slide3.addText(pitchDeck.slide3.title, { x: "5%", y: "10%", w: "90%", fontSize: 32, color: "FFFFFF", bold: true });
          slide3.addText(pitchDeck.slide3.consequences.map((c: string) => ({ text: c, options: { bullet: true } })), { x: "5%", y: "25%", w: "90%", fontSize: 20, color: "E2E8F0" });
          slide3.addText(`Revenue at Risk: ${pitchDeck.slide3.revenue_at_risk}`, { x: "5%", y: "80%", w: "90%", fontSize: 22, color: "F87171", bold: true });
        }

        // Slide 4: Solution
        if (pitchDeck.slide4) {
          const slide4 = pptx.addSlide();
          slide4.background = { color: "0D0D15" };
          slide4.addText(pitchDeck.slide4.solution_line, { x: "5%", y: "10%", w: "90%", fontSize: 32, color: "10B981", bold: true });
          slide4.addText(pitchDeck.slide4.steps.map((s: string) => ({ text: s, options: { bullet: true } })), { x: "5%", y: "25%", w: "90%", fontSize: 20, color: "E2E8F0" });
        }

        // Slide 5: Proof Points
        if (pitchDeck.slide5) {
          const slide5 = pptx.addSlide();
          slide5.background = { color: "0D0D15" };
          slide5.addText(pitchDeck.slide5.title, { x: "5%", y: "10%", w: "90%", fontSize: 32, color: "FFFFFF", bold: true });
          slide5.addText(pitchDeck.slide5.proof_points.map((p: string) => ({ text: p, options: { bullet: true } })), { x: "5%", y: "25%", w: "90%", fontSize: 20, color: "E2E8F0" });
        }

        // Slide 6: ROI
        if (pitchDeck.slide6) {
          const slide6 = pptx.addSlide();
          slide6.background = { color: "0D0D15" };
          slide6.addText("ROI & Financial Impact", { x: "5%", y: "10%", w: "90%", fontSize: 32, color: "FFFFFF", bold: true });
          slide6.addText(`Current Loss: ${pitchDeck.slide6.current_loss}`, { x: "5%", y: "30%", w: "45%", fontSize: 22, color: "F87171", bold: true });
          slide6.addText(`Projected Savings: ${pitchDeck.slide6.savings}`, { x: "50%", y: "30%", w: "45%", fontSize: 22, color: "10B981", bold: true });
          slide6.addText(`Payback Period: ${pitchDeck.slide6.payback_period}`, { x: "5%", y: "50%", w: "45%", fontSize: 22, color: "60A5FA", bold: true });
          slide6.addText(`Year 1 ROI: ${pitchDeck.slide6.year1_roi}`, { x: "50%", y: "50%", w: "45%", fontSize: 22, color: "10B981", bold: true });
        }

        // Slide 7: Integration
        if (pitchDeck.slide7) {
          const slide7 = pptx.addSlide();
          slide7.background = { color: "0D0D15" };
          slide7.addText(pitchDeck.slide7.integration_title, { x: "5%", y: "10%", w: "90%", fontSize: 32, color: "FFFFFF", bold: true });
          slide7.addText(pitchDeck.slide7.tech_points.map((t: string) => ({ text: t, options: { bullet: true } })), { x: "5%", y: "25%", w: "90%", fontSize: 20, color: "E2E8F0" });
        }

        // Slide 8: CTA
        if (pitchDeck.slide8) {
          const slide8 = pptx.addSlide();
          slide8.background = { color: "0D0D15" };
          slide8.addText(pitchDeck.slide8.cta, { x: "10%", y: "40%", w: "80%", fontSize: 40, color: "FFFFFF", bold: true, align: "center" });
          slide8.addText(pitchDeck.slide8.contact, { x: "10%", y: "60%", w: "80%", fontSize: 24, color: "60A5FA", align: "center" });
        }

        const pptxBuffer = await pptx.write({ outputType: "nodebuffer" });
        
        attachments.push({
          filename: 'AI-Strategy-Pitch.pptx',
          content: pptxBuffer,
        });
      } catch (err) {
        console.error("Error generating PPTX:", err);
        // Fallback to JSON if generation fails
        attachments.push({
          filename: 'AI-Strategy-Pitch.json',
          content: JSON.stringify(pitchDeck, null, 2),
        });
      }
    }

    if (productFiles && Array.isArray(productFiles)) {
      productFiles.forEach((f: any) => {
        if (f.base64 && f.name) {
          const base64Content = f.base64.includes(',') ? f.base64.split(',')[1] : f.base64;
          attachments.push({
            filename: f.name,
            content: Buffer.from(base64Content, 'base64'),
          });
        }
      });
    }

    // Send actual email via Resend
    const { data, error } = await resend.emails.send({
      from: "MediFlow Nexus <onboarding@resend.dev>", // Replace with your verified domain
      to: email, // If using the free tier, this MUST be your verified email address
      subject: "New Outreach from MediFlow Nexus",
      text: message, // You can also provide html: for styled emails
      attachments: attachments.length > 0 ? attachments : undefined,
    });

    if (error) {
      console.error("[Resend Error]:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log(`[Resend Success] Email sent to: ${email}, ID: ${data?.id}`);

    // In a real implementation, we would update the `marketplace_matches` 
    // table status here via a server-side Supabase client.
    // For this demo, the client already handles the upsert before/after calling this.

    return NextResponse.json({ success: true, message: "Outreach email sent successfully!" });
  } catch (error: any) {
    console.error("Outreach error:", error);
    return NextResponse.json({ error: "Failed to send outreach email." }, { status: 500 });
  }
}
