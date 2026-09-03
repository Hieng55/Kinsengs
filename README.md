# Kinsengs — Premium Wellness Website

Website giới thiệu sản phẩm không có giỏ hàng, xây dựng bằng React, Vite và GSAP. Danh mục và trang chi tiết lấy dữ liệu công khai từ WooCommerce Store API; khóa quản trị và Consumer Secret không được sử dụng trong frontend.

## Chạy local

```bash
npm install
npm run dev
```

Vite proxy `/wp-json` tới `https://kinsengs.com` trong môi trường local. Bản production mặc định dùng API cùng origin, phù hợp khi triển khai trên chính `kinsengs.com`.

## Build production

```bash
npm run build
```

File build nằm trong `dist/`. Máy chủ cần cấu hình SPA fallback về `index.html` cho các đường dẫn như `/san-pham/:slug`.

Nếu triển khai trên domain khác, đặt biến môi trường `VITE_WP_API_URL` và cấu hình CORS ở WordPress hoặc dùng reverse proxy cùng origin.

## Deploy Vietnix cPanel

Repository có `.cpanel.yml` để copy bản build đã commit từ `dist/` vào `$HOME/public_html` mà không xóa các thư mục WordPress. File `public/.htaccess` ưu tiên React ở frontend nhưng vẫn giữ `/wp-json`, `/wp-admin`, `/wp-content` và các file hệ thống WordPress hoạt động.

Trong **cPanel > Git Version Control**, clone repository vào một thư mục ngoài `public_html`, chọn nhánh `master`, sau đó dùng **Update from Remote** và **Deploy HEAD Commit**. Lần deploy đầu tiên tự sao lưu `.htaccess` hiện tại vào `$HOME/.kinsengs-wordpress-htaccess.backup`.

## Luồng liên hệ

Website không hiển thị giá, giỏ hàng hay nút mua. Luồng liên hệ ưu tiên gọi số `(346) 347-5571` qua liên kết `tel:+13463475571`; form email được giữ làm lựa chọn yêu cầu gọi lại. Có thể thay handler trong `src/App.jsx` bằng CRM/form endpoint chính thức khi endpoint đó sẵn sàng.

## Lưu ý nội dung

Nội dung mô tả kỹ thuật được đồng bộ từ WordPress và làm sạch trước khi hiển thị. Cảnh báo bắt buộc cho thực phẩm bảo vệ sức khỏe xuất hiện ở footer và trang chi tiết. Cần rà lại nội dung công bố của từng sản phẩm trước khi website chính thức hoạt động.
