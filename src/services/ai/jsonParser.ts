import { GeneratedMission } from './types';

export interface CleanMissionPayload {
  title: string;
  description: string;
  category: string;
  durationMinutes: number;
  difficulty: string;
  estimatedDistance: string;
  tasks: string[];
  bonusTask: string;
  safetyTip: string;
}

/**
 * Robustly parses and cleans mission JSON strings produced by LLMs.
 * Handles:
 * - Markdown code fences (```json ... ``` or ``` ...)
 * - Leading/trailing conversational commentary
 * - Trailing commas before closing braces/brackets
 * - Truncated or escaped characters
 * - Missing or malformed property types
 */
export function extractAndParseMissionJson(rawText: string, fallbackDuration: number = 30): CleanMissionPayload {
  if (!rawText || typeof rawText !== 'string' || !rawText.trim()) {
    throw new Error('Empty response payload from AI model');
  }

  let text = rawText.trim();

  // 1. Strip markdown code fences if present
  const markdownJsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (markdownJsonMatch && markdownJsonMatch[1]) {
    text = markdownJsonMatch[1].trim();
  }

  // 2. Locate the outermost JSON object boundaries { ... }
  const firstBrace = text.indexOf('{');
  const lastBrace = text.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    text = text.substring(firstBrace, lastBrace + 1);
  }

  // 3. Remove trailing commas before closing braces or brackets (common LLM JSON flaw)
  text = text.replace(/,\s*([}\]])/g, '$1');

  // 4. Attempt direct JSON parse
  let parsed: any;
  try {
    parsed = JSON.parse(text);
  } catch (initialErr: any) {
    // 5. Secondary heuristic repair: attempt fixing unescaped newlines inside strings
    try {
      const sanitized = text.replace(/(?:\r\n|\r|\n)/g, ' ');
      parsed = JSON.parse(sanitized);
    } catch {
      throw new Error(`Malformed JSON output: ${initialErr?.message || 'Syntax error'}`);
    }
  }

  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('Parsed output is not a JSON object');
  }

  // 6. Validate and sanitize required fields
  const title = typeof parsed.title === 'string' && parsed.title.trim()
    ? parsed.title.trim()
    : 'The Open Horizon Trail';

  const description = typeof parsed.description === 'string' && parsed.description.trim()
    ? parsed.description.trim()
    : 'A quiet outdoor exploration calibrated to your current surroundings.';

  const category = typeof parsed.category === 'string' && parsed.category.trim()
    ? parsed.category.trim()
    : 'Outdoor Exploration';

  let durationMinutes = fallbackDuration;
  if (typeof parsed.durationMinutes === 'number' && !isNaN(parsed.durationMinutes) && parsed.durationMinutes > 0) {
    durationMinutes = parsed.durationMinutes;
  } else if (typeof parsed.durationMinutes === 'string') {
    const num = parseInt(parsed.durationMinutes.replace(/\D+/g, ''), 10);
    if (!isNaN(num) && num > 0) durationMinutes = num;
  }

  const difficulty = typeof parsed.difficulty === 'string' && parsed.difficulty.trim()
    ? parsed.difficulty.trim()
    : 'Moderate';

  const estimatedDistance = typeof parsed.estimatedDistance === 'string' && parsed.estimatedDistance.trim()
    ? parsed.estimatedDistance.trim()
    : `${(durationMinutes * 0.07).toFixed(1)} km`;

  let tasks: string[] = [];
  if (Array.isArray(parsed.tasks)) {
    tasks = parsed.tasks
      .filter((t: any) => typeof t === 'string' && t.trim().length > 0)
      .map((t: string) => t.trim());
  }

  if (tasks.length === 0) {
    tasks = [
      'Step across your doorway, put your phone away, and feel the outdoor air.',
      'Walk at an easy stride and notice two living botanical or architectural details.',
      'Pause for 60 seconds of complete silence and breathe in deeply.',
      'Return along an unhurried route feeling grounded and clear-headed.',
    ];
  }

  const bonusTask = typeof parsed.bonusTask === 'string' && parsed.bonusTask.trim()
    ? parsed.bonusTask.trim()
    : 'Capture one unexpected detail in your surroundings.';

  const safetyTip = typeof parsed.safetyTip === 'string' && parsed.safetyTip.trim()
    ? parsed.safetyTip.trim()
    : 'Stay on public pathways and remain aware of footing.';

  return {
    title,
    description,
    category,
    durationMinutes,
    difficulty,
    estimatedDistance,
    tasks,
    bonusTask,
    safetyTip,
  };
}
