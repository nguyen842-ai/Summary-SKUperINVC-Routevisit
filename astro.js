// File: api/astro.js
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Chỉ chấp nhận phương thức POST' });
    }

    // 1. Điền thông tin AstrologyAPI của bạn vào đây
    // Khuyến cáo: Sau khi test thành công, hãy đưa 2 dòng này vào biến môi trường (Environment Variables) trên Vercel
    const USER_ID = '654903';
    const API_KEY = 'ak-5df21bcc62e7e783d73230cefdc6cab3563115a3';
    
    // Tạo mã xác thực Basic Auth theo chuẩn của AstrologyAPI
    const authString = Buffer.from(`${USER_ID}:${API_KEY}`).toString('base64');

    // Nhận dữ liệu từ form HTML gửi lên
    const { day, month, year, hour, min, lat, lon, tzone } = req.body;

    const dataPayload = {
        day: parseInt(day),
        month: parseInt(month),
        year: parseInt(year),
        hour: parseInt(hour),
        min: parseInt(min),
        lat: parseFloat(lat),
        lon: parseFloat(lon),
        tzone: parseFloat(tzone)
    };

    try {
        // Gọi API của AstrologyAPI (Sử dụng endpoint xuất ảnh Western Chart)
        const astroResponse = await fetch('https://json.astrologyapi.com/v1/western_horoscope', {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${authString}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataPayload)
        });

        const data = await astroResponse.json();
        
        // Trả kết quả về cho frontend (index.html)
        return res.status(200).json(data);

    } catch (error) {
        console.error("Lỗi gọi AstrologyAPI:", error);
        return res.status(500).json({ error: "Lỗi kết nối máy chủ chiêm tinh" });
    }
}
