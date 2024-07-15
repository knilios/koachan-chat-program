const apikey = process.env.APIKEY;  
//const Datastore = require("nedb")
const OpenAI = require("openai")
const openai = new OpenAI({
    apiKey: apikey, // This is the default and can be omitted
});

class Conversation_handler{
    constructor(context){
        this.context = {"role":"system","content":context}
    }
    async generate(message, model){
        const response = await openai.chat.completions.create({
            model: model,
            messages: [this.context].concat(message),
            max_tokens: 1000
          });
          const reply = response.choices[0].message.content
            return reply
    }
}

module.exports = Conversation_handler

