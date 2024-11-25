'use server';

function validateEmail(email: string) {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
}

export async function createContactData(_prevState: any, formData: FormData) {
  // formのname属性ごとにformData.get()で値を取り出すことができる
  const rawFormData = {
    namae: formData.get('namae') as string,
    email: formData.get('email') as string,
  };

  if (!rawFormData.namae) {
    return {
      status: 'error',
      message: '名前を入力してください',
    };
  }
  if (!rawFormData.email) {
    return {
      status: 'error',
      message: 'メールアドレスを入力してください',
    };
  }
  if (!validateEmail(rawFormData.email)) {
    return {
      status: 'error',
      message: 'メールアドレスの形式が誤っています',
    };
  }

  const result = await fetch(`https://api.hsforms.com/submissions/v3/integration/submit/${process.env.HUBSPOT_PORTAL_ID}/${process.env.HUBSPOT_FORM_ID}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      fields: [
        {
          objectTypeId: '0-1',
          name: 'namae',
          value: rawFormData.namae,
        },
        {
          objectTypeId: '0-1',
          name: 'email',
          value: rawFormData.email,
        },
      ],
    }),
  });

  try {
    await result.json();
  } catch (e) {
    console.log(e);
    return {
      status: 'error',
      message: 'お問い合わせに失敗しました',
    };
  }

  return { status: 'success', message: 'OK' };
}
