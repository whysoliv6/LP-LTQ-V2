/* Eventos de conversão do CTA.
   Dispara em qualquer provedor que já esteja carregado (Meta Pixel, GA4).
   Se nenhum estiver configurado, não faz nada — nenhum erro no console. */

document.querySelectorAll('[data-cta="checkout"]').forEach(link => {
  link.addEventListener('click', () => {
    if (typeof fbq === 'function') {
      fbq('track', 'InitiateCheckout', { content_name: 'Planilha de Controle Financeiro' });
    }

    if (typeof gtag === 'function') {
      gtag('event', 'begin_checkout', { item_name: 'Planilha de Controle Financeiro' });
    }
  });
});
