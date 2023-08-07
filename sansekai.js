const { BufferJSON, WA_DEFAULT_EPHEMERAL, generateWAMessageFromContent, proto, generateWAMessageContent, generateWAMessage, prepareWAMessageMedia, areJidsSameUser, getContentType } = require('@adiwajshing/baileys')
const fs = require('fs')
require('dotenv').config()
const util = require('util')
const chalk = require('chalk')
const { Configuration, OpenAIApi } = require("openai") 
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

        if (process.env.autoAI) {
            // Push Message To Console && Auto Read
            if (argsLog && !m.isGroup) {
                // client.sendReadReceipt(m.chat, m.sender, [m.key.id])
                console.log(chalk.black(chalk.bgWhite('[ LOGS ]')), color(argsLog, 'turquoise'), chalk.magenta('From'), chalk.green(pushname), chalk.yellow(`[ ${m.sender.replace('@s.whatsapp.net', '')} ]`))
            } else if (argsLog && m.isGroup) {
                // client.sendReadReceipt(m.chat, m.sender, [m.key.id])
                console.log(chalk.black(chalk.bgWhite('[ LOGS ]')), color(argsLog, 'turquoise'), chalk.magenta('From'), chalk.green(pushname), chalk.yellow(`[ ${m.sender.replace('@s.whatsapp.net', '')} ]`), chalk.blueBright('IN'), chalk.green(groupName))
            }
        } else if (!process.env.autoAI) {
            if (isCmd2 && !m.isGroup) {
                console.log(chalk.black(chalk.bgWhite('[ LOGS ]')), color(argsLog, 'turquoise'), chalk.magenta('From'), chalk.green(pushname), chalk.yellow(`[ ${m.sender.replace('@s.whatsapp.net', '')} ]`))
            } else if (isCmd2 && m.isGroup) {
                console.log(chalk.black(chalk.bgWhite('[ LOGS ]')), color(argsLog, 'turquoise'), chalk.magenta('From'), chalk.green(pushname), chalk.yellow(`[ ${m.sender.replace('@s.whatsapp.net', '')} ]`), chalk.blueBright('IN'), chalk.green(groupName))
            }
        }

 
        if (process.env.autoAI) {
            if (budy) {
                try {
                    if (process.env.keyopenai === 'ISI_APIKEY_OPENAI_DISINI') return reply('Apikey belum diisi\n\nSilahkan isi terlebih dahulu apikeynya di file key.json\n\nApikeynya bisa dibuat di website: https://beta.openai.com/account/api-keys')
                    const configuration = new Configuration({
                        apiKey: process.env.keyopenai,
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

                    if(budy.toLowerCase() == 'hello') {
                        m.reply(`Welcome to TaxQ&A-UK Bot! Your Business Solution Hub. Whether you need guidance on UK Tax and Accounting, UK Law, UK Human Resources, IT, marketing, or any other business-related topic, I’ve got you covered. Please select a topic from the options below or simply ask your question.\n`)
                        m.reply(`If you would like assistance on a specific topic, simply type in the corresponding keyword. For example, type in */Tax and Accounting* for examples on how I can assist on subject of UK Tax and Accounting.\n\n*Topic options:*\n• UK Tax and Accounting-   */Tax and Accounting*\n• UK Law-   */Law*\n• UK Human Resources (HR)-   */HR*\n• Information Technology (IT)-   */IT*\n• Marketing and Advertising-   */Marketing*\n• Business Strategy-   */Business Strategy*\n\nAlternatively, if you have a specific business question, feel free to ask, and I'll do my best to provide helpful insights.`) 
                    } else if(budy.toLowerCase() == "/tax and accounting") {
                        m.reply(`Of course, I can provide a few examples of how I can assist:\n\n• *Tax Deductions:* I can provide information on common tax deductions that businesses in the UK can claim, such as expenses related to office supplies, travel, and professional services.\n• *VAT Registration:* I can guide businesses through the process of registering for Value Added Tax (VAT) in the UK, including the eligibility criteria and steps involved.\n• *Corporation Tax:* I can provide insights on how to calculate and pay corporation tax, including the applicable rates, allowances, and methods of filing returns.\n• *Payroll Taxes:* I can offer guidance on payroll taxes, including information on PAYE (Pay As You Earn) and National Insurance contributions, helping businesses understand their obligations and calculate payroll accurately.\n• *Financial Statements:* I can provide insights on preparing financial statements, such as profit and loss statements and balance sheets, helping businesses understand the key components and their importance for financial reporting.`);
                    } else if(budy.toLowerCase() == "/law") {
                        m.reply(`Of course, I can provide a few examples of how I can assist:\n\n• *Contract Law:* I can provide guidance on drafting, reviewing, and interpreting contracts, helping businesses understand key terms, legal implications, and best practices to ensure their contracts are legally sound.\n• *Employment Law:* I can offer information on employment laws in the UK, including topics such as employee rights, discrimination, termination, and health and safety regulations, helping businesses navigate the legal aspects of managing their workforce.\n• *Intellectual Property:* I can provide insights on intellectual property laws, including trademarks, copyrights, and patents, helping businesses understand how to protect their intellectual property assets and avoid infringement.\n• *Company Formation:* I can guide businesses through the process of setting up a company in the UK, including legal requirements, registration procedures, and compliance with company law regulations.\n • *Data Protection and Privacy:* I can offer information on data protection laws, including the General Data Protection Regulation (GDPR), helping businesses understand their obligations regarding data handling, consent, and privacy rights of individuals.`);
                    } else if(budy.toLowerCase() == "/hr") {
                        m.reply(`Of course, I can provide a few examples of how I can assist:\n\n• *Employment Contracts:* I can provide guidance on creating employment contracts, including key elements to include, legal requirements, and best practices for different types of employment agreements.\n• *Recruitment and Hiring:* I can offer insights on effective recruitment strategies, interview techniques, and tips for attracting and selecting the right candidates for job positions.\n• *Employee Policies and Procedures:* I can assist in developing HR policies and procedures tailored to your business needs, covering areas such as attendance, leave, disciplinary actions, and employee code of conduct.\n• *Employee Benefits:* I can provide information on common employee benefits, such as pensions, health insurance, and other perks, including legal requirements and considerations for offering competitive benefit packages.\n• *Performance Management:* I can guide you through performance management processes, including setting performance goals, conducting performance reviews, and implementing effective performance improvement plans.`)
                    } else if(budy.toLowerCase() == "/it") {
                        m.reply(`Of course, I can provide a few examples of how I can assist:\n\n• *Technical Support:* I can provide troubleshooting assistance and guidance on resolving common IT issues, such as software errors, connectivity problems, or hardware malfunctions.\n• *Cybersecurity:* I can offer insights on best practices for ensuring cybersecurity within your business, including tips for protecting sensitive data, preventing cyber threats, and implementing secure IT infrastructure.\n• *Software Recommendations:* I can provide recommendations on software solutions that can enhance productivity and efficiency in various areas of your business, such as project management tools, customer relationship management (CRM) systems, or accounting software.\n• *IT Infrastructure Setup:* I can provide guidance on setting up IT infrastructure for your business, including network configuration, hardware recommendations, and best practices for data storage and backup.\n• *Cloud Computing:* I can offer information on the benefits and considerations of adopting cloud computing solutions, including cloud storage, software as a service (SaaS), and cloud-based collaboration tools.`)
                    } else if(budy.toLowerCase() == "/marketing") {
                        m.reply(`Of course, I can provide a few examples of how I can assist:\n\n• *Digital Marketing Strategies:* I can provide insights and recommendations on various digital marketing strategies, including search engine optimization (SEO), social media marketing, content marketing, email marketing, and online advertising.\n• *Target Audience Analysis:* I can help businesses understand their target audience better by providing information on market research techniques, buyer personas, and customer segmentation strategies.\n• *Branding and Positioning:* I can offer guidance on developing a strong brand identity, creating compelling brand messages, and positioning your business effectively in the market.\n• *Marketing Campaign Planning:* I can assist with planning and executing marketing campaigns by providing advice on campaign objectives, message development, channel selection, and performance tracking.\n• *Lead Generation and Conversion:* I can provide tips and strategies for generating leads, nurturing them through the sales funnel, and optimizing conversion rates through effective landing page design, call-to-action optimization, and lead nurturing techniques.`)
                    } else if(budy.toLowerCase() == "/business strategy") {
                        m.reply(`Of course, I can provide a few examples of how I can assist:\n\n• *Market Analysis:* I can provide insights on conducting market research, analysing industry trends, and identifying target markets to help businesses make informed decisions about their market positioning and competitive advantage.\n• *Strategic Planning:* I can offer guidance on developing a strategic plan, including setting business objectives, defining key strategies, and outlining action plans to achieve long-term goals.\n• *SWOT Analysis:* I can help businesses conduct a SWOT analysis (Strengths, Weaknesses, Opportunities, and Threats) to assess their internal capabilities and external market factors, allowing them to identify areas of improvement and leverage opportunities.\n• *Competitive Analysis:* I can assist in analysing the competitive landscape, evaluating competitors' strengths and weaknesses, and identifying opportunities for differentiation and competitive advantage.\n• *Growth Strategies:* I can provide insights on various growth strategies, such as market expansion, product diversification, strategic partnerships, and mergers and acquisitions, helping businesses explore avenues for sustainable growth.`)
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

        if (!process.env.autoAI) {
            if (isCmd2) {
                switch (command) {
                    case 'ai':
                        try {
                            if (process.env.keyopenai === 'ISI_APIKEY_OPENAI_DISINI') return reply('Api key has not been filled in\n\nPlease fill in the apikey first in the key.json file\n\nThe apikey can be created in website: https://beta.openai.com/account/api-keys')
                            if (!text) return reply(`Chat dengan AI.\n\nContoh:\n${prefix}${command} Apa itu resesi`)
                            const configuration = new Configuration({
                                apiKey: process.env.keyopenai,
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
                            m.reply("I am getting API Update right now. Please hold on, I'll be back in a while.")
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
