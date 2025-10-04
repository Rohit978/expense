// script.js

const chatWindow = document.getElementById('chat-window');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');

let model;

// A simple in-memory "database" to store expenses
const expenses = [];

// A predefined set of intents and sample sentences for classification
const intents = {
    'log_expense': ['I spent 50 on groceries', 'bought coffee for 5', 'paid 20 for gas', 'rent was 1200'],
    'get_summary': ['how much did I spend', 'show me my expenses', 'what are my transactions'],
    'greeting': ['hello', 'hi', 'hey', 'what\'s up'],
    'unknown': ['asdf', 'can you help me', 'I don\'t understand'] // Fallback for unknown input
};

// Load the Universal Sentence Encoder model
async function loadModel() {
    try {
        addMessage('Bot is loading...', 'bot');
        model = await use.load();
        addMessage('Bot is ready! What did you spend?', 'bot');
    } catch (error) {
        console.error('Failed to load model:', error);
        addMessage('Error loading bot. Please refresh the page.', 'bot');
    }
}

// Function to add a new message to the chat window
function addMessage(text, sender) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('chat-message', `${sender}-message`);
    messageElement.textContent = text;
    chatWindow.appendChild(messageElement);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Function to handle user input and process it with the AI model
async function handleUserMessage() {
    const userText = userInput.value.trim();
    if (userText === '') return;

    addMessage(userText, 'user');
    userInput.value = '';

    const intent = await classifyIntent(userText);
    let botResponse = '';

    // Route the response based on the classified intent
    if (intent === 'log_expense') {
        // Simple regex to extract numbers and keywords
        const amountMatch = userText.match(/\d+/);
        const categoryMatch = userText.match(/on\s(\w+)|for\s(\w+)/);

        if (amountMatch) {
            const amount = parseFloat(amountMatch[0]);
            const category = categoryMatch ? categoryMatch[1] || categoryMatch[2] : 'Uncategorized';
            expenses.push({ amount, category, date: new Date() });
            botResponse = `Logged $${amount} for ${category}.`;
        } else {
            botResponse = 'Please tell me the amount and what you spent it on, e.g., "I spent 50 on groceries".';
        }
    } else if (intent === 'get_summary') {
        const total = expenses.reduce((sum, item) => sum + item.amount, 0);
        const expenseList = expenses.map(e => `$${e.amount} on ${e.category}`).join(', ');
        botResponse = `Your total spending is $${total}. Your recent expenses are: ${expenseList || 'none'}.`;
    } else if (intent === 'greeting') {
        botResponse = 'Hi there! How can I help you manage your expenses today?';
    } else {
        botResponse = 'I am not sure how to help with that. Please ask about logging expenses or getting a summary.';
    }

    addMessage(botResponse, 'bot');
}

// Function to classify the user's message using the Universal Sentence Encoder
async function classifyIntent(message) {
    const messageEmbedding = await model.embed(message);
    let maxSimilarity = -1;
    let classifiedIntent = 'unknown';

    for (const intentName in intents) {
        const intentSentences = intents[intentName];
        if (intentSentences.length === 0) continue;

        const intentEmbeddings = await model.embed(intentSentences);
        // Calculate cosine similarity between the user message and each intent's examples
        const similarities = tf.matMul(messageEmbedding, intentEmbeddings, false, true).dataSync();
        
        // Find the highest similarity score for the current intent
        const highestSimilarity = Math.max(...similarities);
        
        // If this intent has the highest similarity so far, update the classified intent
        if (highestSimilarity > maxSimilarity) {
            maxSimilarity = highestSimilarity;
            classifiedIntent = intentName;
        }
    }
    console.log(`Classified intent: ${classifiedIntent} (Similarity: ${maxSimilarity.toFixed(2)})`);
    return classifiedIntent;
}


// Event listeners for sending a message
sendButton.addEventListener('click', handleUserMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleUserMessage();
    }
});

// Initialize the bot by loading the AI model
loadModel();