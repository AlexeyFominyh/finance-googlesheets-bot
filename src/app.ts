import { assert } from "console";
import { Telegraf } from "telegraf";
import { TG_BG_TOKEN } from "../token";
import { monetMgrEmail } from "../token";
import { GOOGLE_PRIVATE_KEY } from "../token";
import {GoogleSpreadsheet } from "google-spreadsheet";
const creds = require("../config/metal-segment-369010-d8556ad20550.json");
const tgToken = TG_BG_TOKEN;
assert(monetMgrEmail != null, "NO EMAIL environment variable found");
assert(GOOGLE_PRIVATE_KEY != null, "NO KEY environment variable found");
assert(tgToken != null, "NO TG_BOT_TOKEN environment variable found");

const bot = new Telegraf(tgToken!);


const doc = new GoogleSpreadsheet("1LCUjNFYpNWGf8UDWEslvFPfkv-_yfOYFT9ycOE2CWMw");
const moneyMgrEmail = process.env["monetMgrEmail"]
const moneyMgrKey = process.env["monetMgrKey"]
start();
async function start() {
    await doc.useServiceAccountAuth({

            private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC9WWyd5ThIeWLW\nqkF1gaJDoXNUHORHQFwndpT6KIZpOal1kyVp+i4aNm18gm+iAvoJwNC3z0YKebvI\n1Cp0MKx4jJSK5p78g7T8WxPASNdelOu2cRt5LENNwguRB+0WMt0ToDSAAG3PlPqr\nwmLMldVsAiWMk0a6gWYT8khLVSHz0nGo6r/CR/pzAYdC483ktERU7642ndjZzkK+\nbGU2frMZtfgN0ovTsZM1GmJddOMzJLGYBhaRD6bk5zbRCgxaWRd0ddlwxHNWhK2v\ncxcRyPJ+kB4gZjqhi94vcZuYgjGdh0aaM5SIEnplgBqv0j3CVwHNkpEr2dedvPg2\nT2FM9JbLAgMBAAECggEAScRY6HqwnquLsg3KSrkiOi7f+1j2JjwQqt8r0vmOw9fP\nCRs2bD8nTtb9eJBoZTm7p6kSp0l9A//BBNCDaZi82IoMJMEMF1xIWjgxTawTG6nw\n2rbd+SshXV3Hm8z2tLtEHa1ARs3j+gcUUW39h66n4thDQKzv1SEsX4D4YUDdZVtf\nPsujUuLTr9Em3PD7ZOZS3LBKQtyOM/SUzcpj+G2RvKKADwoGDrp6QRrAJMDGCP4l\n0liG/2s557vMcHjNHASntsKFzBSZJ4uXEnwrH6tXEgj/QNg5//5U0jbMSSnvyy8j\ns2MW5+uZH3zezej8E0skOrFrlxJNc8r1YJuE4AI+wQKBgQDqp+Z0wsaGTmmDMW+h\nrU7XQ7h2cQrUX12zbn3CG2Usahkd/LVldDd9JyuHZH7KelhH6y1lfKOQmuDfKKCP\noM0bLlW6gC+v1nz6T4wtSp/JomTLHcycPshmgnrIhIcogTDDTRsY3M6Spk+xD8hw\nLKH1v8ULXOsf9kfgsvGWGIvOaQKBgQDOkojS5NAydkhMHl6h1HnsQUWWJqTarqFm\n5rNh0wNJD2zB07rgvY+72+j8v0dnl/1Qhf/xSnapc1FCepkT6w+JnX7ERd0afWAm\nQk+dfzmdrTQsxSl+Dsby1luglZUnx+ykkHJWvaYn4udvkrmcNfsT778Z/z3sLDS1\niYinHRN9EwKBgDBC/hQPp1MiN3NDLKl9ApUlmX/KuiZ5wsTPuc+9YK6k16uiORC3\nuV3lO3+qPKWaSiPoi7quytlH8W4UZgmEUgsAGaO1D5nDrIqy56q9CWYoH0DjTRzp\nkL/8oBIzp7S99XCFoEgZyebBi+xnyZrAo0LvATDYGIfHWHsvcp6jR8XZAoGANkL5\nm+Qs6ER3wz7q/rlweWW/4Kwv+52Jmh0Zm6WxJDzgBZ4XZbeFjQQ8FEAugoDDMqaw\nT3KO7v3yp3LKyRei0jRDu0zawn2Shxo+DZIA0XFQ1j3II2vASMOT9/+y2WtDtwqW\nbkCM58dLodw501W+qUL9wNdyLZqDEfiZo8QYfW8CgYAIwRufMIKl/9jqHvuA+E2Z\nitXTlx63MWBwibnMMEYBbrSGUdYY+gxdDo6eJHXHW5Kxd5uX++0fxOvxGZQHorJ+\nBHURRMjbPPWfeTU0wndCvn5clGEHYGI4xL/h+9jBYHpV5ETcuZuX8Z2Pfkof1mZU\nyxrypMEQCElg7nGKZbYfBw==\n-----END PRIVATE KEY-----\n",
            client_email: "finance-googlesheets-tg@metal-segment-369010.iam.gserviceaccount.com",    
    })

    await doc.loadInfo()
    const sheet = doc.sheetsByIndex[0]

    bot.start((ctx) => ctx.reply('Welcome'))

    bot.on('text', async (ctx) => {

        console.info(ctx.message.text)

        const r = /(?<date>\w+)\s+(?<type>\w+)\s+(?<category>\w+)\s+(?<amount>\d+)\s+(?<description>\w+)/
            .exec(ctx.message.text)

        if (r == null) ctx.reply("Неправильный текст")
        else
            await sheet.addRow({
                date: r?.groups?.date!,
                type: r?.groups?.type!,
                category: r?.groups?.category!,
                amount: r?.groups?.amount!,
                description: r?.groups?.description!
            })
    })

    bot.launch()

    // Enable graceful stop
    process.once('SIGINT', () => bot.stop('SIGINT'))
    process.once('SIGTERM', () => bot.stop('SIGTERM'))
}


