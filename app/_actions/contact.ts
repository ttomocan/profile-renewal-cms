'use server';

export type ContactField = 'namae' | 'furigana' | 'email' | 'item' | 'message';

export type ContactFormState = {
  status: 'idle' | 'error' | 'success';
  message: string;
  field?: ContactField;
};

const contactTypes = ['採用に関するご連絡', '業務委託・協業のご相談', '制作実績に関するお問い合わせ', 'ブログ・メディアに関するお問い合わせ', 'その他'];

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getText(formData: FormData, name: ContactField) {
  const value = formData.get(name);
  return typeof value === 'string' ? value.trim() : '';
}

export async function createContactData(_prevState: ContactFormState, formData: FormData): Promise<ContactFormState> {
  const rawFormData = {
    namae: getText(formData, 'namae'),
    furigana: getText(formData, 'furigana'),
    email: getText(formData, 'email'),
    item: getText(formData, 'item'),
    message: getText(formData, 'message'),
  };

  if (!rawFormData.namae) return { status: 'error', message: 'お名前を入力してください。', field: 'namae' };
  if (!rawFormData.furigana) return { status: 'error', message: 'ふりがなを入力してください。', field: 'furigana' };
  if (!rawFormData.email) return { status: 'error', message: 'メールアドレスを入力してください。', field: 'email' };
  if (!validateEmail(rawFormData.email)) return { status: 'error', message: 'メールアドレスの形式を確認してください。', field: 'email' };
  if (!rawFormData.item || !contactTypes.includes(rawFormData.item)) return { status: 'error', message: 'お問い合わせ項目を選択してください。', field: 'item' };
  if (!rawFormData.message) return { status: 'error', message: 'お問い合わせ内容を入力してください。', field: 'message' };

  const portalId = process.env.HUBSPOT_PORTAL_ID;
  const formId = process.env.HUBSPOT_FORM_ID;

  if (!portalId || !formId) {
    return { status: 'error', message: '現在フォームを送信できません。時間をおいて再度お試しください。' };
  }

  try {
    const result = await fetch(`https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fields: Object.entries(rawFormData).map(([name, value]) => ({
          objectTypeId: '0-1',
          name,
          value,
        })),
      }),
    });

    if (!result.ok) {
      return { status: 'error', message: 'お問い合わせを送信できませんでした。入力内容を確認して、もう一度お試しください。' };
    }
  } catch {
    return { status: 'error', message: '通信エラーが発生しました。時間をおいて再度お試しください。' };
  }

  return { status: 'success', message: 'お問い合わせを受け付けました。' };
}
