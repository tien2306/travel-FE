// Hàm lấy cookie
export function getCookie(name) {
  let nameEQ = name + "=";
  let ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

// Hàm tạo cookie
export function setCookie(name, value, days) {
  let expires = "";
  if (days) {
    let date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

// Hàm xóa 1 cookie
export function deleteCookie(name) {
  document.cookie = name + "=; Max-Age=-99999999; path=/";
}

//Hàm xóa toàn bộ
export function deleteAllCookies() {
  // 1. Lấy tất cả cookie và tách chúng thành mảng
  let cookies = document.cookie.split(";");

  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i];
    // 2. Tìm vị trí dấu "=" để lấy tên cookie
    let eqPos = cookie.indexOf("=");
    // 3. Cắt chuỗi để lấy tên và xóa khoảng trắng thừa
    let name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    name = name.trim();

    // 4. Xóa cookie bằng cách đặt Max-Age=-99999999 cho đường dẫn hiện tại
    document.cookie = name + "=; Max-Age=-99999999; path=/";
  }
}
