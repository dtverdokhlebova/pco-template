document.addEventListener('DOMContentLoaded', function () {
  loader()
  inputMask()
  uiDropFile()
  uiSelects()
  awards()
  banner()
  clientsSlider()
  cursorCustom()
  formThank()
  header()
  inNumbers()
  newsList()
  objects()
  nav()
  popup()
  portfolioGallery()
  portfolio()
  team()
  pageProgress()
  projectsList()
  whoWe()
  slideTo()

  window.updInputMask = inputMask
  window.shareButtonCopy = shareButtonCopy

  window.addEventListener('load', function () {
    animation()
    locationMap()
  })
  window.addEventListener('resize', function () {
    objects()
  })
})

function loader() {
  if (document.querySelector('.loader')) {
    const tl = gsap.timeline()
    const easeText = 'Power3.easeOut'
    tl.to('body', {
      overflow: 'hidden'
    }).to('.loader .loader__text', {
      duration: 0,
      opacity: 1,
      ease: easeText
    }).from('.loader .loader__item', {
      duration: 1.5,
      delay: 1,
      y: '3em',
      skewY: 10,
      stagger: 0.4,
      ease: easeText
    })
    window.addEventListener('load', function () {
      tl.to('.loader .loader__item', {
        duration: 1.6,
        y: '3em',
        skewY: -20,
        stagger: 0.2,
        ease: easeText
      }).to('.loader', {
        duration: 1.5,
        height: '0vh',
        ease: easeText
      }).to('.loader', {
        display: 'none'
      }).to('body', {
        overflow: ''
      }, '-=2')
    })
  }
}

function cursorCustom() {
  const $cursor = document.querySelector('.cursor')
  const $hoverables = document.querySelectorAll('a, button')

  document.body.addEventListener('mousemove', onMouseMove)
  for (const $hoverable of $hoverables) {
    $hoverable.addEventListener('mouseenter', onMouseHover)
    $hoverable.addEventListener('mouseleave', onMouseHoverOut)
  }

  function onMouseMove(event) {
    gsap.to($cursor, 0.7, {
      x: event.clientX,
      y: event.clientY
    })
  }

  function onMouseHover() {
    gsap.to($cursor, {
      scale: 3.5
    })
  }

  function onMouseHoverOut() {
    gsap.to($cursor, {
      scale: 1
    })
  }
}

function inputMask() {
  for (const input of document.querySelectorAll('[data-mask=phone]')) {
    if (input.mask) input.mask.destroy()
    const phoneMask = IMask(input, {
      mask: '+{7} (000) 000-00-00',
      lazy: false
    })
    input.mask = phoneMask
  }
}

function uiSelects() {
  const selects = $('.ui-select select')
  selects.each(function () {
    const selectParent = $(this).parent()
    $(this).select2({
      minimumResultsForSearch: Number.POSITIVE_INFINITY,
      width: 'auto',
      dropdownAutoWidth: true,
      dropdownParent: selectParent,
      placeholder: $(this).data('placeholder') || ''
    })
  })
}

function uiDropFile() {
  const uiDropFiles = [...document.querySelectorAll('.ui-drop-file')]
  if (uiDropFiles.length > 0) {
    for (const dropFile of uiDropFiles) {
      const dropFileButton = dropFile.querySelector('.ui-drop-file__button')
      const dropFileLabel = dropFile.querySelector('.ui-drop-file__label')
      const dropFileZone = new Dropzone(dropFile, {
        url: '#',
        maxFiles: 1,
        clickable: dropFileButton,
        createImageThumbnails: false,
        maxFilesize: dropFile.dataset.maxFileSize ?? 256,
        init: function () {
          this.on('addedfile', function (file) {
            dropFileLabel.textContent = 'Файл загружен'
          })
          this.on('maxfilesexceeded', function (file) {
            this.removeAllFiles()
            this.addFile(file)
          })
        }
      })

      const form = dropFile.closest('form')
      if (form) {
        form.addEventListener('reset', function () {
          dropFileZone.removeAllFiles()
          dropFileLabel.textContent = 'Выберите файл'
        })
      }
    }
  }
}

