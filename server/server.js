const fs = require('fs-extra')

// created json in frontend directory
const scrappedData = require('../telegram-analysis/channel_messages.json');

//regexp for time 00:00 - 23:59 with coma after each time
const regexpTime = /([0-1][0-9]|3[0-3]):[0-5][0-9]/g;

// const regexpTime = /(\d{2}:\d{2})/g;

const regexp = /\[(.*?)\]+/g;

// regexp to get text after word Address not including the word Address
const regexpAddress = /(?<=Address:)(.*)(?=\n)/g;

const regexpDate = /(?<=\n)(.*)(?=\n)/g;

// regexp all before coma + letters only
const regexpBeforeComa = /([a-zA-Z]+)(.+?)(?=,)/g;

const regexpAfterComa = /(?<=,)(.*)(?=")/g;


const filteredData = new Array(100).fill(0).map((i, index) => {


    const month = {
        1: 'January',
        2: 'February',
        3: 'March',
        4: 'April',
        5: 'May',
        6: 'June',
        7: 'July',
        8: 'August',
        9: 'September',
        10: 'October',
        11: 'November',
        12: 'December'
    }

    const toReplace = {
        '":': '',
        '"': '',
        '[': '',
        ']': '',
        ',': '',
        ' ': ' '
    }

    const timeReplace = {
        '"': '',
        '[': '',
        ']': ',',
        ',': ' ',
        ' ': ' '
    }


    const addresses = scrappedData[index].message.match(regexpAddress) // city,address collection

    const id = index + 1;
    let times = scrappedData[index].message.match(regexp)
    const time = JSON.stringify(times).replace(/":|\"|\[|\]|,| /g, function (matched) {
        return timeReplace[matched];
    });

    // date + time collection
    const dates = scrappedData[index].message.match(regexpDate)[1]
    // date only collection
    const date = JSON.stringify(dates).slice(1, 11).replace(/\./g, '/')

    const month1 = JSON.stringify(dates).slice(4, 6).replace(/^0+/, '')
    const newMonth = new Date(month1).getMonth() + 1
    const monthName = month[newMonth]


    const city = JSON.stringify(addresses).match(regexpBeforeComa)
    const cityString = JSON.stringify(city).replace(/":|\"|\[|\]|,| /g, function (matched) {
        return toReplace[matched];
    });


    const street = JSON.stringify(addresses).match(regexpAfterComa)
    const streetString = JSON.stringify(street).replace(/":|\"|\[|\]|,| /g, function (matched) {
        return toReplace[matched];
    });

    console.log(time)

    // if date not contains letters
    // if (numbersOnly.test(date)) {
    //     console.log('date contains only numbers')
    // } else {
    //     console.log('date contains letters')
    // }


    // hide null values in time
    if (time === null) {
        times = 'null'
    }


    return {
        id: id,
        time: time,
        month: monthName,
        date: date,
        city: cityString,
        street: streetString
        // address: new Object({
        //     city: JSON.stringify(addresses).match(regexpBeforeComa),
        //     street: JSON.stringify(addresses).match(regexpAfterComa)
        // })
    };
});

// async await to create json file with filtered data
async function createJsonFile() {
    try {
        await fs.writeJson('../frontend/src/data/filteredData.json', filteredData)
        // console.log('ненавижу регЕкспы')
    } catch (err) {
        console.error(err)
    }
}

createJsonFile()

