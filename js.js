const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const cd = $('.cd')
const header = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const btnPlay = $('.btn-toggle-play')
const player = $('.player')
const progress = $('#progress')
const btnNext = $('.btn-next')
const btnPrev = $('.btn-prev')
const btnRepeat = $('.btn-repeat')
const btnRandom = $('.btn-random')
const playList = $('.playlist')
const volumn = $('#volumn-control')
const volumnIcon = $('.volumn-thumb')

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRepeat: false,
    isRandom: false,
    isMuted: false,
    song:[
        {
            name:'Another You',
            singer:'Armin van Buuren feat. Mr. Probz',
            path:'./music/Armin van Buuren feat. Mr. Probz - Another You (Official Music Video).mp3',
            image:'./img/maxresdefault.jpg'
        },
        {
            name:'Alone',
            singer:'Marshmello',
            path:'./music/Marshmello - Alone.mp3',
            image:'./img/alone.jpg'
        },
        {
            name:'Outside',
            singer:'Calvin Harris - Ellie Goulding',
            path:'./music/Calvin Harris - Outside (Official Video) ft. Ellie Goulding.mp3',
            image:'./img/outside.jpg'
        },
        {
            name:'Feather',
            singer:'Lost Kings - Finn Askeww',
            path:'./music/Lost Kings - Feather (Audio) ft. Finn Askew.mp3',
            image:'./img/feather.jpg'
        },
        {
            name:'Soap',
            singer:'Melanie Martinez',
            path:'./music/Melanie Martinez - Soap.mp3',
            image:'./img/soap.jpg'
        },
        {
            name:'Candy paint',
            singer:'Post Malone',
            path:'./music/Post Malone - Candy Paint.mp3',
            image:'./img/candypaint.jpg'
        },
        {
            name:'Goodbyes',
            singer:'Post Malone - Goodbyes (Bunny Remix) ft. Young Thug',
            path:'./music/Post Malone - Goodbyes (Bunny Remix) ft. Young Thug.mp3',
            image:'./img/goodbyes-remix.jpg'
        },
        {
            name:'Superstar',
            singer:'SUPER STAR - G-DRAGON',
            path:'./music/SUPER STAR - G-DRAGON.mp3',
            image:'./img/superstar.jpg'
        },
        {
            name:'I Love It When You Cry',
            singer:'Steve Aoki & Moxie',
            path:'./music/I Love It When You Cry (Official Audio) - Steve Aoki & Moxie.mp3',
            image:'./img/iloveitwhenyoucry.jpg'
        }

    ],

    Render: function(){
        const htmls = this.song.map((song, index) =>{
            return `
            <div class="song ${index === this.currentIndex ? '  active' : ' '}" data-index= ${index}>
                <div class="thumb" style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>        
          </div>
          `
        })
        $('.playlist').innerHTML = htmls.join('')
    },

    scrollIntoView: function(){
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'end'
            });
        },300)
    },
    //load bài hát
    defineProperties: function(){
        Object.defineProperty(this, 'currentSong', {
            get: function(){
                return this.song[this.currentIndex];
            }
        })
    },

    loadCurrentSong: function(){
        header.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },
    // xữ lý xự kiện
    handleEvents: function(){
        const _this = this
        const cdWidth = cd.offsetWidth

        //phóng to/ thu nhỏ cd
        document.onscroll = function() {
            const scrollTop = window.scrollY
            const newWidth = cdWidth - scrollTop
            cd.style.width = newWidth > 0 ? newWidth + 'px' : 0 
            cd.style.opacity = newWidth / cdWidth
        }

        const cdThumbAnimate = cdThumb.animate([{transform: "rotate(360deg)"}],{
            duration: 10000,
            iterations: Infinity
        });
        cdThumbAnimate.pause()

        // volumn slider
        volumn.oninput =function(){
            let volumeElement = (volumn.value) / 100
            audio.volume = volumeElement
        }
        //click play
        btnPlay.onclick = function(){
            if(_this.isPlaying){
                audio.pause()
            }else{
                audio.play()
            }
        }

        btnNext.onclick = function(){
            if(_this.isRandom){
                _this.playRandomSong()
            }else{
                _this.nextSong()
            }
            audio.play()
            _this.Render()
            _this.scrollIntoView()
        }

        btnPrev.onclick = function() {
            if(_this.isRandom){
                _this.playRandomSong()
            }else{
                _this.prevSong()
            }
            audio.play()
            _this.Render()
            _this.scrollIntoView()
        }

        audio.onpause = function() {
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }

        audio.onplay = function() {
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()
            if(_this.isMuted){
                audio.muted = true
            }

        }
        audio.onended = function(){
            if(_this.isRepeat){
                audio.play()
            }else{
                btnNext.click()
            }
            
        }

        btnRandom.onclick = function(e) {
            _this.isRandom = !_this.isRandom
            btnRandom.classList.toggle('active', _this.isRandom)  
        }

        btnRepeat.onclick = function(e) {
            _this.isRepeat = !_this.isRepeat
            btnRepeat.classList.toggle('active', _this.isRepeat)       
        }

        audio.ontimeupdate = function() {
            if(audio.duration){
                const progressPercent = Math.floor((audio.currentTime/ audio.duration)*100 )
                progress.value = progressPercent 
            }
        }
        progress.onchange = function(e) {
            const seekTime = (e.target.value * audio.duration) / 100
            audio.currentTime = seekTime
        }

        playList.onclick = function(e){
            const songNode = e.target.closest('.song:not(.active)');
            if(songNode || e.target.closest('.option')){
                if(songNode){
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong()
                    _this.Render()
                    audio.play()
                }
            }
        }

        volumnIcon.onclick = function(){
            _this.isMuted = !_this.isMuted
            volumnIcon.classList.toggle('playing', _this.isMuted)
            console.log(_this.isMuted)
        }


    },

    playRandomSong: function(){
        let newIndex
        do{
            newIndex = Math.floor(Math.random() * this.song.length)
        }while(newIndex === this.currentIndex)

        this.currentIndex = newIndex
        this.loadCurrentSong()
    },
    nextSong: function(){
        this.currentIndex++;
        if(this.currentIndex >= this.song.length){
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },

    prevSong: function(){
        this.currentIndex--;
        if(this.currentIndex < 0){
            this.currentIndex = this.song.length -1
        }
        this.loadCurrentSong()
    },

    start: function(){
        this.defineProperties()

        this.loadCurrentSong()
        this.handleEvents()
        this.Render()
    },

}
app.start()