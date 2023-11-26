export function getSourcesByHtml(htmlContent) {
  const dom = document.createElement("div");
  dom.innerHTML = htmlContent;
  const result = dom.querySelectorAll(".tables .result");

  const sources = Array.from(result)
    .map((item, index) => {
      const url = item.querySelector(`.m3u8 tr:nth-child(1) td:nth-child(2)`)?.textContent;
      const sourceName = item.querySelector(`.channel a div`)?.textContent;
      if (!url) return null;
      return {
        url: item.querySelector(`.m3u8 tr:nth-child(1) td:nth-child(2)`)?.textContent,
        sourceName: item.querySelector(`.channel a div`)?.textContent,
        ping:null
      };
    })
    .filter(Boolean);
  dom.remove();
  return sources;
}
