export function getSourcesByHtml(htmlContent) {
  const dom = document.createElement('div');
  dom.innerHTML = htmlContent;
  const result = dom.querySelectorAll('.tables .result');
  const sources = Array.from(result)
    .map((item, index) => {
      const url = item.querySelector(`tba:nth-child(2)`)?.textContent;
      const sourceName = item.querySelector(`.channel`)?.textContent;
      // console.log(sourceName,url);
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
