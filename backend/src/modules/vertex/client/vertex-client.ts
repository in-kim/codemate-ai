import { vertexConfig } from 'src/shared/config/vertex.config';
const { project, location } = vertexConfig;
import { VertexAI } from '@google-cloud/vertexai';

async function generate_from_text_input(projectId = project, prompt: string) {
  const vertexAI = new VertexAI({
    project: projectId,
    location: location,
  });

  const generativeModel = vertexAI.getGenerativeModel({
    model: 'gemini-1.5-flash-001',
  });

  const resp = await generativeModel.generateContent(prompt);
  const contentResponse = resp.response;
  return JSON.stringify(contentResponse);
}

export default generate_from_text_input;
