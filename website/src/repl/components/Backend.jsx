import { GoogleGenAI, Type } from "@google/genai";
import ModifiedDocs from './ModifiedDocs.mdx?raw';
import OpenAI from "openai";

const ai = new GoogleGenAI({
    apiKey: "AIzaSyCYI-p_3i8hAaFjrOVF9sjubwsxizU9SXU",
});

const openaiClient = new OpenAI({
    baseURL: "https://models.github.ai/inference",
    apiKey: "",
    dangerouslyAllowBrowser: true
});

export async function callOpenAI(messages) {
    // Get the last user message from the messages array
    const lastUserMessage = Array.isArray(messages) ? messages[messages.length - 1] : messages;

    const response = await openaiClient.chat.completions.create({
        model: "openai/gpt-4o",
        messages: [
            {
                role: "system",
                content: ModifiedDocs
            },
            {
                role: "user",
                content: lastUserMessage
            }
        ],
        response_format: {
            type: "json_schema",
            json_schema: {
                name: "strudel_response",
                schema: {
                    type: "object",
                    properties: {
                        code: {
                            type: "string",
                            description: "The Strudel code to generate the requested music pattern"
                        },
                        reasoning: {
                            type: "string",
                            description: "Explanation of the musical choices and pattern design decisions"
                        }
                    },
                    required: ["code", "reasoning"],
                    additionalProperties: false
                }
            }
        }
    });

    return response.choices[0].message.content;
}

export async function callGoogleAI(messages) {
    // Get the last user message from the messages array
    const lastUserMessage = Array.isArray(messages) ? messages[messages.length - 1] : messages;
    const response = await ai.models.generateContent({
        model: "gemini-2.5-pro",
        contents: [
            {
                role: "user",
                parts: [{ text: `system: ${ModifiedDocs} \n user: ${lastUserMessage}` }]
            }
        ],
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    code: {
                        type: Type.STRING,
                        description: "The Strudel code to generate the requested music pattern"
                    },
                    reasoning: {
                        type: Type.STRING,
                        description: "Explanation of the musical choices and pattern design decisions"
                    }
                },
                propertyOrdering: ["code", "reasoning"]
            }
        },
    });
    return response.text;
}

export async function callAI(messages) {
    // Use OpenAI as the default option
    return await callOpenAI(messages);
}