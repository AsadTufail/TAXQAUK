const { BufferJSON, WA_DEFAULT_EPHEMERAL, generateWAMessageFromContent, proto, generateWAMessageContent, generateWAMessage, prepareWAMessageMedia, areJidsSameUser, getContentType } = require('@adiwajshing/baileys')
const fs = require('fs')
const util = require('util')
const chalk = require('chalk')
const { Configuration, OpenAIApi } = require("openai")
let setting = require('./accesser.json')
const BOT_NAME = process.env.BOT_NAME ?? "OpenAI";


// let conversations = [
//     {
//       role: 'system',
//       content: "You will follow the conversation and respond to the queries asked by the user's content. You will act as the assistant"
//     }
//   ];

module.exports = sansekai = async (client, m, chatUpdate, store) => {
    try {
        var body = (m.mtype === 'conversation') ? m.message.conversation : (m.mtype == 'imageMessage') ? m.message.imageMessage.caption : (m.mtype == 'videoMessage') ? m.message.videoMessage.caption : (m.mtype == 'extendedTextMessage') ? m.message.extendedTextMessage.text : (m.mtype == 'buttonsResponseMessage') ? m.message.buttonsResponseMessage.selectedButtonId : (m.mtype == 'listResponseMessage') ? m.message.listResponseMessage.singleSelectReply.selectedRowId : (m.mtype == 'templateButtonReplyMessage') ? m.message.templateButtonReplyMessage.selectedId : (m.mtype === 'messageContextInfo') ? (m.message.buttonsResponseMessage?.selectedButtonId || m.message.listResponseMessage?.singleSelectReply.selectedRowId || m.text) : ''
        var budy = (typeof m.text == 'string' ? m.text : '')
        // var prefix = /^[\\/!#.]/gi.test(body) ? body.match(/^[\\/!#.]/gi) : "/"
        var prefix = /^[\\/!#.]/gi.test(body) ? body.match(/^[\\/!#.]/gi) : "/"
        const isCmd2 = body.startsWith(prefix)
        const command = body.replace(prefix, '').trim().split(/ +/).shift().toLowerCase()
        const args = body.trim().split(/ +/).slice(1)
        const pushname = m.pushName || "No Name"
        const botNumber = await client.decodeJid(client.user.id)
        const itsMe = m.sender == botNumber ? true : false
        let text = q = args.join(" ")
        const arg = budy.trim().substring(budy.indexOf(' ') + 1)
        const arg1 = arg.trim().substring(arg.indexOf(' ') + 1)

        const from = m.chat
        const reply = m.reply
        const sender = m.sender
        const mek = chatUpdate.messages[0]

        const color = (text, color) => {
            return !color ? chalk.green(text) : chalk.keyword(color)(text)
        }

        // Group
        const groupMetadata = m.isGroup ? await client.groupMetadata(m.chat).catch(e => { }) : ''
        const groupName = m.isGroup ? groupMetadata.subject : ''

        // Push Message To Console
        let argsLog = (budy.length > 30) ? `${q.substring(0, 30)}...` : budy

        if (setting.autoAI) {
            // Push Message To Console && Auto Read
            if (argsLog && !m.isGroup) {
                // client.sendReadReceipt(m.chat, m.sender, [m.key.id])
                console.log(chalk.black(chalk.bgWhite('[ LOGS ]')), color(argsLog, 'turquoise'), chalk.magenta('From'), chalk.green(pushname), chalk.yellow(`[ ${m.sender.replace('@s.whatsapp.net', '')} ]`))
            } else if (argsLog && m.isGroup) {
                // client.sendReadReceipt(m.chat, m.sender, [m.key.id])
                console.log(chalk.black(chalk.bgWhite('[ LOGS ]')), color(argsLog, 'turquoise'), chalk.magenta('From'), chalk.green(pushname), chalk.yellow(`[ ${m.sender.replace('@s.whatsapp.net', '')} ]`), chalk.blueBright('IN'), chalk.green(groupName))
            }
        } else if (!setting.autoAI) {
            if (isCmd2 && !m.isGroup) {
                console.log(chalk.black(chalk.bgWhite('[ LOGS ]')), color(argsLog, 'turquoise'), chalk.magenta('From'), chalk.green(pushname), chalk.yellow(`[ ${m.sender.replace('@s.whatsapp.net', '')} ]`))
            } else if (isCmd2 && m.isGroup) {
                console.log(chalk.black(chalk.bgWhite('[ LOGS ]')), color(argsLog, 'turquoise'), chalk.magenta('From'), chalk.green(pushname), chalk.yellow(`[ ${m.sender.replace('@s.whatsapp.net', '')} ]`), chalk.blueBright('IN'), chalk.green(groupName))
            }
        }

 
        if (setting.autoAI) {
            if (budy) {
                try {
                    if (setting.keyopenai === 'ISI_APIKEY_OPENAI_DISINI') return reply('Apikey belum diisi\n\nSilahkan isi terlebih dahulu apikeynya di file key.json\n\nApikeynya bisa dibuat di website: https://beta.openai.com/account/api-keys')
                    const configuration = new Configuration({
                        apiKey: setting.keyopenai,
                    });
                    const openai = new OpenAIApi(configuration);

                    let prompt_template =
                        "Answer the following question, specially related to UK law or HR and also use your own knowledge when necessary " +
                        BOT_NAME +
                        " developed by TaxQ&AUK.\n\nHuman: hi\n" +
                        BOT_NAME +
                        ": Hello! How can I assist you today? If you have any questions related to UK law or HR, feel free to ask.\n\nHuman: hello\n" +
                        BOT_NAME +
                        ": Hello! How can I assist you today? If you have any questions related to UK law or HR, feel free to ask.\nHuman: " +
                        budy +
                        "\n" +
                        BOT_NAME +
                        ": ";

                    // conversations.push({
                    //     role: 'user',
                    //     content: prompt_template
                    // });                        

                    if(budy == '/questions') {
                        m.reply(`Here is some inspiration!\nCommon Legal questions:\n\n1. What legal structure should I choose for my business?\n2. What are my obligations as an employer?\n3. How do I protect my intellectual property?\n4. What are my tax obligations as a business owner?\n5. How do I draft a contract or agreement?\n6. What are my obligations under health and safety laws?\n7. How do I comply with data protection laws?\n8. What are my obligations under consumer protection laws?\n9. How do I handle disputes with customers or suppliers?\n10. What are my obligations under environmental laws?\n11. How do I protect my business from liability?\n12. What are my obligations under anti-discrimination laws?\n13. How do I terminate an employees employment?\n14. What are my obligations under immigration laws?\n15. How do I comply with regulations in my industry?\n`)
                        m.reply(`Common HR questions:\n\n1. How do I recruit and hire employees?\n2. What are the legal requirements for job postings and interviews?\n3. How do I conduct background checks on potential employees?\n4. What are the legal requirements for employee contracts and offer letters?\n5. How do I onboard new employees?\n6. What are the legal requirements for employee pay and benefits?\n7. How do I manage employee performance and conduct?\n8. What are the legal requirements for employee leave and time off?\n9. How do I handle employee complaints and grievances?\n10. What are the legal requirements for employee termination?\n11. How do I conduct employee exit interviews?\n12. What are the legal requirements for employee data privacy and protection?\n13. How do I comply with health and safety regulations in the workplace?\n14. How do I handle workplace discrimination and harassment complaints?\n15. What are the legal requirements for employee training and development?\n`)
                        m.reply(`Common Biz dev questions\n\n1. How do I identify my target market?\n2. What are the most effective marketing strategies for my business?\n3. How do I develop a business plan?\n4. What are the legal requirements for starting a business?\n5. How do I obtain funding for my business?\n6. How do I develop a sales strategy?\n7. What are the most effective networking strategies for my business?\n8. How do I develop a brand identity for my business?\n9. What are the most effective pricing strategies for my products or services?\n10. How do I conduct market research for my business?\n11. How do I develop a customer service strategy?\n12. What are the most effective ways to measure business performance?\n13. How do I develop a competitive analysis for my business?\n14. How do I develop a growth strategy for my business?\n15. What are the most effective ways to build customer loyalty?\n`)
                    } else { 
                        const response = await openai.createCompletion({
                            model: "text-davinci-003", //text-davinci-003 //gpt-3.5-turbo
                            prompt: prompt_template,
                            // messages: conversations,
                            temperature: 0.9,
                            max_tokens: 3000,
                            top_p: 1,
                            frequency_penalty: 0.0,
                            presence_penalty: 0.6,
                        });
                        
                        // conversations.push({
                        //     role: 'assistant',
                        //     content: response.data.choices[0].text
                        // });
                        
                        m.reply(`${response.data.choices[0].text}\n\n`);  
                    }    

                } catch (err) {
                    console.log(err.message)
                    m.reply("I am getting API Update right now. Please hold on, I'll be back in a while.")
                }
            }
        }

        if (!setting.autoAI) {
            if (isCmd2) {
                switch (command) {
                    case 'ai':
                        try {
                            if (setting.keyopenai === 'ISI_APIKEY_OPENAI_DISINI') return reply('Api key has not been filled in\n\nPlease fill in the apikey first in the key.json file\n\nThe apikey can be created in website: https://beta.openai.com/account/api-keys')
                            if (!text) return reply(`Chat dengan AI.\n\nContoh:\n${prefix}${command} Apa itu resesi`)
                            const configuration = new Configuration({
                                apiKey: setting.keyopenai,
                            });
                            const openai = new OpenAIApi(configuration);

                            const response = await openai.createCompletion({
                                model: "text-davinci-003",
                                prompt: text,
                                temperature: 0.3,
                                max_tokens: 3000,
                                top_p: 1.0,
                                frequency_penalty: 0.0,
                                presence_penalty: 0.0,
                            });
                            m.reply(`${response.data.choices[0].text}\n\n`)
                        } catch (err) {
                            console.log(err)
                            m.reply('Maaf, sepertinya ada yang error')
                        }
                        break
                    default: {

                        if (isCmd2 && budy.toLowerCase() != undefined) {
                            if (m.chat.endsWith('broadcast')) return
                            if (m.isBaileys) return
                            if (!(budy.toLowerCase())) return
                            if (argsLog || isCmd2 && !m.isGroup) {
                                // client.sendReadReceipt(m.chat, m.sender, [m.key.id])
                                console.log(chalk.black(chalk.bgRed('[ ERROR ]')), color('command', 'turquoise'), color(argsLog, 'turquoise'), color('tidak tersedia', 'turquoise'))
                            } else if (argsLog || isCmd2 && m.isGroup) {
                                // client.sendReadReceipt(m.chat, m.sender, [m.key.id])
                                console.log(chalk.black(chalk.bgRed('[ ERROR ]')), color('command', 'turquoise'), color(argsLog, 'turquoise'), color('tidak tersedia', 'turquoise'))
                            }
                        }
                    }
                }
            }
        }

    } catch (err) {
        m.reply(util.format(err))
    }
}


let file = require.resolve(__filename)
fs.watchFile(file, () => {
    fs.unwatchFile(file)
    console.log(chalk.redBright(`Update ${__filename}`))
    delete require.cache[file]
    require(file)
})
