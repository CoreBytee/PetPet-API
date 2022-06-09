const App = require('express')()
const Pet = require('pet-pet-gif')
const FFmpegPath = require('ffmpeg-static');
const Spawn = require('child_process').spawn;
const { waitFor } = require("wait-for-event")
const FS = require("fs")

async function RandomString() {
	return Math.random().toString(36).slice(-8);
}

App.get('/', async function(Request, Response) {
	console.log('Request')
	if (Request.query.url == null) {
		Response.send('Please provide a url')
		console.log("No url provided")
		return
	}
	var GifData
	try {
		GifData = await Pet(Request.query.url)
		Response.set("Content-Type", "image/gif")
		Response.set("access-control-allow-origin", "*")

		const RandomName = await RandomString()
		const InputName = `./${RandomName}.gif`
		const OutputName = `./${RandomName}-new.gif`
		FS.writeFileSync(InputName, GifData)
		const Child = Spawn(
			FFmpegPath,
			[
				"-i", InputName,
				"-vcodec", "copy", OutputName
			]
		)

		await waitFor("exit", Child)

		Response.status(200).send(FS.readFileSync(OutputName))
		FS.unlinkSync(InputName)
		FS.unlinkSync(OutputName)
		console.log('Response')
	} catch (E) {
		Response.send('Error')
		console.log(E)
	}
	console.log('Done')


})

App.listen(80)