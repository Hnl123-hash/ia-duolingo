
import { fetchQuestions, fetchLearningContent } from './src/services/api.js';

// Mock global fetch
global.fetch = async (url, options) => {
    console.log(`Fetching ${url}`);
    const body = JSON.parse(options.body);
    console.log(`Request Body: ${JSON.stringify(body)}`);

    // Simulate responses
    return {
        ok: true,
        json: async () => ({
            text: "```json\n[{ \"id\": 1, \"pergunta\": \"Question 1\" }]\n```"
        })
    };
};

async function testApi() {
    try {
        console.log("--- Testing Load More (Simulation) ---");
        console.log("Initial Load:");
        await fetchLearningContent("Topic", "B1", "Gramática");

        console.log("\nLoad More (Second Call):");
        await fetchLearningContent("Topic", "B1", "Gramática");

        console.log("\nSUCCESS: Multiple API calls executed successfully.");
    } catch (error) {
        console.error("FAILURE:", error);
    }
}

testApi();
