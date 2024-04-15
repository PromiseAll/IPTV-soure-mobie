export function getSourcesByHtml(htmlContent) {
  const dom = document.createElement('div');
  dom.innerHTML = htmlContent;
  const result = dom.querySelectorAll('.tables .result');
  const sources = Array.from(result)
    .map((item, index) => {
      const url = item.querySelector(`div:nth-child(3)`)?.textContent;
      const sourceName = item.querySelector(`.channel`)?.textContent;
      if (!url) return null;
      return {
        url,
        sourceName,
        ping: null,
      };
    })
    .filter(Boolean);
  dom.remove();
  return sources;
}
