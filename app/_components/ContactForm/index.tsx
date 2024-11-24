'use client';

import { createContactData } from '@/app/_actions/contact';
import { useActionState } from 'react'; // Updated import
import { sendGAEvent } from '@next/third-parties/google';
import Image from 'next/image';
import { useState } from 'react';

const initialState = {
  status: '',
  message: '',
};

export default function ContactForm() {
  const [state, formAction] = useActionState(createContactData, initialState);
  const [fileName, setFileName] = useState('選択されていません');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFileName(file ? file.name : '選択されていません');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    sendGAEvent({ event: 'contact', value: 'submit' });
  };

  if (state.status === 'success') {
    return (
      <p className="thankyou">
        お問い合わせいただき、ありがとうございます。
        <br />
        お返事まで今しばらくお待ちください。
      </p>
    );
  }

  return (
    <form className="l-form" action={formAction} onSubmit={handleSubmit}>
      {state.status === 'error' && <p className="l-form__error">{state.message}</p>}

      {/* お名前 */}
      <FormItem label="お名前" required>
        <input type="text" name="name" placeholder="例：山田太郎" autoComplete="name" required />
      </FormItem>

      {/* ふりがな */}
      <FormItem label="ふりがな">
        <input type="text" name="name_furigana" placeholder="例：やまだたろう" autoComplete="off" />
      </FormItem>

      {/* メールアドレス */}
      <FormItem label="メールアドレス" required>
        <input type="email" name="email" placeholder="例：xxx@yyy.zzz" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$" autoComplete="email" required />
      </FormItem>

      {/* お問い合わせ項目 */}
      <FormItem label="お問い合わせ項目" required>
        {['Webサイト制作の依頼', 'Webデザインに関する相談', 'ブログに関する相談', 'その他'].map((item, index) => (
          <label key={index} className="checkbox">
            <input type="radio" name="item" value={item} required={index === 0} />
            <span className="checkbox-text">{item}</span>
          </label>
        ))}
      </FormItem>

      {/* 郵便番号 */}
      <FormItem label="郵便番号">
        <input type="text" name="postal_code" autoComplete="postal-code" inputMode="numeric" pattern="\d{3}-\d{4}" placeholder="郵便番号" />
      </FormItem>

      {/* ご住所 */}
      <FormItem label="ご住所">
        <input type="text" name="都道府県" placeholder="都道府県" autoComplete="address-level1" />
        <input type="text" name="市区町村" placeholder="市区町村" autoComplete="address-level2" />
        <input type="text" name="住所1行目" placeholder="住所1行目" autoComplete="street-address" />
        <input type="text" name="住所2行目" placeholder="住所2行目" autoComplete="address-line2" />
      </FormItem>

      {/* お問い合わせ内容 */}
      <FormItem label="お問い合わせ内容" required>
        <textarea name="content" cols="30" rows="10" placeholder="例：ブログのデザインを見直したい" required></textarea>
      </FormItem>

      {/* 添付ファイル */}
      <FormItem label="添付ファイル">
        <div className="attachment">
          <label>
            <input type="file" name="file" className="attachment-fileinput" onChange={handleFileChange} />
            ファイルを添付する
            <Image src="/img/pages/contact/icon_file.svg" alt="" width={20} height={20} />
          </label>
          <span className="attachment-filename">{fileName}</span>
        </div>
      </FormItem>

      {/* ボタン */}
      <div className="l-form__button">
        <button type="submit" className="c-button__link --return --gray">
          戻る
        </button>
        <button type="submit" className="c-button__link --main">
          送信する
        </button>
      </div>
    </form>
  );
}

/* 共通のフォーム項目コンポーネント */
function FormItem({ label, required, children }) {
  return (
    <div className="l-form__item">
      <div className="l-form__heading">
        {label}
        {required && <span className="l-form__required">必須</span>}
      </div>
      <div className="l-form__input">{children}</div>
    </div>
  );
}
