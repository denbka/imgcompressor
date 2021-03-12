import axios from 'axios'
document.addEventListener("DOMContentLoaded", () => {
    const output = document.querySelector('.output-container')
    const button = document.querySelector('.button-primary')
    const changeBorderInputs = document.querySelectorAll('.change-border-inputs > label > input')
    const canvas = document.querySelector('.canvas')
    const ctx = canvas.getContext('2d')
    const fileReader = document.querySelector('.filereader')
    fileReader.addEventListener('change', event => {
        console.log(event)
    })
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
        const formData = new FormData()
        changeBorderInputs.forEach(radio => {
            if (radio.checked) {
                borderColor = radio.value
            }
        })


        //чтобы асинхронный цикл стал ждать результата, нужно ставить promise.all
        const asyncRes = await Promise.all(Object.entries(data).map(async (item, key) => {
            const directory = item[0]
            const files = item[1]
            await Promise.all(files.map(async fileName => {
                const img = await axios.get(`http://localhost:8000/api/uploads/${directory}/${fileName}`)
                const file = await convertAndCroppImage(img.data.file, fileName, directory)
                formData.append('image', file)
            }))
        }))
        await axios.post(`http://localhost:8000/api/uploads`, formData)
        button.disabled = false
    }

    button.addEventListener('click', getImages)


    const convertAndCroppImage = (imgPath, fileName, directory) => {
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
                // console.log(data.target.width + `>` + data.target.height)
                ctx.drawImage(img, x, y, innerWidth, innerHeight)
                const imgSrc = canvas.toDataURL('image/jpg')
                ctx.clearRect(0, 0, canvas.width, canvas.height)
                resolve(dataURLtoFile(imgSrc,`${directory}###${fileName}`))
            }
        })
    }
})

function dataURLtoFile(dataurl, filename) {
 
    var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), 
        n = bstr.length, 
        u8arr = new Uint8Array(n);
        
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    
    return new File([u8arr], filename, {type:mime});
}
