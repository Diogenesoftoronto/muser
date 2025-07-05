import { GoogleGenAI, Type } from "@google/genai";
import ModifiedDocs from './ModifiedDocs.mdx?raw';
const ai = new GoogleGenAI({
    apiKey: "",
});

export async function callAI(messages) {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
            {
                role: "system",
                parts: [{ text: ModifiedDocs }]
            },
            {
                role: "user",
                parts: [{ text: "generate a lofi beat" }]
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