function pageProgress() {
  gsap.to('.page-progress', {
    ease: 'none',
    width: '100%',
    scrollTrigger: {
      scrub: true,
      onUpdate: (self) => {
        document.querySelector('.page-progress').style.setProperty('--page-progress-value', `${self.progress * 100}%`)
      }
    }
  })
}

function awards() {
  const blocks = document.querySelectorAll('.awards')
  if (blocks.length > 0) {
    for (const block of blocks) {
      const slider = block.querySelector('.swiper')
      const sliderSwiper = new Swiper(slider, {
        slidesPerView: 'auto',
        spaceBetween: 10,
        breakpoints: {
          1260: {
            slidesPerView: 3,
            spaceBetween: 20
          }
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        }
      })
    }
  }
}

function banner() {
  const blocks = document.querySelectorAll('.banner')
  if (blocks.length > 0) {
    for (const block of blocks) {
      const slider = block.querySelector('.swiper')
      const slideHeads = block.querySelectorAll('.banner__head')
      const sliderSwiper = new Swiper(slider, {
        slidesPerView: 1,
        spaceBetween: 0,
        loop: true,
        autoplay: {
          delay: 5000,
          disableOnInteraction: false
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
          renderBullet: function (index, className) {
            return `
              <span class="${className}">
                ${index + 1}
                <span class="swiper-pagination-bullet-progress"></span>
              </span>
            `
          }
        },
        on: {
          init: () => {
            if (slideHeads.length > 1) {
              bannerHeadsCalcHeight(block, slideHeads)
              block.style.setProperty('--banner-height', window.getComputedStyle(block).getPropertyValue('min-height'))
            }
          },
          autoplayTimeLeft(swiper, time, progress) {
            if (slideHeads.length > 1) {
              swiper.el.style.setProperty('--progress', (1 - progress))
            }
          }
        }
      })
      window.addEventListener('resize', function () {
        if (slideHeads.length > 1) {
          bannerHeadsCalcHeight(block, slideHeads)
        }
      })
    }
  }
}

function bannerHeadsCalcHeight(block, slideHeads) {
  const heights = []
  for (const item of slideHeads) {
    item.style.minHeight = 'auto'
    heights.push(item.offsetHeight)
  }
  const maxHeight = `${Math.max(...heights) + 1}px`
  for (const item of slideHeads) {
    item.style.minHeight = maxHeight
  }
  block.style.setProperty('--banner-max-height-heads', maxHeight)
}

function inNumbers() {
  const numberBlocks = document.querySelectorAll('.in-numbers [data-value]')

  function animateNumbers() {
    const tl = gsap.timeline({
      paused: true
    })
    for (const block of numberBlocks) {
      const targetNumber = Number.parseInt(block.dataset.value, 10)
      tl.to(block, {
        innerHTML: targetNumber,
        duration: 1,
        ease: 'none',
        onUpdate: function () {
          block.innerHTML = (Math.round(block.innerHTML)).toLocaleString('ru-RU')
        }
      })
    }
    tl.play()
  }

  function handleIntersection(entries, observer) {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        animateNumbers()
        observer.disconnect() // Отключаем наблюдение после первой видимости
      }
    }
  }
  if (numberBlocks.length > 0) {
    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.1
    })
    for (const block of numberBlocks) {
      observer.observe(block)
    }
    // Дополнительно проверим видимость при загрузке страницы
    const areBlocksVisible = [...numberBlocks].some((block) => {
      const rect = block.getBoundingClientRect()
      return rect.top < window.innerHeight && rect.bottom >= 0
    })
    if (areBlocksVisible) {
      animateNumbers()
      observer.disconnect()
    }
  }
}

