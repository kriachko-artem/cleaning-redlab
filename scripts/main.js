const locationButton = document.querySelector('.nav-location');
const featuresBlock = document.querySelector('.features-list');
const clean = document.querySelector('.how-clean_content');
const cleanHolder = document.querySelector('.images');
const menuBlock = document.querySelector('.how-clean-menu');
const menuListItems = document.querySelectorAll('.menu-list li');
const menuImages = document.querySelectorAll('.how-clean-image-holder');
const orderButton = document.querySelector('.order');
const marks = document.querySelectorAll('.how-clean-marks .mark')
const posterAndMenu = document.querySelector('.how-clean-poster_and_menu');
const burger = document.querySelector('.burger');
const navlinks = document.querySelector('.nav-links');
const anchor = document.querySelector('#anchor');

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

scrollShow(featuresBlock)
scrollShow(clean)


const orderButtonParams = {
    translateX: 0,
    translateY: 0,
    fromCenterX:0,
    fromCenterY: 0,
};
//Параметры меню
const menuParams = {
    active: menuListItems[0],
    dataName: menuListItems[0].dataset.name,
    showedImage: null,
    setActive: function (elem){  //При клике обновляются параметры и воспроизводится анимация
        this.active.classList.remove('active')
        elem.classList.add('active')
        this.active = elem
        this.dataName = elem.dataset.name
        menuImages.forEach(item=>{
            item.classList.contains('hidden')?item.style.zIndex = '0':item.style.zIndex = '1';
            if(item.dataset.name === elem.dataset.name){
                item.classList.add('active')
                menuParams.showedImage = item
                
                gsap.to(item.children[1].children,{
                    opacity: 1,
                    stagger: 0.2,
                })
            } else {
                item.classList.remove('active')
                gsap.to(item.children[1].children,{
                    opacity: 0,
                })
            }
        })
    }
};

//Анимация меню "Как мы убираем"
const tl = gsap.timeline({
    scrollTrigger: {
        trigger: cleanHolder,
        start: `top ${window.innerWidth>425?60+'%':80+'%'}`,
        toggleActions: "play none none reverse",
    }});
tl.to('.how-clean_description', {
    translateY: `${window.innerWidth>425?-100+'%': 0}`,
    duration: 1.5,
}).addLabel("start", "0")
if (window.innerWidth>425){
    tl.to(cleanHolder, {
        translateX: 0,
        bottom: 0,
        right: 0,
        duration: 1.5,
        onStart: ()=>{
            gsap.to(window, {duration: 1.5, scrollTo: {y: '#anchor'}});
        },
    }, 'start')
}
tl.to(menuBlock,{
    translateX: 0,
    duration:1.5,
}, 'start')
tl.to(menuImages[0].children[1].children,{
    opacity: 1,
    stagger: 0.2,
})

gsap.to(orderButton.children[0],{
    rotate: 360,
    transformOrigin: 'center center',
    duration: 15,
    repeat: -1,
    ease: 'linear',
})

//Расставляем метки по координатам, указанным в html
marks.forEach(item=>{
    const coordinates = item.dataset.coordinates.split(' ');
    item.style.left = coordinates[0]+'%'
    item.style.top = coordinates[1]+'%'
})
//Наезд картинок про ховере на выбранный элемент списка
menuListItems.forEach(item=>{
    item.addEventListener('mouseenter',()=>{
        menuImages.forEach(image=>{
            if ((image.dataset.name===item.dataset.name)){
                image.style.zIndex = '2';
                image.classList.replace('hidden','showed')
                item.addEventListener('mouseout',()=>{
                    image.classList.replace('showed','hidden')
                })
                menuParams.showedImage = image
            }
        })
    })
    //При клике ставим как активную картинку
    item.addEventListener('click',(event)=>{
        menuParams.setActive(event.target)
        if (window.innerWidth<=425){
            gsap.fromTo(menuParams.showedImage,{
                translateX: 100+'%'
            },{
              translateX: 0,
            })
        }
    })
})
//Меняем значиние локации
locationButton.addEventListener('click',()=>{
    Array.from(locationButton.children).forEach(item=>{
        item.classList.toggle('checked')
    })
})
//Прилепание кнопки к курсору
orderButton.addEventListener('mouseenter',function (event){
    orderButtonParams.fromCenterX = -(orderButton.clientWidth/2)
    orderButtonParams.fromCenterY = -(orderButton.clientHeight/2)

    moveOrderButton(event)
    orderButton.addEventListener('mousemove',moveOrderButton)
})
orderButton.addEventListener('touch',(event)=>{
    orderButtonParams.fromCenterX = -(orderButton.clientWidth/2)
    orderButtonParams.fromCenterY = -(orderButton.clientHeight/2)
    moveOrderButton(event)
})
//Отлипание кнопки от курсора
orderButton.addEventListener('mouseleave',()=>{
    orderButton.removeEventListener('mousemove',moveOrderButton)
    gsap.to(orderButton,{
        bottom: pageYOffset ? 0 - orderButton.clientHeight / 2 : 20,
        translateX: 'unset',
        translateY: 'unset',
        duration: 1,
        ease: "elastic.out(1, 0.3)",
    })
    hideOrderButton()
})
window.addEventListener('scroll',hideOrderButton)


//Открыть navlinks
burger.addEventListener('click',()=>{
        if (burger.classList.contains('closed')){
            burger.classList.replace('closed','opened')
            navlinks.style.display = 'flex'
            gsap.fromTo(navlinks,{scaleY:0},{scaleY: 1})
            gsap.fromTo(navlinks.children,{
                translateY: -50,
                opacity: 0,
            }, {
                translateY: 0,
                opacity: 1,
                stagger: 0.1,
            })
        } else {burger.classList.replace('opened','closed')
            gsap.fromTo(navlinks.children,{
                translateY: 0,
                opacity: 1,
            }, {
                translateY: -50,
                opacity: 0,
                stagger: 0.1,
            })
            gsap.fromTo(navlinks,{scaleY:1},{scaleY: 0,
                onComplete: ()=>{navlinks.style.display = 'none'}
            })
        }
    })



//Плавное всплытие элементов при доскролле
function scrollShow(elem){
    gsap.fromTo(elem.children,
        {translateY: 100},
        {
            translateY: 0,
            duration: 1,
            stagger: 0.2,
            scrollTrigger: elem
        })
}
//Прилепание кнопки "Заказать"
function moveOrderButton(event){
    gsap.to(orderButton,{
        bottom: 20,
        translateX: orderButtonParams.fromCenterX + event.offsetX,
        translateY: orderButtonParams.fromCenterY + event.offsetY,
        duration: 1,
        ease: "power4.out",
    })
}
//Поведение кнопки "Заказать" при скролле
function hideOrderButton(){
    gsap.to(orderButton, {
        bottom: ()=> {
            if (
                (posterAndMenu.offsetTop-pageYOffset<posterAndMenu.clientHeight)||
                (posterAndMenu.offsetTop-pageYOffset<posterAndMenu.clientHeight+100)||
                (posterAndMenu.offsetTop-pageYOffset<posterAndMenu.clientHeight+300)
            ) {
                return -10 - orderButton.clientHeight
            } else if (pageYOffset){
                return 0 - orderButton.clientHeight / 2
            } else return 20
        },
        duration: 1,
        ease: "power4.out",
    })
}

