'use client';

import { useActionState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { createContactData, type ContactFormState } from '@/app/_actions/contact';
import { sendGAEvent } from '@next/third-parties/google';

const initialState: ContactFormState = {
  status: 'idle',
  message: '',
};

const contactTypes = ['採用に関するご連絡', '業務委託・協業のご相談', '制作実績に関するお問い合わせ', 'ブログ・メディアに関するお問い合わせ', 'その他'];

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" className="c-button__link --main" disabled={pending} aria-disabled={pending}>
      {pending ? '送信中…' : '送信する'}
    </button>
  );
}

export default function ContactForm() {
  const [state, formAction] = useActionState(createContactData, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status !== 'error') return;

    if (state.field) {
      formRef.current?.querySelector<HTMLElement>(`[name="${state.field}"]`)?.focus();
      return;
    }

    formRef.current?.querySelector<HTMLElement>('[type="submit"]')?.focus();
  }, [state]);

  if (state.status === 'success') {
    return (
      <p className="p-form__success" role="status" aria-live="polite" tabIndex={-1}>
        お問い合わせいただき、ありがとうございます。
        <br />
        内容を確認のうえ返信します。
      </p>
    );
  }

  const hasFieldError = (field: string) => state.status === 'error' && state.field === field;
  const handleSubmit = () => {
    const analyticsWindow = window as Window & { dataLayer?: unknown[] };
    if (Array.isArray(analyticsWindow.dataLayer)) {
      sendGAEvent({ event: 'contact', value: 'submit' });
    }
  };

  return (
    <form
      ref={formRef}
      className="p-form"
      action={formAction}
      onSubmit={handleSubmit}
      noValidate
    >
      <div className="p-form__item">
        <div className="p-form__heading">
          <label className="label" htmlFor="namae">
            お名前
          </label>
          <span className="p-form__required" aria-hidden="true">
            必須
          </span>
        </div>
        <div className="p-form__input">
          <input type="text" name="namae" id="namae" className="textfield" autoComplete="name" required aria-required="true" aria-invalid={hasFieldError('namae')} maxLength={100} />
        </div>
      </div>

      <div className="p-form__item">
        <div className="p-form__heading">
          <label className="label" htmlFor="furigana">
            ふりがな
          </label>
          <span className="p-form__required" aria-hidden="true">
            必須
          </span>
        </div>
        <div className="p-form__input">
          <input type="text" name="furigana" id="furigana" className="textfield" autoComplete="off" required aria-required="true" aria-invalid={hasFieldError('furigana')} maxLength={100} />
        </div>
      </div>

      <div className="p-form__item">
        <div className="p-form__heading">
          <label className="label" htmlFor="email">
            メールアドレス
          </label>
          <span className="p-form__required" aria-hidden="true">
            必須
          </span>
        </div>
        <div className="p-form__input">
          <input type="email" name="email" id="email" className="textfield" autoComplete="email" inputMode="email" required aria-required="true" aria-invalid={hasFieldError('email')} maxLength={254} />
        </div>
      </div>

      <fieldset className="p-form__item" aria-invalid={hasFieldError('item')}>
        <legend className="p-form__heading">
          <span className="label">お問い合わせ項目</span>
          <span className="p-form__required" aria-hidden="true">
            必須
          </span>
        </legend>
        <div className="p-form__input" role="radiogroup" aria-required="true">
          {contactTypes.map((type) => (
            <label className="checkbox" key={type}>
              <input type="radio" name="item" value={type} required />
              <span className="checkbox-text">{type}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="p-form__item">
        <div className="p-form__heading">
          <label className="label" htmlFor="message">
            お問い合わせ内容
          </label>
          <span className="p-form__required" aria-hidden="true">
            必須
          </span>
        </div>
        <div className="p-form__input">
          <textarea className="textarea" id="message" name="message" required aria-required="true" aria-invalid={hasFieldError('message')} maxLength={5000} />
        </div>
      </div>

      {state.status === 'error' && (
        <p id="contact-error" className="p-form__error" role="alert" aria-live="assertive">
          {state.message}
        </p>
      )}

      <div className="p-form__button">
        <SubmitButton />
      </div>
    </form>
  );
}
