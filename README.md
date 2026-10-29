# SQL Thám Tử 🔍 (Vietnamese SQL Noir)

Nền tảng học và luyện tập tư duy truy vấn cơ sở dữ liệu SQL thông qua giải mã các vụ án trinh thám hình sự hấp dẫn, chạy 100% trên trình duyệt với SQLite WebAssembly.

---

## 🌟 Điểm Nổi Bật

- ⚡ **Chạy trực tiếp trên trình duyệt (In-Browser SQLite WebAssembly)**: Sử dụng `sql.js` để thực thi câu lệnh SQL trực tiếp trên RAM máy khách. Tốc độ cực nhanh (chỉ mất ~0.5ms/truy vấn), không cần kết nối máy chủ database ngoài, bảo mật và an toàn tuyệt đối.
- 🕸️ **Sơ Đồ Thực Thể Quan Hệ Trực Quan (Interactive ER Diagram)**: Tích hợp thư viện `ReactFlow` cho phép quan sát lược đồ quan hệ giữa các bảng (khóa chính PK, khóa ngoại FK), hỗ trợ phóng to/thu nhỏ, kéo thả sắp xếp các bảng tự do.
- 🎨 **Trình Soạn Thảo SQL Thông Minh (Syntax Highlighting)**: Tự động tô màu cú pháp thời gian thực cho từ khóa SQL, hàm, chuỗi, số và ghi chú. Hỗ trợ phím tắt `Ctrl + Enter` (hoặc `Cmd + Enter`), định dạng tự động và phím tắt chèn nhanh cú pháp.
- 📂 **Hồ Sơ Vụ Án & Manh Mối Không Tiết Lộ Đáp Án**: Cung cấp gợi ý tư duy logic từng bước để người học tự mình suy luận và viết truy vấn khám phá chân tướng.
- 📝 **Sổ Tay Điều Tra (Local-first Notebook)**: Tự động lưu ghi chép, suy luận phá án của thám tử vào trình duyệt.
- 🎯 **Cơ Chế Phá Án & Thăng Hạng Thám Tử**: Kiểm tra đáp án, bắn pháo hoa ăn mừng khi phá án thành công, cộng điểm kinh nghiệm (XP) và thăng hạng từ *Thám Tử Tập Sự* đến *Thần Thám Bậc Thầy*.

---

## 🕵️ Danh Sách Vụ Án Trọng Điểm

1. 🔎 **Vụ Án 1: Chiếc Cặp Mất Tích Tại Quán Bar Đêm**
   - **Độ khó**: Dễ (Nhập môn)
   - **Kỹ năng rèn luyện**: `SELECT`, `WHERE`, `LIKE`, phép lọc chuỗi ký tự.
   - **Bối cảnh**: Chiếc cặp tài liệu tuyệt mật biến mất tại quán bar "Đêm Không Ngủ". Lần theo đặc điểm nhận dạng nhân chứng cung cấp để vạch mặt kẻ trộm.

2. 💎 **Vụ Án 2: Vụ Trộm Kim Cương Bảo Tàng Hoàng Gia**
   - **Độ khó**: Trung bình
   - **Kỹ năng rèn luyện**: `INNER JOIN`, `BETWEEN`, `DATETIME`, đối chiếu nhiều bảng.
   - **Bối cảnh**: Viên kim cương "Ngôi Sao Phương Đông" bị đánh cắp lúc cúp điện. Đối soát nhật ký quẹt thẻ an ninh và dòng tiền giao dịch ngân hàng bất thường để tìm nội gián.

3. 🍷 **Vụ Án 3: Bí Ẩn Vụ Ám Sát Trong Biệt Thự Cổ**
   - **Độ khó**: Nâng cao
   - **Kỹ năng rèn luyện**: `Subquery`, Bằng chứng pháp y sinh trắc học, Ghép nối đa bảng.
   - **Bối cảnh**: Triệu phú bị đầu độc trong phòng đọc sách. Phân tích vân tay, góc thuận tay trái, lịch trình camera và cuộc gọi chợ đen lúc nửa đêm để bắt kẻ chủ mưu.

---

## 🛠️ Công Nghệ Sử Dụng

- **Frontend Core**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Lucide React Icons
- **Database Engine**: `sql.js` (SQLite compiled to WebAssembly)
- **Diagram Visualizer**: ReactFlow
- **Hiệu Ứng Ăn Mừng**: Canvas Confetti
- **Phông Chữ Chuẩn Hóa**: `Be Vietnam Pro` (Unicode NFC tiếng Việt) & `JetBrains Mono`

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Thử

### Yêu Cầu
- Node.js version 18 trở lên.

### Các Bước Thực Hiện

1. **Clone repository:**
   ```bash
   git clone https://github.com/Annalala3107/sqlearn.git
   cd sqlearn
   ```

2. **Cài đặt các thư viện phụ thuộc:**
   ```bash
   npm install
   ```

3. **Khởi chạy máy chủ phát triển (Development Server):**
   ```bash
   npm run dev
   ```

4. **Mở trình duyệt:**
   Truy cập vào địa chỉ [http://localhost:3000](http://localhost:3000) và bắt đầu hành trình phá án!

5. **Đóng gói dự án (Production Build):**
   ```bash
   npm run build
   ```
