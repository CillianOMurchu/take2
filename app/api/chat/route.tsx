import axios from "axios";
import console from "console";
import { NextResponse } from "next/server";
import { NextApiResponse } from "next/types";
import OpenAI from "openai";

export async function POST(req: Request, res: NextApiResponse) {
  try {
    const { message } = await req.json();
    const openai = new OpenAI();
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        {
          role: "user",
          content: message,
        },
      ],
    });

    console.log("completion si ", completion.choices[0].message.content);
    const reply = completion.choices[0].message.content;
    return NextResponse.json({ ok:true, reply });
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      const message =
        error.response?.data || "An error occurred with the OpenAI API";
      return NextResponse.json({ error: message }, { status });
    } else {
      return NextResponse.json(
        { error: "An unknown error occurred" },
        { status: 500 }
      );
    }
  }
}
