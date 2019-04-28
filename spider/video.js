import puppeteer from 'puppeteer'
import {sleep} from '../util/index.js'

const doubanId = '2244426'
const url = `https://movie.douban.com/subject/${doubanId}/`

;(async() => {
    const browser = await puppeteer.launch({
        args: ['--no-sandbox'],
        dumpio: false
    })

    const page = await browser.newPage()
    await page.goto(url, {
        waitUntil: 'networkidle2'
    })
    await sleep(1000)

    const result = await page.evaluate(() => {
        const $ = window.$
        const it = $('.related-pic-video').eq(0)
        if (it && it.length > 0) {
            const link = it.attr('href')
            const cover = it.css('backgroundImage').replace('url("', '').replace('")', '')
            return {
                link,
                cover
            }
        }
        return {}
    })

    let video

    if (result.link) {
        await page.goto(result.link, {
            waitUntil: 'networkidle2'
        })
        await sleep(1000)

        video = await page.evaluate(() => {
            const $ = window.$
            const it = $('source')
            if (it && it.length > 0) {
                return it.attr('src')
            }

            return ''
        })
    }

    const data = {
        video,
        doubanId,
        cover: result.cover
    }

    browser.close()
    
    process.send(data)
    process.exit(0)
})()