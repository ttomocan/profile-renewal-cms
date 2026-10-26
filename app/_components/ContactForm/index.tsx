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

function SubmitButton({ errorId }: { errorId?: string }) {
  const { pending } = useFormStatus();

  return (
    <>
      <button type="submit" className="c-button__link --main" disabled={pending} aria-disabled={pending} aria-describedby={errorId}>
        {pending ? '送信中…' : '送信する'}
      </button>
      <span className="u-visually-hidden" role="status" aria-live="polite" aria-atomic="true">
        {pending ? 'お問い合わせを送信しています。しばらくお待ちください。' : ''}
      </span>
    </>
  );
}

export default function ContactForm() {
  const [state, formAction] = useActionState(createContactData, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLParagraphElement>(null);
  const hasTrackedSuccess = useRef(false);

  useEffect(() => {
    if (state.status === 'success') {
      successRef.current?.focus();
      return;
    }
    if (state.status !== 'error') return;

    if (state.field) {
      formRef.current?.querySelector<HTMLElement>(`[name="${state.field}"]`)?.focus();
      return;
    }

    formRef.current?.querySelector<HTMLElement>('[type="submit"]')?.focus();
  }, [state]);

  useEffect(() => {
    if (state.status !== 'success' || hasTrackedSuccess.current) return;

    const analyticsWindow = window as Window & { dataLayer?: unknown[] };
    if (!Array.isArray(analyticsWindow.dataLayer)) return;

    // effectの再実行でも、同じ送信成功を重複して計測しない。
    hasTrackedSuccess.current = true;
    try {
      sendGAEvent('event', 'generate_lead', { form_name: 'contact' });
    } catch {
      // 計測の失敗で、問い合わせの成功表示やフォーカス移動を妨げない。
    }
  }, [state.status]);

  if (state.status === 'success') {
    return (
      <p ref={successRef} className="p-form__success" role="status" aria-live="polite" tabIndex={-1}>
        お問い合わせいただき、ありがとうございます。
        <br />
        内容を確認のうえ返信します。
      </p>
    );
  }

  const hasFieldError = (field: string) => state.status === 'error' && state.field === field;

  return (
    <form
      ref={formRef}
      className="p-form"
      action={formAction}
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
          <input type="text" name="namae" id="namae" className="textfield" autoComplete="name" required aria-required="true" aria-invalid={hasFieldError('namae')} aria-describedby={hasFieldError('namae') ? 'contact-error' : undefined} maxLength={100} />
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
          <input type="text" name="furigana" id="furigana" className="textfield" autoComplete="off" required aria-required="true" aria-invalid={hasFieldError('furigana')} aria-describedby={hasFieldError('furigana') ? 'contact-error' : undefined} maxLength={100} />
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
          <input type="email" name="email" id="email" className="textfield" autoComplete="email" inputMode="email" required aria-required="true" aria-invalid={hasFieldError('email')} aria-describedby={hasFieldError('email') ? 'contact-error' : undefined} maxLength={254} />
        </div>
      </div>

      <fieldset className="p-form__item" aria-invalid={hasFieldError('item')}>
        <legend className="p-form__heading">
          <span className="label">お問い合わせ項目</span>
          <span className="p-form__required" aria-hidden="true">
            必須
          </span>
        </legend>
        <div className="p-form__input">
          {contactTypes.map((type) => (
            <label className="checkbox" key={type}>
              <input type="radio" name="item" value={type} required aria-describedby={hasFieldError('item') ? 'contact-error' : undefined} />
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
          <textarea className="textarea" id="message" name="message" required aria-required="true" aria-invalid={hasFieldError('message')} aria-describedby={hasFieldError('message') ? 'contact-error' : undefined} maxLength={5000} />
        </div>
      </div>

      {state.status === 'error' && (
        <p id="contact-error" className="p-form__error" role="alert" aria-live="assertive">
          {state.message}
        </p>
      )}

      <div className="p-form__button">
        <SubmitButton errorId={state.status === 'error' && !state.field ? 'contact-error' : undefined} />
      </div>
    </form>
  );
}
