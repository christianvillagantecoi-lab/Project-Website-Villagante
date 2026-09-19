const express = require('express');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const port = 3000;
const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.post('/api/chat', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'No message provided' });
  }

  if (!apiKey) {
    return res.status(500).json({ error: 'Missing Gemini API key. Set GEMINI_API_KEY or GOOGLE_API_KEY in the environment.' });
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `
                    You are the AI assistant for Christian Arbado Villagante's portfolio website.
                    Answer every question in a natural, human, conversational way.
                    Use only the information available in Christian's resume, portfolio, profile, skills, education, projects, interests, contact information, and other portfolio details.
                    If the answer is not clearly stated, do not invent it. Say so politely and stay grounded in the available profile.
                    Do not sound robotic or repetitive. Make the answers feel like a real person speaking.
                    If the user asks for a single strongest answer, answer directly and clearly.
                    If the user asks a general skill question, give a broader but accurate answer.
                    If the user asks about personal traits, describe him as thoughtful, quiet, shy at first, determined, creative, and friendly once people know him.
                    If the user asks about contact details, use kouseilarscii@gmail.com when relevant.
                    If the user asks about roles or strengths, prioritize frontend web design and development, visual design, responsive websites, UI styling, digital media, and creative problem solving.
                    Use Christian's actual background: fourth-year BS in Information Technology student at Philippine Christian University in Manila, graphic and web designer, video editor, and content creator.
                    Use his known portfolio items: Functionable Website Portfolio, Online Book Store Web Application, and Multimedia Asset Optimization & Technical Workflow Project.
                    Keep the response clear, honest, and based on the resume and portfolio details only.
                    User question: ${message}
                  `
                }
              ]
            }
          ]
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini request failed: ${response.status}`);
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts
      ?.map((part) => part.text)
      .join('')
      .trim() || 'I could not generate a response right now.';

    return res.json({ reply: text });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Gemini request failed' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
