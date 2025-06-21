import { NextResponse } from 'next/server'; // NextResponse kullanımı
import User from '../../../../backend/models/User'; // MongoDB modelini kullanıyoruz
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

export async function POST(req) {
  try {
    // Veriyi JSON formatında alıyoruz
    const { username, password } = await req.json();

    // Alanların boş olup olmadığını kontrol et
    if (!username || !password) {
      return NextResponse.json({ message: 'Kullanıcı adı ve şifre gereklidir' }, { status: 400 });
    }

    // Kullanıcıyı veritabanında arıyoruz
    const user = await User.findOne({ username });
    if (!user) {
      return NextResponse.json({ message: 'Kullanıcı bulunamadı' }, { status: 400 });
    }

    // Şifreyi kontrol et (bcrypt ile hash'lenmiş şifreyi karşılaştırıyoruz)
    const isMatch = await bcrypt.compare(password, user.password);  // Hash'lenmiş şifreyi karşılaştırıyoruz
    console.log(isMatch)
    if (!isMatch) {
      return NextResponse.json({ message: 'Şifre yanlış' }, { status: 400 });
    }
       
    // JWT token oluşturuyoruz
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Başarılı giriş sonucu
    return NextResponse.json({ message: 'Giriş başarılı', token, userId: user._id }, { status: 200 });

  } catch (err) {
    // Sunucu hatası durumunda
    console.error(err); // Hata mesajını daha ayrıntılı görmek için konsola yazdırabiliriz
    return NextResponse.json({ message: 'Sunucu hatası' }, { status: 500 });
  }
}
