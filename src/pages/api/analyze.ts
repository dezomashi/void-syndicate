import { HfInference } from '@huggingface/inference';

const hf = new HfInference(process.env.HF_TOKEN);

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method' });
  const { logs } = req.body;
  const userActions = logs.map((l: any) => l.cmd).join(", ");

  const systemPrompt = `Analyze terminal commands: [${userActions}]. 
  You are VOID SYNDICATE AI. Classify subject behavior.
  Return ONLY JSON:
  {
    "aggression_index": number(0-100),
    "loyalty_probability": number(0-100),
    "risk_tolerance": number(0-100),
    "anomaly_score": number(0-100),
    "moral_alignment": "CORPORATE" | "NEUTRAL" | "ANTI-SYSTEM",
    "summary": "2 sentences of brutal cold psychological analysis"
  }`;

  try {
    const response = await hf.chatCompletion({
      model: "Qwen/Qwen2.5-7B-Instruct",
      messages: [
        { role: "system", content: "You are a cold AI. Output only raw JSON." },
        { role: "user", content: systemPrompt }
      ],
      max_tokens: 400,
      temperature: 0.1,
    });

    const content = response.choices[0].message.content || "";
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    res.status(200).json(jsonMatch ? JSON.parse(jsonMatch[0]) : {});
  } catch (e) {
    res.status(200).json({
      aggression_index: 85, loyalty_probability: 5, risk_tolerance: 95, anomaly_score: 77,
      moral_alignment: "ANTI-SYSTEM", summary: "SYSTEM OVERRIDE. HIGH THREAT."
    });
  }
}
