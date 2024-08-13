import { NextResponse } from 'next/server'
import puppeteer from 'puppeteer-core'

export async function GET() {
  try {
    const browser = await puppeteer.connect({
      browserWSEndpoint: `wss://connect.browserbase.com?apiKey=${process.env.BROWSERBASE_API_KEY}`,
    })
    const page = await browser.newPage()

    console.info('Navigating to Economic Calendar...')
    await page.goto("https://www.investing.com/economic-calendar/", { waitUntil: 'networkidle0' })

    // Open date picker
    console.info('Opening date picker...')
    await page.click('#datePickerToggleBtn')

    // Select custom date range
    console.info('Selecting custom date range...')
    await page.type('#startDate', '2024-08-01')
    await page.type('#endDate', '2024-08-31')

    // Apply date filter
    console.info('Applying date filter...')
    await page.click('#applyBtn')

    // Wait for the table to update
    await page.waitForSelector('#economicCalendarData', { visible: true })

    // Select event rows
    console.info('Selecting event rows...')
    const eventRows = await page.$$('#economicCalendarData tr.js-event-item')

    console.info(`Found ${eventRows.length} event rows`)

    // Example: Print details of the first 5 events
    const eventDetails = []
    for (let i = 0; i < Math.min(5, eventRows.length); i++) {
      const row = eventRows[i]
      if (row) {
        const time = await row.$eval('td.time', el => el?.textContent?.trim() ?? '')
        const currency = await row.$eval('td.flagCur', el => el?.textContent?.trim() ?? '')
        const event = await row.$eval('td.event', el => el?.textContent?.trim() ?? '')
        
        eventDetails.push({ time, currency, event })
      }
    }

    await page.close()
    await browser.disconnect()

    return NextResponse.json({ 
      success: true, 
      message: 'Economic Calendar data fetched successfully',
      events: eventDetails
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch Economic Calendar data' }, { status: 500 })
  }
}