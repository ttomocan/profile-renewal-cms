/**
 * microcms-js-sdk 3.1.xの明示的な404だけを「未存在」に変換する。
 * SDKはHTTPステータスをError.messageに含めるため、先頭の形式まで限定する。
 * 通信障害・認証エラー・429・5xx・未知の形式は元の例外のまま伝播させる。
 */
export function returnNullOnMicroCMSNotFound(error: unknown): null {
  if (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof error.message === 'string' &&
    /^fetch API response status: 404(?:\r?\n|$)/.test(error.message)
  ) {
    return null;
  }
  throw error;
}