function newsList() {
  const blocks = document.querySelectorAll('.news-list--slider')
  if (blocks.length > 0) {
    for (const block of blocks) {
      const slider = block.querySelector('.swiper')
      const dEnabled = !block.classList.contains('news-list--d-disabled')
      const sliderSwiper = new Swiper(slider, {
        slidesPerView: 'auto',
        spaceBetween: 10,
        enabled: true,
        breakpoints: {
          1260: {
            slidesPerView: 3,
            spaceBetween: 18,
            enabled: dEnabled
          }
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        }
      })
    }
  }
}

function projectsList() {
  const blocks = document.querySelectorAll('.projects-list--slider')
  if (blocks.length > 0) {
    for (const block of blocks) {
      const slider = block.querySelector('.swiper')
      const desktPerView = block.dataset.dSlidesPerView ?? 2
      const sliderSwiper = new Swiper(slider, {
        slidesPerView: 'auto',
        spaceBetween: 10,
        breakpoints: {
          767: {
            slidesPerView: 2
          },
          1260: {
            slidesPerView: desktPerView,
            spaceBetween: 20
          }
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        }
      })
    }
  }
}

function team() {
  const blocks = document.querySelectorAll('.team')
  if (blocks.length > 0) {
    for (const block of blocks) {
      const slider = block.querySelector('.swiper')
      const sliderSwiper = new Swiper(slider, {
        slidesPerView: 'auto',
        spaceBetween: 10,
        breakpoints: {
          1260: {
            slidesPerView: 3,
            spaceBetween: 20
          }
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        }
      })
    }
  }
}

function portfolio() {
  const blocks = document.querySelectorAll('.portfolio')
  if (blocks.length > 0) {
    for (const block of blocks) {
      const slider = block.querySelector('.swiper')
      const sliderSwiper = new Swiper(slider, {
        slidesPerView: 'auto',
        spaceBetween: 10,
        enabled: true,
        breakpoints: {
          768: {
            enabled: false
          }
        }
      })
    }
  }
}

function portfolioGallery() {
  const blocks = document.querySelectorAll('.portfolio-gallery')
  if (blocks.length > 0) {
    for (const block of blocks) {
      const slider = block.querySelector('.swiper')
      const sliderSwiper = new Swiper(slider, {
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        }
      })
    }
  }
}

function clientsSlider() {
  const blocks = document.querySelectorAll('.clients__slider')
  if (blocks.length > 0) {
    for (const block of blocks) {
      const slider = block.querySelector('.swiper')
      const sliderSwiper = new Swiper(slider, {
        slidesPerView: 'auto',
        spaceBetween: 10,
        enabled: true,
        breakpoints: {
          1260: {
            enabled: false
          }
        }
      })
    }
  }
}

function whoWe() {
  const blocks = document.querySelectorAll('.who-we')
  if (blocks.length > 0) {
    for (const block of blocks) {
      const slider = block.querySelector('.swiper')
      const sliderSwiper = new Swiper(slider, {
        slidesPerView: 'auto',
        spaceBetween: 10,
        breakpoints: {
          767: {
            slidesPerView: 2,
            spaceBetween: 20
          }
        }
      })
    }
  }
}

function locationMap() {
  const mapBlock = $('.js-location-map')
  if (mapBlock.length > 0) {
    let myMap
    const coordsLat = Number.parseFloat(mapBlock.attr('data-coords-lat'))
    const coordsLng = Number.parseFloat(mapBlock.attr('data-coords-lng'))
    const mapzoom = mapBlock.attr('data-zoom')
    const placemarkSize = $(window).width() > 767 ? 174 : 90
    ymaps.ready(init)

    function init() {
      myMap = new ymaps.Map(document.querySelector('.js-location-map'), {
        center: [coordsLat, coordsLng],
        zoom: mapzoom,
        controls: []
      }, {
        suppressMapOpenBlock: true
      })
      const placemark = new ymaps.Placemark([coordsLat, coordsLng], {}, {
        iconLayout: 'default#image',
        iconImageHref: '/img/svgs/map_placemark.svg',
        iconImageSize: [placemarkSize, placemarkSize],
        iconImageOffset: [(placemarkSize / -2), (placemarkSize / -1)]
      })
      myMap.geoObjects.add(placemark)
      myMap.behaviors.disable('scrollZoom')
      if ($(window).width() < 1025) {
        myMap.behaviors.disable('drag')
      }
    }
  }
}

