import Head from 'next/head';

export default function NotFound() {
  return (
    <>
      <div className="l-inner">
        <dl>
          <dt>ページが見つかりませんでした</dt>
          <dd>
            あなたがアクセスしようとしたページは存在しません。
            <br />
            URLを再度ご確認ください。
          </dd>
        </dl>
      </div>
    </>
  );
}
