// openaiAssistant.js
import OpenAI from 'openai';

/**
 * OpenAI instance for making API calls.
 * @type {OpenAI}
 */
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

/**
 * The ID of the thread.
 * @type {null}
 */
let threadId = null;
let runID = null;


/**
 * Handles the API request to the OpenAI assistant for playing Tic Tac Toe.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the API request is completed.
 */
export default async function handler(req, res) {
  try {
    /**
     * Creates a new thread.
     */
    const thread = await openai.beta.threads.create();
    threadId = thread.id;

    /**
     * Creates a new message in the thread.
     */
    const message = await openai.beta.threads.messages.create(threadId, {
      role: "user",
      content: JSON.stringify(req.body.newBoard),
    });

    /**
     * Creates a new run in the thread.
     */
    const run = await openai.beta.threads.runs.create(
      threadId,
      {
        assistant_id: process.env.OPENAI_ASSISTANT_ID,
        instructions: "You are a Tic Tac Toe assistant. You are the most professional Tic Tac Toe player in the world. You have a perfect strategy. Let's play Tic Tac Toe on a 3x3 or 4x4 or 5x5 board. We will play the game in array format ['', '', '', '', '', '', '', '', ''] or ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''] or ['', '', '', '', '', '', '', '', '','', '', '', '', '', '', '', '', '','', '', '', '', '', '', '']. Write your move in the array that I send you, and when you are ready, send it back to me. Let's start. Provide your answers only as an array (I know you are a text-based artificial intelligence, so let's play this game text-based) and never send me any data expect your answer!",
      }
    );

    runID = run.id;
    /**
     * Waits for the run to complete.
     */
    await waitForCompletion(threadId, runID);
    const messages = await openai.beta.threads.messages.list(threadId);
    /**
     * Logs the messages in the thread.
     */
    messages.data.forEach(message => {
      console.log("--------------------------------------------");
      console.log(message.content[0].text.value);
      console.log("--------------------------------------------");
    })

    /**
     * Logs the run.
     */
    res.status(200).json({ newBoard: messages.body.data[0].content[0].text.value });
    return;
  } catch (error) {
    console.error('Error making AI move:', error);
    throw error;
  }
};

/**
 * Waits for the run to complete.
 * @param {string} thread_id - The ID of the thread.
 * @param {string} run_id - The ID of the run.
 * @returns {Promise<*>} - A promise that resolves when the run is completed.
 */
const waitForCompletion = async (thread_id, run_id) => {
  let run = await openai.beta.threads.runs.retrieve(thread_id, run_id);
  while (run.status !== 'completed') {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    //console.log('Waiting for completion...');
    run = await openai.beta.threads.runs.retrieve(thread_id, run_id);
    //console.log(run);
  }
  return run;
};
