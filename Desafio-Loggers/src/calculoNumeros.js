process.on('message', cant =>{
    const num = {}
    for(let i=0; i<cant; i++){
        const randomNum = Math.floor(Math.random()*1000)
        if (!num[randomNum]){
            num[randomNum] = 0
        }
        num[randomNum]++
    }
    process.send(num)
})

process.send('ready')