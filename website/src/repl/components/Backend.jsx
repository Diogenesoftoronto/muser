import { GoogleGenAI, Type } from "@google/genai";
import ModifiedDocs from './ModifiedDocs.mdx?raw';
const ai = new GoogleGenAI({
    apiKey: "",
});

export async function callAI(messages) {
    // Get the last user message from the messages array
    const lastUserMessage = Array.isArray(messages) ? messages[messages.length - 1] : messages;
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
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
    // console.log(response.text);
}