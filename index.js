const App = require('express')()
const Pet = require('pet-pet-gif')

App.get('/', async function(Request, Response) {
    console.log('Request')
    if (Request.query.url == null) {
        Response.send('Please provide a url')
				console.log("No url provided")
        return
    }
    var GifData
    try
    {
        GifData = await Pet(Request.query.url)
        Response.set("Content-Type", "image/gif")
				Response.set("access-control-allow-origin", "*")
        Response.status(200).send(GifData)
        console.log('Response')
    }catch
    {
        Response.send('Error')
        console.log("Error")
    }
    console.log('Done')
    
    
})

App.listen(80)