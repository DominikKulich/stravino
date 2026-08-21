// Stravino marketing web — jen drobná progresivní vylepšení. Veškerý OBSAH je
// v HTML bez ohledu na tenhle soubor (kvůli SEO, viz docs/DECISIONS.md
// 2026-08-19); appka funguje i s vypnutým JS, jen bez animací a bez
// mailto: předvyplnění (formulář má jako fallback obyčejný GET na mailto:).
(function () {
  'use strict'

  // --- Mobilní menu ---
  var nav = document.getElementById('nav')
  var burger = document.getElementById('burger')
  var burgerIcon = document.getElementById('burger-icon')

  function setMenu(open) {
    nav.classList.toggle('is-open', open)
    burger.setAttribute('aria-expanded', String(open))
    burgerIcon.setAttribute('href', open ? '#i-x' : '#i-menu')
  }

  if (burger) {
    burger.addEventListener('click', function () {
      setMenu(!nav.classList.contains('is-open'))
    })
    document.querySelectorAll('#mobile-menu a').forEach(function (a) {
      a.addEventListener('click', function () { setMenu(false) })
    })
  }

  // --- Scroll reveal (jen vizuální, obsah je vidět i bez JS - viz style.css) ---
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    )
    document.querySelectorAll('.reveal').forEach(function (el) { observer.observe(el) })
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('is-visible') })
  }

  // --- Kontaktní formulář: mailto: s předvyplněným předmětem a tělem ---
  var form = document.getElementById('contact-form')
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault()
      var jmeno = document.getElementById('f-jmeno').value.trim()
      var email = document.getElementById('f-email').value.trim()
      var telefon = document.getElementById('f-telefon').value.trim()
      var zprava = document.getElementById('f-zprava').value.trim()

      var predmet = 'Poptávka Stravino — ' + jmeno
      var radky = ['Jméno: ' + jmeno, 'E-mail: ' + email]
      if (telefon) radky.push('Telefon: ' + telefon)
      radky.push('', zprava)

      var mailto =
        'mailto:dominik.kulich@email.cz' +
        '?subject=' + encodeURIComponent(predmet) +
        '&body=' + encodeURIComponent(radky.join('\n'))
      window.location.href = mailto
    })
  }
})()
