import axios from 'axios'
document.addEventListener("DOMContentLoaded", () => {
    const output = document.querySelector('.output-container')
    const button = document.querySelector('.button-primary')
    const changeBorderInputs = document.querySelectorAll('.change-border-inputs > label > input')
    const canvas = document.querySelector('.canvas')
    const ctx = canvas.getContext('2d')
    const height = 379
    const width = 569

    canvas.width = width
    canvas.height = height
    let borderColor = '#fff'
    const getImages = async event => {
        event.preventDefault()

        button.disabled = true
        const response = await axios.get('http://localhost:8000/api/messages')
        const data = response.data.data
        const imgs = []
        changeBorderInputs.forEach(radio => {
            if (radio.checked) {
                borderColor = radio.value
            }
        })
        for (let directory in data) {
            data[directory].map(async filePath => {
                console.log(filePath)
                const img = await axios.get(`http://localhost:8000/api/uploads/${directory}/${filePath}`)
                const node = await convertAndCroppImage(img.data.file)
                // const formData = new FormData()
                // formData.append('image', node)
                await axios.post(`http://localhost:8000/api/uploads/${directory}/${filePath}`, formData)
                if (node) output.appendChild(node) //for tests
            })
        }
        button.disabled = false
    }

    button.addEventListener('click', getImages)


    const convertAndCroppImage = (imgPath) => {
        return new Promise((resolve, reject) => {
            const img = new Image()
            img.src = `data:image/jpeg;base64, ${imgPath}`
            img.onload = (data) => {
                ctx.beginPath()
                ctx.rect(0, 0, width, height)
                ctx.fillStyle = borderColor
                ctx.fill()
                ctx.closePath()
                // ctx.drawImage(img, 0, 0, 300, data.target.height * (300 / data.target.width))
                let innerWidth = width
                let innerHeight = height
                let y = 0
                let x = 0
                if (data.target.width <= data.target.height) {
                    innerWidth = data.target.width * (height / data.target.height)
                    x = (width - innerWidth) / 2
                } else {
                    innerHeight = data.target.height * (width / data.target.width)
                    if (innerHeight > height) {
                        innerHeight = height
                        innerWidth = data.target.width * (height / data.target.height)
                        x = (width - innerWidth) / 2
                    } else {
                        y = (height - innerHeight) / 2
                    }
                }
                console.log(data.target.width + `>` + data.target.height)
                ctx.drawImage(img, x, y, innerWidth, innerHeight)
                const imgSrc = canvas.toDataURL()
                ctx.clearRect(0, 0, canvas.width, canvas.height)
                const renderedImg = new Image()
                renderedImg.src = imgSrc
                resolve(renderedImg)
            }
        })
    }
})
