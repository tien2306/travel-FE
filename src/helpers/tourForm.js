/**
 * Chuẩn bị payload (FormData hoặc JSON) để tạo mới hoặc cập nhật Tour
 * @param {Object} values - Các giá trị từ Form (name, price, startDate, thumbnail, images,...)
 * @returns {Object} { isFormData: boolean, payload: FormData | Object }
 */
export const buildTourPayload = (values) => {
  // console.log(values);
  // Chuyển đổi ngày
  const formattedStartDate = values.startDate
    ? values.startDate.toISOString()
    : "";
  const formattedEndDate = values.endDate ? values.endDate.toISOString() : "";

  // Kiểm tra có upload ảnh mới không
  const hasNewThumbnail =
    values.thumbnail &&
    values.thumbnail.length > 0 &&
    values.thumbnail[0]?.originFileObj;
  // trong antd khi tạo ảnh nó sẽ sinh ra originFileObj
  // chỉ cần kt nó xem có nó ko ? có -> true ko -> false

  const hasNewImages =
    values.images &&
    values.images.length > 0 &&
    values.images.some((file) => file.originFileObj);
  // trong antd khi tạo ảnh nó sẽ sinh ra originFileObj
  // chỉ cần kt 1 p tử có originFileObj ko ? có -> true ko -> false

  if (hasNewThumbnail || hasNewImages) {
    // TRƯỜNG HỢP 1: CÓ ĐỔI ẢNH (hoặc THÊM MỚI ẢNH) -> Dùng FormData gửi multipart/form-data
    const formData = new FormData();

    formData.append("name", values.name);
    formData.append("slug", values.slug || "");
    formData.append("price", String(values.price));
    formData.append("quantity", String(values.quantity));
    formData.append("sold", String(values.sold || 0));
    formData.append("departurePlace", values.departurePlace || "");
    formData.append("destination", values.destination || "");
    formData.append("shortDesc", values.shortDesc || "");
    formData.append("detailDesc", values.detailDesc || "");
    formData.append("status", values.status || "ACTIVE");
    formData.append("category", values.category || "");
    formData.append("transport", values.transport || "");

    if (formattedStartDate) formData.append("startDate", formattedStartDate);
    if (formattedEndDate) formData.append("endDate", formattedEndDate);

    // Thumbnail (single file)
    if (values.thumbnail && values.thumbnail.length > 0) {
      if (values.thumbnail[0].originFileObj) {
        formData.append("thumbnail", values.thumbnail[0].originFileObj); // Gửi FILE THẬT
      } else if (values.thumbnail[0].name) {
        formData.append("thumbnail", values.thumbnail[0].name); // Gửi cái TÊN ẢNH CŨ
      }
    }

    // Images (multiple files)
    if (values.images && values.images.length > 0) {
      // 2. GIỮ LẠI ẢNH CŨ: Duyệt qua mảng ảnh cũ (những ảnh KHÔNG có originFileObj) và lấy ra cái Tên/URL
      const oldImages = values.images
        .filter((file) => !file.originFileObj)
        .map((file) => file.name);

      oldImages.forEach((url) => {
        formData.append("images", url); // Gửi chuỗi URL
      });

      // 3. THÊM ẢNH MỚI: Duyệt qua mảng ảnh mới (những ảnh CÓ originFileObj)
      const newFiles = values.images
        .filter((file) => file.originFileObj)
        .map((file) => file.originFileObj);

      newFiles.forEach((file) => {
        formData.append("images", file); // Gửi đối tượng File vật lý
      });
    }

    return {
      isFormData: true,
      payload: formData,
    };
  } else {
    // TRƯỜNG HỢP 2: KHÔNG CÓ ẢNH MỚI -> Gửi JSON thuần
    const oldImages = values.images
      ? values.images
          .filter((file) => !file.originFileObj)
          .map((file) => file.name)
      : [];

    const createData = {
      name: values.name,
      slug: values.slug || "",
      price: Number(values.price),
      quantity: Number(values.quantity),
      sold: Number(values.sold || 0),
      departurePlace: values.departurePlace || "",
      destination: values.destination || "",
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      status: values.status || "ACTIVE",
      shortDesc: values.shortDesc ?? "",
      detailDesc: values.detailDesc ?? "",
      category: values.category || "",
      transport: values.transport || "",
      thumbnail:
        values.thumbnail && values.thumbnail.length > 0
          ? values.thumbnail[0].name
          : "",
    };

    // Chỉ gửi images nếu có ảnh cũ, tránh gửi [] gây lỗi BE
    if (oldImages.length > 0) {
      createData.images = oldImages;
    }

    return {
      isFormData: false,
      payload: createData,
    };
  }
};
