import axios, { AxiosError } from "axios";
import Error from "next/error";
import { NextResponse } from "next/server";
import { NextApiRequest, NextApiResponse } from "next/types";

function hasMessage(error: unknown): error is { message: string } {
  return typeof error === "object" && error !== null && "message" in error;
}

export async function POST(req: Request, res: NextApiResponse) {
  try {
    const { message } = await req.json();

    const response = await axios.post(
      "https://api.openai.com/v1/completions",
      {
        model: "gpt-3.5-turbo-instruct",
        prompt: message,
        max_tokens: 150,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json({ reply: response.data.choices[0].text });
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

// export default async function chat(req: NextApiRequest, res: NextApiResponse) {
//   const { message } = req.body;
//   console.log("message is ", message);
//   try {
//     const response = await axios.post(
//       "https://api.openai.com/v1/engines/davinci-codex/completions",
//       {
//         prompt: message,
//         max_tokens: 150,
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
//         },
//       }
//     );

//     res.status(200).json({ reply: response.data.choices[0].text });
//   } catch (error: unknown) {
//     if (axios.isAxiosError(error)) {
//       res.status(error.response?.status || 500).json({
//         error: error.response?.data || "An error occurred with the OpenAI API",
//       });
//     } else if (hasMessage(error)) {
//       console.error("Error:", error.message);
//     } else {
//       console.error("Unknown error");
//     }
//   }
// }
