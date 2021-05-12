
const express = require("express");
const app = express();
const request = require('request-promise');


const cheerio = require('cheerio');

const { setIntervalAsync } = require('set-interval-async/fixed')
require("dotenv").config();

const { response } = require('express');



var cron = require('node-cron');

const mongodb = require("mongodb");

let mongoClient = mongodb.MongoClient;
let dbUrl = process.env.DB_URL;
let PORT = process.env.PORT



const cors = require('cors');
app.use(cors())



const bodyParser = require("body-parser")
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));




app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store')
    next()
  })


let obj = [{
    "store": "Amazon",
    "links": [
        "https://www.amazon.in/Redmi-Poco-Matte-Black-Storage/dp/B08KTMHBYJ",
        "https://www.amazon.in/Redmi-Sky-Blue-64GB-Storage/dp/B08697N43N",
        "https://www.amazon.in/BlackBerry-BLACKBERRY-PASSPORT-Blackberry-Passport/dp/B00NET0PVI",
        "https://www.amazon.in/Redmi-Note-Pro-Interstellar-Snapdragon/dp/B08696XB3V",
        "https://www.amazon.in/Micromax-Note-Green-64GB-Storage/dp/B08RWNQJVL",
        "https://www.amazon.in/Itel-Vision1-Gradation-Green-RAM/dp/B08NVSX4ZY",
        "https://www.amazon.in/Motorola-Plus-Misty-Blue-RAM/dp/B08L3WBQ71",
        "https://www.amazon.in/Realme-Narzo-Black-Ninja-Storage/dp/B08LHKFXNW",
        "https://www.amazon.in/Nokia-C3-Storage-Without-Offers/dp/B086KFXPGF",
        "https://www.amazon.in/Panasonic-Eluga-Black-16GB-Storage/dp/B085W2YQ1F"
    ]

},
{
    "store": "Snapdeal",
    "links": [
        "https://www.snapdeal.com/product/poco-c3-64gb-4-gb/682411450345",
        "https://www.snapdeal.com/product/redmi-9-64gb-4-gb/5764608188178805245",
        "https://www.snapdeal.com/product/blackberry-black-passport-32gb/6917529687794600048",
        "https://www.snapdeal.com/product/redmi-note-9-pro-128gb/6917529681328086912",
        "https://www.snapdeal.com/product/micromax-in-note-1-64/671836473936",
        "https://www.snapdeal.com/product/itel-vision-1-32gb-3/6917529662017356382",
        "https://www.snapdeal.com/product/motorola-e7-plus-64gb-4/655047794917",
        "https://www.snapdeal.com/product/realme-narzo-20-pro-64gb/625140726659",
        "https://www.snapdeal.com/product/nokia-c3-16gb-2-gb/6917529712727837036",
        "https://www.snapdeal.com/product/panasonic-eluga-i6-16gb-2/630386963358"
    ]
},
{
    "store": "Flipkart",
    "links": [
        "https://www.flipkart.com/poco-c3-lime-green-64-gb/p/itmac54a16ec8185",
        "https://www.flipkart.com/redmi-9-sky-blue-64-gb/p/itm4fb151383983b",
        "https://www.flipkart.com/blackberry-passport-black-32-gb/p/itme5z9cbm5zup9d",
        "https://www.flipkart.com/redmi-note-9-pro-interstellar-black-128-gb/p/itm0418537d115ba",
        "https://www.flipkart.com/micromax-note-1-green-64-gb/p/itmcc06e52610564",
        "https://www.flipkart.com/itel-vision1-gradation-green-32-gb/p/itmabec72dce88ad",
        "https://www.flipkart.com/motorola-e7-plus-misty-blue-64-gb/p/itm9a59be77f1cd2",
        "https://www.flipkart.com/realme-narzo-20-pro-black-ninja-64-gb/p/itm043c480bf22fb",
        "https://www.flipkart.com/nokia-c3-sand-16-gb/p/itmb43d7fe437dff",
        "https://www.flipkart.com/panasonic-eluga-i6-black-16-gb/p/itm876e1eeb85ac1"

    ]
}
]

let flag = 0;
let hour = 0;



