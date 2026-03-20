import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const client = new OpenAI({
  baseURL: "https://api.deepseek.com/v1",
  apiKey: process.env.DEEPSEEK_API_KEY || "",
});

export async function POST(req: NextRequest) {
  try {
    const { customer, product, industry, challenge, result } = await req.json();
    if (!customer?.trim()) {
      return NextResponse.json({ error: "Customer name is required." }, { status: 400 });
    }

    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: `You are an expert content marketer specializing in B2B case studies. Write compelling, data-driven case studies that follow a clear problem-solution-results structure.`,
        },
        {
          role: "user",
          content: `Write a complete B2B case study for:

**Customer/Company:** ${customer}
**Product/Service Used:** ${product || "Your product"}
**Industry:** ${industry || "Technology"}
**The Challenge:** ${challenge || "Describe the main business challenge"}
**The Result:** ${result || "Describe measurable or qualitative results achieved"}

Generate a professional case study in markdown with ALL of the following sections:

## Case Study Format:

### Title
[Customer Name] Achieves [Key Outcome] with [Product]

### Executive Summary (3-4 sentences)
High-level overview: the customer, the problem, the solution, the result.

### About the Customer
- Company size and industry
- Key facts about the company
- Why they were looking for a solution

### The Challenge
- Specific business problem they faced
- What was at stake
- Why existing solutions weren't working
- Key pain points

### The Solution
- How the product/service was implemented
- Why they chose this solution
- Implementation approach
- Key features used

### The Results (use metrics wherever possible)
- Quantitative results (numbers, percentages, time saved)
- Qualitative improvements
- Before/after comparison
- Unexpected benefits

### Customer Quote
A compelling testimonial quote (write it realistically based on the context):
"I [what they say about the experience]"

### Looking Forward
What the customer plans to do next with the product/company

---

Format with clear markdown headings. Use bold for key metrics. Make it compelling but truthful.`,
        },
      ],
      max_tokens: 1200,
      temperature: 0.65,
    });

    const result_text = completion.choices[0]?.message?.content || "";
    return NextResponse.json({ result: result_text });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Case study generation failed." }, { status: 500 });
  }
}