function objects() {
  $('.objects').each(function () {
    const items = $(this).find('.objects__main')
    items.each(function () {
      const itemHeight = $(this).prop('scrollHeight')
      $(this).css('--objects-main-height', `${itemHeight + 1}px`)
    })
  })
}

function header() {
  $('.header__burger-button').click(function () {
    $('.header').toggleClass('header--open')
    $(this).toggleClass('header__burger-button--active')
    $('.header__burger').toggleClass('header__burger--active')
    if ($('.header').hasClass('header--open')) {
      $('html').css('overflow', 'hidden')
    } else {
      $('html').css('overflow', '')
    }
  })
  $('.header__menu-head').click(function () {
    $(this).parents('.header__menu-item').toggleClass('header__menu-item--active')
    $(this).siblings('.header__menu-dropdown').slideToggle()
  })
  $(document).click(function (event) {
    if ($('.header__burger-button--active').length > 0 && $(event.target).closest('.header__burger-button, .header__burger-wrapper').length === 0) {
      $('html').css('overflow', '')
      $('.header').removeClass('header--open')
      $('.header__burger').removeClass('header__burger--active')
      $('.header__burger-button').removeClass('header__burger-button--active')
    }
  })

  $('.header__search-open').click(function () {
    $('.header-search').addClass('header-search--active')
    $('html').css('overflow', 'hidden')
  })
  $('.header-search__close').click(function () {
    $('.header-search').removeClass('header-search--active')
    $('html').css('overflow', '')
  })
  $(document).click(function (event) {
    if ($(event.target).closest('.header-search--active').length === 1 && $(event.target).closest('.header-search__wrapper').length === 0) {
      $('html').css('overflow', '')
      $('.header-search').removeClass('header-search--active')
    }
  })

  headerVisible()

  window.addEventListener('load', headerHeightCalc)
  window.addEventListener('resize', headerHeightCalc)
}

function headerHeightCalc() {
  const headerBlock = $('.header')
  $('html').css('--header-height', `${headerBlock.height()}px`)
}

function headerVisible() {
  const headerHideClass = 'header--hide'
  const navMods = 'nav--header-show'
  let lastScrollTop = 0

  $(window).on('scroll', function () {
    const botTriggerCoord = $('.header').height()
    const scrollTop = $(this).scrollTop()
    if (document.documentElement.scrollTop > botTriggerCoord) {
      $('.header').addClass(headerHideClass)
      if (scrollTop < lastScrollTop) {
        $('.header').removeClass(headerHideClass)
        if ($('.nav').length > 0 && scrollTop < ($('.nav').offset().top - botTriggerCoord)) {
          $('.nav').removeClass(navMods)
        } else {
          $('.nav').addClass(navMods)
        }
      } else {
        $('.nav').removeClass(navMods)
        $('.header').addClass(headerHideClass)
      }
    }
    lastScrollTop = scrollTop
  })
}

