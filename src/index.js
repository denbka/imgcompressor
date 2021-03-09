const inputFile = document.querySelector('.input-files')
const output = document.querySelector('.output-container')
const button = document.querySelector('.button-primary')
const link = document.querySelector('.link')
const canvas = document.querySelector('.canvas')
const ctx = canvas.getContext('2d')

const height = 379
const width = 569

canvas.width = width
canvas.height = height

const rootDirectoryPath = './api/output'
const getImages = async event => {
    event.preventDefault()

    button.disabled = true
    const response = await fetch('http://localhost:8000/api/messages', {})
    const { data } = await response.json()
    const imgs = []
    // imgs.push(await convertAndCroppImage('./src/assets/eX44pZphCv0.jpg'))
    for (directory in data) {
        // console.log(data[directory])
        // console.log(`${rootDirectoryPath}/${directory}`)
        data[directory].map(async filePath => {
            console.log(filePath)
            imgs.push(await convertAndCroppImage(`${rootDirectoryPath}/${directory}/${filePath}`))
        })
    }
    imgs.map(img => {
        output.appendChild(img)
    })
    button.disabled = false
}

button.addEventListener('click', getImages)


const convertAndCroppImage = (imgPath) => {
    return new Promise((resolve, reject) => {
        ctx.beginPath()
        ctx.rect(0, 0, width, height)
        ctx.fillStyle = 'blue'
        ctx.fill()
        ctx.closePath()
        const img = new Image()
        img.src = imgPath
        img.onload = (data) => {
            console.log()
            // ctx.drawImage(img, 0, 0, 300, data.target.height * (300 / data.target.width))
            let innerWidth = width
            let innerHeight = height
            let y = 0
            let x = 0
            if (data.target.width < data.target.height) {
                console.log(123)
                innerWidth = data.target.width * (height / data.target.height)
                x = (width - innerWidth) / 2
            } else {
                // innerHeight = data.target.height * (width / data.target.width)
                y = (height - innerHeight) / 2
            }
            ctx.drawImage(img, x, y, innerWidth, innerHeight)
            const imgSrc = canvas.toDataURL()
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            const renderedImg = new Image()
            renderedImg.src = imgSrc
            resolve(renderedImg)
        }
    })
}