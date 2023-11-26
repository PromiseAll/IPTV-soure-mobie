import axios from "axios";
import pLimit from "p-limit";
export function getPing(url: string) {
  const startTime = performance.now();
  return new Promise((resolve, reject) => {
    axios
      .get(url, { timeout: 10 * 1000, headers: { "cache-control": "no-cache" } })
      .then(() => {
        let loadTime = performance.now() - startTime;
        // 转成毫秒
        // loadTime && (loadTime /= 1000);
        resolve(loadTime.toFixed(0));
      })
      .catch(error => {
        resolve(-1);
      });
  });
}

export function getPingUrl(url: string[] | string, callback: Function) {
  if (typeof url === "string") {
    return getPing(url);
  }
  const limit = pLimit(10);
  return Promise.allSettled(
    url.map(u =>
      limit(() =>
        getPing(u).then(ping => {
          callback && callback(u, ping);
          return ping;
        })
      )
    )
  );
}
