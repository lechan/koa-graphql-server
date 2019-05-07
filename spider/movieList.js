import puppeteer from 'puppeteer'
import py from 'pinyin'
import {sleep} from '../util/index.js'

const url = `https://movie.douban.com/tag/#/?sort=R&range=6,10&tags=`
const pageNumber = 1

;(async() => {
    const browser = await puppeteer.launch({
        headless: false,
        args: ['--no-sandbox'],
        dumpio: false
    })

    const page = await browser.newPage()
    await page.goto(url, {
        waitUntil: 'networkidle2'
    })
    await sleep(3000)
    await page.waitForSelector('.more')
    for (let i = 0; i < pageNumber; i++) {
        const randomNum = Math.floor(Math.random() * (10 - 3)) + 3
        await sleep(randomNum * 1000)
        await page.click('.more')
    }

    const result = await page.evaluate(() => {
        const $ = window.$
        const items = $('.list-wp a')
        const links = []
        if (items.length > 0) {
            items.each((index, i) => {
                const item = $(i)
                const doubanId = item.find('div').data('id')
                const title = item.find('.title').text()
                const pinyin = py(title, {
                    style: py.STYLE_NORMAL
                })
                const rate = item.find('.rate').text()
                const poster = item.find('.pic img').attr('src').replace('s_ratio', 'l_ratio')
                links.push({
                    doubanId,
                    title,
                    pinyin,
                    rate,
                    poster
                })
            })
        }
        return links
    })

    browser.close()
    
    process.send({result})
    process.exit(0)
})()