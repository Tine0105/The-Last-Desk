Ok, mình dịch **đầy đủ sang tiếng Việt**, giữ đúng nội dung kỹ thuật **nhưng pha thêm chút dễ thương – thân thiện – đúng vibe game**, và **chừa sẵn chỗ cho 5 tác giả** để bạn điền sau 👀✨

---

# 📜 **Last Deck Chronicles**

✨ **Bước vào một cuộc phiêu lưu hoành tráng trong Last Deck Chronicles!** ✨
Đây là một **ứng dụng web** được xây dựng bằng **React** và chạy trên **blockchain Sui**, nơi người chơi có thể quản lý tài sản trong game và tương tác trực tiếp với **smart contract** ngay trên trình duyệt.

Dự án sử dụng **Supabase** cho backend, kết hợp với một **tech stack hiện đại** để mang lại trải nghiệm mượt mà, trực quan và “chơi là ghiền” 🎴🔥

---

## 🚀 **Tính năng nổi bật**

* 🔗 **Tích hợp Blockchain Sui**
  Tương tác mượt mà với blockchain Sui để quản lý trạng thái người chơi và các giao dịch trong game.

* 👛 **Kết nối ví Sui**
  Dễ dàng kết nối ví bằng `@suiet/wallet-kit` để quản lý tài sản và ký giao dịch.

* 🎨 **Giao diện React hiện đại**
  UI responsive, thân thiện, được xây dựng bằng **React** và **Tailwind CSS**.

* 🗄️ **Backend Supabase**
  Lưu trữ dữ liệu, xác thực người dùng và cập nhật real-time một cách nhanh gọn.

* 🃏 **Dữ liệu thẻ bài & Boss**
  Hệ thống dữ liệu phong phú cho thẻ bài và boss – nền tảng cho gameplay cốt lõi.

* 🧭 **Điều hướng phía client**
  Di chuyển mượt mà giữa các trang với `react-router-dom`.

* 🔔 **Hệ thống thông báo realtime**
  Nhận thông báo tức thì với **Toaster** và **Sonner**.

* 🧠 **TypeScript**
  Viết bằng TypeScript giúp code dễ bảo trì, dễ mở rộng và ít bug hơn 💙

---

## 🛠️ **Công nghệ sử dụng**

| Nhóm       | Công nghệ               | Mô tả                                  |
| ---------- | ----------------------- | -------------------------------------- |
| Frontend   | React                   | Thư viện JavaScript xây dựng giao diện |
|            | TypeScript              | JavaScript + kiểu dữ liệu tĩnh         |
|            | Tailwind CSS            | CSS utility-first cho UI nhanh & gọn   |
|            | Radix UI                | UI primitives dễ tiếp cận              |
|            | Shadcn UI               | Component tái sử dụng dựa trên Radix   |
|            | React Router DOM        | Điều hướng phía client                 |
|            | Lucide React            | Bộ icon đơn giản, đẹp                  |
|            | React Hook Form         | Xử lý form hiệu quả                    |
|            | Zod                     | Validate schema theo TypeScript        |
| Backend    | Supabase                | Database, Auth, Realtime               |
| Blockchain | Sui                     | Blockchain Layer 1 nhanh & an toàn     |
|            | `@mysten/dapp-kit`      | Toolkit build dApp trên Sui            |
|            | `@mysten/sui`           | SDK tương tác blockchain Sui           |
| Build Tool | Vite                    | Công cụ build frontend thế hệ mới      |
| State      | `@tanstack/react-query` | Quản lý state async                    |
| Wallet     | `@suiet/wallet-kit`     | Kết nối ví Sui                         |
| Khác       | cva                     | Quản lý className type-safe            |
|            | tailwind-merge          | Gộp class Tailwind thông minh          |
|            | date-fns                | Thư viện xử lý thời gian               |

---

## 📦 **Bắt đầu nhanh**

### ✅ Yêu cầu trước

* Node.js (v18 trở lên)
* npm hoặc yarn
* Sui Wallet

---

### 📥 Cài đặt

1. Clone repo:

```bash
git clone <repository-url>
cd last-deck-chronicles
```

2. Cài dependencies:

```bash
npm install
# hoặc
yarn install
```

3. Tạo file `.env` và thêm thông tin Supabase:

```
VITE_SUPABASE_PROJECT_ID=...
VITE_SUPABASE_PUBLISHABLE_KEY=...
VITE_SUPABASE_URL=...
```

---

### ▶️ Chạy local

```bash
npm run dev
# hoặc
yarn dev
```

Mở trình duyệt và truy cập:
👉 **[http://localhost:8080](http://localhost:8080)**

---

## 💻 **Cấu trúc dự án**

```text
last-deck-chronicles/
├── src/
│   ├── components/        # UI components tái sử dụng
│   ├── data/              # Dữ liệu game (cards, bosses)
│   ├── integrations/      # Supabase
│   ├── pages/             # Các trang chính
│   ├── providers/         # Context providers
│   ├── web3/              # Logic blockchain Sui
│   └── types/             # Định nghĩa type
```

---

## 📸 **Ảnh minh họa**

*(Thêm screenshot UI/gameplay tại đây cho xịn nhé ✨)*

---

## 🤝 **Đóng góp**

Rất hoan nghênh mọi đóng góp 💖

1. Fork repo
2. Tạo branch mới
3. Commit với message rõ ràng
4. Gửi Pull Request

---

## 📝 **Giấy phép**

Dự án sử dụng **MIT License**.

---

## 👥 **Tác giả**

Dự án được thực hiện bởi nhóm **5 thành viên**:

* 👤 **Author 1:** ……………………………
* 👤 **Author 2:** ……………………………
* 👤 **Author 3:** ……………………………
* 👤 **Author 4:** ……………………………
* 👤 **Author 5:** ……………………………

---

## 📬 **Liên hệ**

Có câu hỏi hay góp ý?
📧 Email: `your-email@example.com`

---

## 💖 **Lời cảm ơn**

Cảm ơn bạn đã ghé thăm **Last Deck Chronicles**!
Hy vọng bạn sẽ thích dự án này và cùng chúng mình phát triển nó xa hơn nữa 🚀✨
