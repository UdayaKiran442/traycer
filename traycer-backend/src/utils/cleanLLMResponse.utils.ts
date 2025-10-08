export function cleanLLMResponse(response: string) {
    return response
        .replace(/```json?/, "")  // Remove opening ```json 
        .replace(/```$/, "")        // Remove trailing ```
        .trim();
}
