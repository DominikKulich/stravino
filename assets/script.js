// Stravino marketing web — jen drobná progresivní vylepšení. Veškerý OBSAH je
// v HTML bez ohledu na tenhle soubor (kvůli SEO, viz docs/DECISIONS.md
// 2026-08-19); appka funguje i s vypnutým JS, jen bez animací a bez AJAX
// odeslání formuláře (ten pak jede jako obyčejný POST na Formspree).
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

  // --- Kontaktní formulář: AJAX odeslání na Formspree (formspree.io) ---
  // Bez JS funguje formulář i tak (obyčejný POST na action=), jen skončí
  // na výchozí děkovací stránce Formspree místo zůstání na téhle stránce.
  var form = document.getElementById('contact-form')
  if (form) {
    var note = document.getElementById('contact-note')
    var submitBtn = document.getElementById('contact-submit')
    var noteDefault = note.textContent

    form.addEventListener('submit', function (e) {
      e.preventDefault()
      submitBtn.disabled = true
      note.textContent = 'Odesílám…'

      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      })
        .then(function (response) {
          submitBtn.disabled = false
          if (response.ok) {
            form.reset()
            note.textContent = 'Děkujeme, poptávka byla odeslána — ozveme se co nejdřív.'
          } else {
            note.textContent = 'Nepovedlo se odeslat. Zkuste to prosím znovu, nebo napište přímo na dominik.kulich@email.cz.'
          }
        })
        .catch(function () {
          submitBtn.disabled = false
          note.textContent = 'Nepovedlo se odeslat. Zkuste to prosím znovu, nebo napište přímo na dominik.kulich@email.cz.'
        })
    })
  }
})()
