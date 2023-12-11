const MB = 1024 * 1024;

/**
 * @description: Convert KB to MB
 * @param bk number
 * @return MB number
 */
export function parseKMToMB(kb: number) {
  return parseInt((kb / MB).toFixed(2));
}
