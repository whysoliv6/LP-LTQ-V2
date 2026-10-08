/* =============================================================
   LTQ EDUCAÇÃO · LP DA OFERTA COMPLETA
   main.js · quatro coisas e nada mais: checkout, abas, mural de
   prints e reveal.
   Sem dependência, sem build.
   ============================================================= */

(function () {
  "use strict";

  /* -----------------------------------------------------------
     1 · CHECKOUT
     O link de compra SAIU DAQUI em 08/10/2026 e foi para o `href`
     dos três botões no HTML (`grep -n js-checkout index.html`).

     Enquanto não existia link, morar numa constante aqui fazia
     sentido: era um lugar só para preencher. Agora que a página
     vende de verdade, botão de compra que depende de JavaScript é
     risco que não se paga — se o script falhar ou demorar, o
     clique não leva a lugar nenhum e ninguém fica sabendo. No
     `href` ele funciona antes de qualquer script rodar.

     Para trocar a URL: são três ocorrências no HTML, e o `&` ali
     precisa estar escrito `&amp;`, senão o parser come o `utm_source`.
     ----------------------------------------------------------- */

  /* -----------------------------------------------------------
     2 · ABAS DAS TRILHAS
     Padrão ARIA de tablist com setas do teclado. Os painéis já
     nascem no HTML: sem JS, o primeiro fica visível e os outros
     ficam com [hidden], que é um estado honesto e não quebra nada.
     ----------------------------------------------------------- */
  var tabs = Array.prototype.slice.call(document.querySelectorAll('[role="tab"]'));

  function selecionar(tab) {
    tabs.forEach(function (t) {
      var painel = document.getElementById(t.getAttribute("aria-controls"));
      var ativo = t === tab;
      t.setAttribute("aria-selected", ativo ? "true" : "false");
      t.tabIndex = ativo ? 0 : -1;
      if (painel) painel.hidden = !ativo;
    });
  }

  if (tabs.length) {
    tabs.forEach(function (tab, i) {
      tab.tabIndex = tab.getAttribute("aria-selected") === "true" ? 0 : -1;

      tab.addEventListener("click", function () {
        selecionar(tab);
      });

      tab.addEventListener("keydown", function (e) {
        var alvo = null;
        if (e.key === "ArrowRight") alvo = tabs[(i + 1) % tabs.length];
        if (e.key === "ArrowLeft") alvo = tabs[(i - 1 + tabs.length) % tabs.length];
        if (e.key === "Home") alvo = tabs[0];
        if (e.key === "End") alvo = tabs[tabs.length - 1];
        if (!alvo) return;
        e.preventDefault();
        selecionar(alvo);
        alvo.focus();
      });
    });
  }

  /* -----------------------------------------------------------
     3 · ENTRADA EM CENA
     IntersectionObserver e CSS, nada que intercepte o scroll.
     Quem pediu menos movimento no sistema já é atendido pelo
     @media do CSS, mas aqui a gente nem observa, para não gastar.
     ----------------------------------------------------------- */
  var menosMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var alvos = document.querySelectorAll("[data-reveal]");

  if (menosMovimento || !("IntersectionObserver" in window)) {
    alvos.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (!entrada.isIntersecting) return;
        entrada.target.classList.add("is-visible");
        obs.unobserve(entrada.target);
      });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.08 });

    alvos.forEach(function (el) { obs.observe(el); });
  }

  /* -----------------------------------------------------------
     4 · MURAL DE PRINTS
     Os 36 prints estão todos no HTML. Sem JS o mural abre
     inteiro e o botão fica escondido: ninguém perde depoimento
     porque um script não carregou. É o JS que FECHA o mural, e
     só então o botão aparece.
     ----------------------------------------------------------- */
  var mural = document.querySelector("[data-mural]");

  if (mural) {
    var acao = mural.querySelector("[data-mural-acao]");
    var botao = mural.querySelector("[data-mural-botao]");
    var rotulo = mural.querySelector("[data-mural-rotulo]");

    if (acao && botao && rotulo) {
      var abrir = rotulo.textContent;
      var fechar = botao.getAttribute("data-fechar");

      mural.setAttribute("data-colapsado", "");
      acao.hidden = false;
      botao.setAttribute("aria-expanded", "false");

      botao.addEventListener("click", function () {
        var fechado = mural.hasAttribute("data-colapsado");

        if (fechado) {
          mural.removeAttribute("data-colapsado");
          rotulo.textContent = fechar;
          botao.setAttribute("aria-expanded", "true");
          return;
        }

        /* Ao fechar, o mural encolhe de uma vez e o topo dele pode
           ficar acima da janela: a pessoa clica e "cai" no meio de
           outra seção. Reancora no começo da seção. */
        mural.setAttribute("data-colapsado", "");
        rotulo.textContent = abrir;
        botao.setAttribute("aria-expanded", "false");

        var topo = mural.getBoundingClientRect().top + window.pageYOffset - 120;
        if (window.pageYOffset > topo) window.scrollTo(0, topo);
      });
    }
  }

  /* -----------------------------------------------------------
     5 · ANO DO RODAPÉ
     ----------------------------------------------------------- */
  var ano = document.getElementById("ano");
  if (ano) ano.textContent = String(new Date().getFullYear());
})();
