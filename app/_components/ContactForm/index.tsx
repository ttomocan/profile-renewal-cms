'use client';

import Image from 'next/image';
import { createContactData } from '@/app/_actions/contact';
import { useFormState } from 'react-dom';
import { sendGAEvent } from '@next/third-parties/google';

const initialState = {
  status: '',
  message: '',
};

export default function ContactForm() {
  const [state, formAction] = useFormState(createContactData, initialState);
  console.log(state);
  const handleSubmit = () => {
    sendGAEvent({ event: 'contact', value: 'submit' });
  };
  if (state.status === 'success') {
    return (
      <p className="p-form__success">
        お問い合わせいただき、ありがとうございます。
        <br />
        お返事まで今しばらくお待ちください。
      </p>
    );
  }
  return (
    <form className="p-form" action={formAction} onSubmit={handleSubmit}>
      {/* お名前 */}
      <div className="p-form__item">
        <div className="p-form__heading">
          <label className="label" htmlFor="namae">
            お名前
          </label>
          <span className="p-form__required">必須</span>
        </div>
        <div className="p-form__input">
          <input type="text" name="namae" id="namae" className="textfield" />
        </div>
      </div>

      {/* ふりがな */}
      <div className="p-form__item">
        <div className="p-form__heading">
          <label className="label" htmlFor="furigana">
            ふりがな
          </label>
          <span className="p-form__required">必須</span>
        </div>
        <div className="p-form__input">
          <input type="text" name="furigana" id="furigana" className="textfield" />
        </div>
      </div>

      {/* メールアドレス */}
      <div className="p-form__item">
        <div className="p-form__heading">
          <label className="label" htmlFor="email">
            メールアドレス
          </label>
          <span className="p-form__required">必須</span>
        </div>
        <div className="p-form__input">
          <input type="text" name="email" id="email" className="textfield" />
        </div>
      </div>

      {/* お問い合わせ項目 */}
      <div className="p-form__item">
        <div className="p-form__heading">
          <label className="label" htmlFor="item">
            お問い合わせ項目
          </label>
          <span className="p-form__required">必須</span>
        </div>
        <div className="p-form__input">
          <label className="checkbox">
            <input type="radio" name="item" value="Webサイト制作の依頼" />
            <span className="checkbox-text">Webサイト制作の依頼</span>
          </label>
          <label className="checkbox">
            <input type="radio" name="item" value="Webデザインに関する相談" />
            <span className="checkbox-text">Webデザインに関する相談</span>
          </label>
          <label className="checkbox">
            <input type="radio" name="item" value="ブログに関する相談" />
            <span className="checkbox-text">ブログに関する相談</span>
          </label>
          <label className="checkbox">
            <input type="radio" name="item" value="その他" />
            <span className="checkbox-text">その他</span>
          </label>
        </div>
      </div>

      {/* ご住所 */}
      {/* <FormItem label="ご住所">
        <input type="text" name="state" />
        <input type="text" name="city" />
        <input type="text" name="address" />
      </FormItem> */}

      {/* お問い合わせ内容 */}
      <div className="p-form__item">
        <div className="p-form__heading">
          <label className="label" htmlFor="message">
            お問い合わせ内容
          </label>
          <span className="p-form__required">必須</span>
        </div>
        <div className="p-form__input">
          <textarea className="textarea" id="message" name="message" />
        </div>
      </div>

      {/* 添付ファイル */}
      <div className="p-form__item">
        <div className="p-form__heading">
          <label className="label" htmlFor="file">
            添付ファイル
          </label>
        </div>
        <div className="p-form__input">
          <div className="attachment">
            <label>
              <input type="file" name="file" id="file" className="attachment-fileinput" />
              ファイルを添付する
              <Image src="/img/pages/contact/icon_file.svg" alt="" width={20} height={20} style={{ width: 'auto', height: '20px' }} />
            </label>
            <span className="attachment-filename">選択されていません</span>
          </div>
        </div>
      </div>

      {/* エラー */}
      {state.status === 'error' && <p className="p-form__error">{state.message}</p>}

      {/* ボタン */}
      <div className="p-form__button">
        {/* <button type="submit" className="c-button__link --return --gray">
          戻る
        </button> */}
        <button type="submit" className="c-button__link --main">
          送信する
        </button>
      </div>
    </form>
  );
}
