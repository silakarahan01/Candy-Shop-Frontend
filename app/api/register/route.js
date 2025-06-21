import { NextResponse } from 'next/server'; // Use the new NextResponse
import User from '../../../../backend/models/User'; // Database model (MongoDB gibi)

export async function POST(req) {
  try {
    const { username, email, phone, password } = await req.json();

    // Alanların boş olup olmadığını kontrol et
    if (!username || !email || !phone || !password) {
      return NextResponse.json({ message: 'Lütfen Alanları Boş Bırakmayınız!' }, { status: 400 });
    }

    // username sadece harf içermelidir (sadece rakam ise hata mesajı)
    if (/^\d+$/.test(username)) { // sadece rakam kontrolü
      return NextResponse.json({ message: 'Kullanıcı adı sadece harflerden oluşmalıdır.' }, { status: 400 });
    }

    // Telefon numarası sadece rakam olmalı
    if (!/^\d+$/.test(phone)) {
      return NextResponse.json({ message: 'Telefon numarası sadece rakamlardan oluşmalıdır.' }, { status: 400 });
    }

    // Aynı email ya da telefon numarasıyla kaydın olup olmadığını kontrol et
    const existingUserByEmail = await User.findOne({ email });
    const existingUserByPhone = await User.findOne({ phone });

    if (existingUserByEmail) {
      return NextResponse.json({ message: 'Bu email adresi zaten kayıtlı' }, { status: 400 });
    }

    if (existingUserByPhone) {
      return NextResponse.json({ message: 'Bu telefon numarası zaten kayıtlı' }, { status: 400 });
    }

    // Yeni kullanıcıyı oluştur ve kaydet
    const user = new User({ username, email, phone, password });
    await user.save();

    return NextResponse.json({ message: 'Kullanıcı başarıyla kaydedildi' }, { status: 201 });

  } catch (err) {
    return NextResponse.json({ message: 'Sunucu hatası' }, { status: 500 });
  }
}
