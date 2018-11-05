class Slide{
    constructor(options){
        let defaultOptions = {
            slideSpeed: 2000,
            isAutoPlay: true,
            hasControlStartAndStop: true,
            hasControlPreviousAndNext: true
        }
        this.options = Object.assign(defaultOptions, options)
        this.init()
    }
    init(){
        this.currentIndex = 0
        this.timer = undefined
        this.events = [
            {isAgree:this.options.isAutoPlay&&this.options.hasControlStartAndStop,eveElement:'.slideWindow', eveType:'mouseenter', eveHandle:'stopPlay'},
            {isAgree:this.options.isAutoPlay&&this.options.hasControlStartAndStop,eveElement:'.slideWindow', eveType:'mouseleave', eveHandle:'autoPlay'},
            {isAgree:this.options.hasControlPreviousAndNext,eveElement:'.previousButton', eveType:'click', eveHandle:'goForward'},
            {isAgree:this.options.hasControlPreviousAndNext,eveElement:'.nextButton', eveType:'click', eveHandle:'goBack'}
        ]
        /******************* 调用相关的函数**********************************/
        this.insertHTML()                //构建HTML
        this.bindEvents()
        this.judgeCurrentIndex()        //currentIndex超界处理
        this.slideOne()                 //只移动一张
        this.stopPlay()                 
        this.autoPlay()
        this.goForward()
        this.goBack()
        
    }
    insertHTML(){
        /******************* 添加轮播图的外框**********************************/
        this.slideWindow_wrapper = document.querySelector(this.options.element)
        this.slideWindow = document.createElement('div')
        this.slideWindow.classList.add('slideWindow')
        this.slideWindow_wrapper.appendChild(this.slideWindow)

        /******************* 添加轮播的图片 和 添加底部原型按钮 **********************************/
        this.slideWrapper = document.createElement('ol')
        this.slideWrapper.classList.add('slideWrapper')

        this.chooseBtnWrapper = document.createElement('ol')
        this.chooseBtnWrapper.classList.add('chooseBtnWrapper')

        this.options.imgSrc.forEach((item, index)=>{
            // 添加轮播的图片
            this.slideLi = document.createElement('li')
            this.slideImg = document.createElement('img')
            this.slideImg.setAttribute('src',`${item}`)
            this.slideLi.appendChild(this.slideImg)
            this.slideWrapper.appendChild(this.slideLi)

            // 添加底部原型按钮 
            this.chooseBtnLi = document.createElement('li')
            this.chooseBtnLi.setAttribute('data-key', `${index}`)
            this.circleBtn = document.createElement('div')
            this.chooseBtnLi.appendChild(this.circleBtn)
            this.chooseBtnWrapper.appendChild(this.chooseBtnLi)
        })
        this.slideWindow.appendChild(this.slideWrapper)
        this.slideWindow_wrapper.appendChild(this.chooseBtnWrapper)

        /******************* 添加‘前一张’和‘后一张’按钮**********************************/
        this.previousButton = document.createElement('div')
        this.previousButton.classList.add('previousButton')
        this.previousButton.innerHTML = '<svg class="icon" aria-hidden="true"><use xlink:href="#icon-qianyiye"></use></svg>'

        this.nextButton = document.createElement('div')
        this.nextButton.classList.add('nextButton')
        this.nextButton.innerHTML = '<svg class="icon" aria-hidden="true"><use xlink:href="#icon-houyiye"></use></svg>'

        this.slideWindow.appendChild(this.previousButton)
        this.slideWindow.appendChild(this.nextButton)

        /******************* 用图片的宽高去设置窗口的宽高**********************************/
        this.slideImg = this.slideWindow.querySelectorAll('ol.slideWrapper>li>img')
        this.slideImgWidth = getComputedStyle(this.slideImg[0], null).width
        this.slideImgHeight = getComputedStyle(this.slideImg[0],null).height
        this.slideWindow.style.cssText = `width:${this.slideImgWidth}; height:${this.slideImgHeight}`
    }
    bindEvents(){
        this.events.forEach((item)=>{
            if(item.isAgree){
                document.querySelector(item.eveElement).addEventListener(item.eveType, this[item.eveHandle].bind(this))
            }  
        })

        this.slideWindow.querySelector('.previousButton').addEventListener('mouseover', (ev)=>{
            ev.currentTarget.classList.add('active')
        })
        this.slideWindow.querySelector('.previousButton').addEventListener('mouseout', (ev)=>{
            ev.currentTarget.classList.remove('active')
        })
        this.slideWindow.querySelector('.nextButton').addEventListener('mouseover', (ev)=>{
            ev.currentTarget.classList.add('active')
        })
        this.slideWindow.querySelector('.nextButton').addEventListener('mouseout', (ev)=>{
            ev.currentTarget.classList.remove('active')
        })

        this.chooseBtnWrapper.addEventListener('click', (ev)=>{
            let target = ev.target
            while(target !== this.chooseBtnWrapper){
                if(target.tagName.toLowerCase() === 'li'){
                    let key = target.getAttribute('data-key')-0
                    this.chooseBtnHighLight(key)
                    this.slideWrapper.style.transform = `translateX(${-key * ( this.slideImgWidth.slice(0,3)-0 )}px)`
                    break
                }
                target = target.parentNode
            }
        })

    }
    judgeCurrentIndex(){
        this.slideImgAmount = this.slideImg.length
        if(this.currentIndex >= this.slideImgAmount){
            this.currentIndex = 0
        }else if(this.currentIndex < 0){
            this.currentIndex = this.slideImgAmount-1
        }
        return this.currentIndex
    }
    slideOne(){
        this.judgeCurrentIndex()
        this.chooseBtnHighLight(this.currentIndex)
        this.slideWrapper.style.transform = `translateX(${-this.currentIndex * ( this.slideImgWidth.slice(0,3)-0 )}px)`
    }
    stopPlay(){
        window.clearInterval(this.timer)                
    }
    autoPlay(){
        if(this.options.isAutoPlay){
            this.timer = setInterval(()=>{
                this.currentIndex += 1
                this.slideOne()
            }, this.options.slideSpeed)
        }
    }
    goForward(){
        this.currentIndex -=1
        this.slideOne()
        this.chooseBtnHighLight(this.currentIndex)

    }
    goBack(){
        this.currentIndex +=1
        this.slideOne()
        this.chooseBtnHighLight(this.currentIndex)
    }
    chooseBtnHighLight(key){
        Array.from(this.chooseBtnWrapper.querySelectorAll('li')).map((item, index)=>{
            item.classList.remove('active')
            if(key === index){
                return item.classList.add('active')
            }
        })

    }
}