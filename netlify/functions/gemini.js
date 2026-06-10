exports.handler = async function(event, context) {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }
    
    // Netlify 대시보드에서 설정할 환경변수입니다.
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
        return { 
            statusCode: 500, 
            body: JSON.stringify({ error: "Server Error: Missing API Key in Environment Variables." }) 
        };
    }

    try {
        const body = JSON.parse(event.body);
        const { prompt } = body;
        
        if (!prompt) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Bad Request: No prompt provided." })
            };
        }

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });
        
        const data = await response.json();
        
        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
}
