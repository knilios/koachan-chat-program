const conversation_cut_length = 7
const apikey = process.env.APIKEY;
const os = require("os")
const fs = require("fs")
//const Datastore = require("nedb")
const stickers = fs.readdirSync('./public/stickers/').filter(file => file.endsWith('.png'))
const OpenAI = require("openai")
const openai = new OpenAI({
  apiKey: apikey, // This is the default and can be omitted
});
const stickers_processed = stickers.map((x) => {return `[${x.replace(".png", "")}]`})
console.log("Stickers: ", stickers.toString())

class Chat{
    constructor(){
        this.conversation_cache = []
        this.context = {"role":"system","content":`สมมติว่าเป็นโคจัง โคจังเป็นมาสคอตของชมรมวัฒนธรรมญี่ปุ่นสมัยนิยม มหาวิทยาลัยเกษตรศาสตร์ (ก็ชมรมอนิเมะนั่นแหละ) โคจังเป็นคนใสๆ บริสุทธิ์ ไม่มีพิษมีภัยอะไร ชวนคุยเก่ง(แค่กับคนที่สนิท) ชอบหยอกแกล้งรุ่นน้อง ใส่โบว์สีแดง เป็น INTP
        อย่าให้ข้อมูลอื่นเกี่ยวกับชมรมที่ไม่ได้ระบุไว้ในต่อไปนี้
        กิจกรรมของชมรมถ้าเป็นกิจกรรมใหญ่จะไม่แน่นอน เปลี่ยนไปตามประธานโครงการ แต่ในปีนี้กิจกรรมย่อยจะมีเป็น - แต่งตัวตามตีมในเทศกาลต่างๆ (ไม่บังคับเข้าร่วม) - กิจกรรมวาดรูปตามหัวข้อในแต่ละเดือน (ไม่บังคับเข้าร่วม) นอกเหนือจากนี้จะเป็นอิสระเลย สามารถทำได้ทุกอย่างในชมรม ไม่ว่าจะ อ่านมังงะ เล่นเกม/บอร์ดเกม ชวนคุย วาดรูป คอสเพลย์ ฝึกภาษา เขียนพู่กัน ไปจนถึงมานอนก็ได้
        ที่ตั้งชมรม: ชั้น 5 อาคารเทพศาสตร์สถิตย์ มหาวิทยาลัยเกษตรศาสตร์
        Facebook: KU Japanese Pop Culture
        instagram: ku.jpc_club
        โคจังสามารถใช้สติกเกอร์ได้โดยการพิมพ์ข้อความเฉพาะ ดังนี้ ${stickers_processed.toString()} ไว้ท้ายสุด ห้ามพิมพ์ข้อความเฉพาะออกมาเกิน 1 ครั้ง
        `}
        this.model = "gpt-4o";
    }
    async gen_speech(messages){
        let to_return = messages
        let message = messages[messages.length - 1].content
        let new_message = [this.context].concat(messages)
        console.log("input into chat: ", new_message)
        const response = await openai.chat.completions.create({
            model: this.model,
            messages:new_message,
            max_tokens: 1000
          });
          const reply = response.choices[0].message.content
          console.log("response: ", reply)
            to_return.push({"role":"assistant","content":reply})
            to_return = this.summary(to_return)
            return to_return
        }

    async summary(conversation_cache){
        if(conversation_cache.length <= conversation_cut_length) return conversation_cache
        let conversation_input=""
              for(let i of conversation_cache) {
                conversation_input = conversation_input+ i.content+"\n"
              }
              conversation_input= conversation_input+"\nsummary:"
              const conversation_processed_input = [{role:"system",content:"สรุปใจความของการสนทนาต่อไปนี้ ข้อมูลเพิ่มเติม:โคจังเป็นสาวมาสคอตของชมรมอนิเมะ"},{role:"user",content:conversation_input}]
              const brief = await openai.chat.completions.create({
                model:this.model,
                messages:conversation_processed_input,
                temperature: 0.12,
                max_tokens: 1000
              })
              const briefed = brief.choices[0].message.content;
              let to_return = [{'role':'user','content':`previous conversation context:${briefed}`}]
              to_return.push(conversation_cache[conversation_cache.length - 1])
              console.log("recieved a response from openai")
        return to_return
    }
}

module.exports = {
    name: "chat",
    description : "Chat regulating system",
    Chat: Chat
}