const job = cron.schedule('*/1 * * *', async() => {

    try {
        console.log('flag =', flag++);
        for (j = 0; j < obj.length; j++) {

            let limit = obj[j].links
            let storeName = obj[j].store

            for (i = 0; i < limit.length; i++) {
                let product_id = i + 1;

                (async () => {

                    try {
                        const response = await request({

                            uri: obj[j].links[i],
                            headers: {

                                "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                                "accept-encoding": "gzip, deflate, br",
                                "accept-language": "en-US,en;q=0.9"
                            },
                            gzip: true

                        })
                        let $ = cheerio.load(response);

                        let title;
                        let image;
                        let finalPrice;
                        let rating;


                        if (storeName === "Snapdeal") {

                            title = $('div[class="col-xs-22"] > h1').text().trim();
                            image = $('img[slidenum="0"]').attr('src').trim();
                            finalPrice = $('span[class="pdp-final-price"] >span ').text();


                            if (finalPrice) {
                                let digit = finalPrice.length - 3
                                let arr2 = finalPrice.slice(digit, finalPrice.length)
                                let temp = finalPrice;
                                finalPrice = ""
                                for (i = 0; i < digit; i++) {
                                    finalPrice += temp[i]

                                }
                                finalPrice = finalPrice + "," + arr2
                            }

                            else {
                                finalPrice = "Not Available"
                            }




                            rating = $('div[class="filled-stars"] ').attr('style');



                            if (rating) {
                                rating = rating.slice(6, 10)
                                if (rating !== "0.0%") {
                                    rating = (rating * 5) / 100
                                    rating = rating.toString();
                                }
                                else {
                                    rating = "0"
                                }
                            }
                            else {
                                rating = "Not Available"
                            }


                        }
                        else if (storeName === "Flipkart") {


                            title = $('h1[class="yhB1nd"] > span').text().trim();
                            image = $('div[class="CXW8mj _3nMexc"] > img').attr('src');
                            finalPrice = $('div[class="_30jeq3 _16Jk6d"]').text();



                            rating = $('div[class="_3LWZlK"]').text();
                            finalPrice = finalPrice.slice(1, 10)
                            rating = rating.slice(0, 3)

                        }
                        else if (storeName === "Amazon") {


                            title = $('span[id="productTitle"]').text().trim();
                            image = $('img[id="landingImage"]').attr('src').trim();
                            finalPrice = $('span[id="priceblock_ourprice"]').text();

                            if (finalPrice === "") {
                                finalPrice = $('span[class="a-size-base a-color-price"]').text()
                            }


                            finalPrice = finalPrice.split(".")
                            finalPrice = finalPrice[0]
                            finalPrice = finalPrice.slice(1, finalPrice.length)
                            finalPrice = finalPrice.trim()





                            rating = $('span[class="a-icon-alt"]').text();
                            rating = rating.slice(0, 3)

                        }
                        loader();

                        async function loader() {
                            try {

                                let clientInfo = await mongoClient.connect(dbUrl)
                                let db = clientInfo.db("ecommerce-scrap");
                                let uniqueID = storeName + "_" + title



                                let existorNot = await db.collection("products").find({ _id: uniqueID }).toArray()
                                if (existorNot.length) {
                                    await db.collection("products").updateOne(
                                        { _id: uniqueID },
                                        {
                                            $set: {
                                                storeName,
                                                title,
                                                image,
                                                finalPrice,
                                                rating,
                                                product_id
                                            }
                                        }

                                    )

                                    console.log("updated", existorNot[0]._id);

                                }
                                else if (existorNot.length === 0) {

                                    if (title) {
                                        await db.collection("products").insertOne({
                                            _id: uniqueID,
                                            storeName,
                                            title,
                                            image,
                                            finalPrice,
                                            rating,
                                            product_id
                                        }, function (err) {
                                            if (err) throw err;
                                            console.log('inserted');
                                        })

                                    }


                                }
                                else {
                                    console.log("problem", existorNot);
                                }



                                clientInfo.close()



                            }
                            catch (error) {
                                console.log(error);
                            }

                        }

                    }
                    catch (error) {
                        console.log("error scrapping", error);
                    }

                })();
            }

        }

        updation();


    }
    catch (error) {
        console.log('error interval', error);
    }
})





async function updation() {
    let today = new Date();

    let date = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear()

    let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

    let dateTime = date + ' ' + time;
    let clientInfo = await mongoClient.connect(dbUrl)
    let db = clientInfo.db("ecommerce-scrap");

    await db.collection("updation").updateOne(
        { _id: "1" },
        {
            $set: { lastUpdate: dateTime }

        }
    )
    console.log("last updated", dateTime);

    clientInfo.close()


}

app.get("/",function(req,res){

res.send('SERVER STARTED')
})

app.get("/search", async function (req, res) {

    try {

        let query = req.query.term

        let clientInfo = await mongoClient.connect(dbUrl)
        let db = clientInfo.db("ecommerce-scrap");
        let response = await db.collection('products').aggregate([
            {

                "$search": {
                    "autocomplete": {
                        "query": query,
                        "path": "title",
                        "fuzzy": {
                            "maxEdits": 2
                        }
                    }
                }


            }

        ]).toArray()

        clientInfo.close()
        res.send(response)

    }

    catch (error) {
        console.log(error);
    }


})


app.post('/searchmobile', async function (req, res) {
    try {

        let queryMobile = req.body.searchBox
        let clientInfo = await mongoClient.connect(dbUrl)
        let db = clientInfo.db("ecommerce-scrap");

        let res1 = await db.collection('products').find({ title: queryMobile }).toArray()
        console.log(res1);

        let res2 = res1[0].product_id;

        let fres = await db.collection('products').find({ product_id: res2 }).toArray()
        clientInfo.close();
        res.send(fres)

    }

    catch (error) {
        console.log(error);
    }


})


app.get("/showAll", async function (req, res) {

    try {
        let clientInfo = await mongoClient.connect(dbUrl)
        let db = clientInfo.db("ecommerce-scrap");
        let res1 = await db.collection('products').find().sort({ product_id: -1 }).toArray();
        clientInfo.close();
        res.send(res1)

    }
    catch (error) {
        console.log(error);
    }

})


app.get('/lastUpdate', async function (req, res) {


    try {
        let clientInfo = await mongoClient.connect(dbUrl)
        let db = clientInfo.db("ecommerce-scrap");
        let res1 = await db.collection('updation').find().toArray()
        clientInfo.close();
        res.send(res1)
    }
    catch (error) {
        console.log(error);
    }
})



app.listen(process.env.PORT||3000, function () {
    console.log('server started');
})