function nav() {
  $('[data-section]').each(function () {
    const item = $(this)
    const sectionValue = item.data('section')
    const idValue = item.attr('id')
    const dropdownContent = $(`
      <div class="nav__select-link">
        <a class="ui-link" href="#${idValue}">${sectionValue}</a>
      </div>`)
    $('.nav__select-dropdown').append(dropdownContent)
  })

  $(window).on('scroll', function () {
    if ($('.nav__select-head--active').length > 0) {
      $('.nav__select-dropdown').fadeOut()
      $('.nav__select-head').removeClass('nav__select-head--active')
    }
    $('[data-section]').each(function () {
      if (($(this).offset().top - 200) < $(window).scrollTop()) {
        sectionId = $(this).attr('id')
        if ($(`.nav__select-link [href="#${sectionId}"]`).length > 0) {
          $('.nav__select-link').removeClass('nav__select-link--active')
          $(`.nav__select-link [href="#${sectionId}"]`).parents('.nav__select-link').addClass('nav__select-link--active')
          $('.nav__select-label').html($(this).data('section'))
        }
      }
    })
  })

  $('.nav__select-head').on('click', function () {
    $(this).toggleClass('nav__select-head--active')
    $(this).siblings('.nav__select-dropdown').fadeToggle()
  })

  $(document).click(function (event) {
    if ($('.nav__select-head--active').length > 0 && $(event.target).closest('.nav__select').length === 0) {
      $('.nav__select-dropdown').fadeOut()
      $('.nav__select-head').removeClass('nav__select-head--active')
    }
  })

  $('[data-nav-open-share]').click(function () {
    $(this).toggleClass('active')
    $('.nav__share').fadeToggle()
    $('.nav__share').find('.share__button').removeClass('share__button--active')
  })
  $(window).on('scroll', function () {
    if ($('[data-nav-open-share].active').length > 0) {
      $('.nav__share').fadeOut()
    }
  })

  $(document).click(function (event) {
    if ($('[data-nav-open-share].active').length > 0 && $(event.target).closest('.nav__share, [data-nav-open-share]').length === 0) {
      $('[data-nav-open-share]').removeClass('active')
      $('.nav__share').fadeOut()
    }
  })
}

function shareButtonCopy(element) {
  const valueToCopy = $(element).data('copy-value')

  const temporaryInput = $('<input>')
  temporaryInput.css({ display: 'absolute', left: '-1000px', top: '-1000px' })
  temporaryInput.val(valueToCopy)
  $('body').append(temporaryInput)
  temporaryInput.select()
  document.execCommand('copy')
  temporaryInput.remove()

  $(element).addClass('share__button--active')
}

function animation() {
  animationImg()
  animationSection()
}

function animationImg() {
  $('.img-wrapper--animation').each(function (index, item) {
    for (const element of gsap.utils.toArray(item)) {
      ScrollTrigger.create({
        trigger: element,
        // start: 'top center',
        // end: 'bottom center',
        onEnter: function () {
          $(element).addClass('img-wrapper--animation-active')
        },
        onEnterBack: function () {
          $(element).addClass('img-wrapper--animation-active')
        }
      })
    }
  })
}
function animationSection() {
  $('.section--animation').each(function (index, item) {
    for (const element of gsap.utils.toArray(item)) {
      ScrollTrigger.create({
        trigger: element,
        onEnter: function () {
          $(element).addClass('section--animation-active')
        },
        onEnterBack: function () {
          $(element).addClass('section--animation-active')
        }
      })
    }
  })
}

function popup() {
  window.openPopup = function (element) {
    const popupElement = $(element)
    if (popupElement) {
      popupElement.addClass('active')
      $('html').css('overflow', 'hidden')
    }
  }

  window.closePopup = function (element) {
    $(element).removeClass('active')
    $('html').css('overflow', '')
  }

  $('.popup').on('click', function (event) {
    if ($(event.target).closest('.popup__container').length === 0) {
      $(this).removeClass('active')
      $('html').css('overflow', '')
    }
  })
}

function slideTo() {
  window.slideTo = function (slider, activeIndex) {
    document.querySelector(slider).swiper.slideTo(activeIndex, 300)
  }
}

function formThank() {
  window.formThankShow = function (form) {
    $(form).addClass('form-thank--active')
  }
  window.formThankHide = function (form, thisButton) {
    $(thisButton).parents('.form-thank').removeClass('form-thank--active')
    $(form).trigger('reset')
    $(form).find('.ui-select select').val('').trigger('change')
    window.updInputMask()
  }
}
