import { useState, useEffect } from "react";
import { Form, Button, Modal, Image, message } from "antd";
import { EditOutlined, CheckOutlined } from "@ant-design/icons";
import { updateTour } from "../../../services/tour";
import { patch } from "../../../utils/request";
import { IMAGE_URLS } from "../../../constants/api";
import FormMainInputs from "../../../components/Admin/CreateTourModal/FormMainInputs";
import FormSideConfigs from "../../../components/Admin/CreateTourModal/FormSideConfigs";
import dayjs from "dayjs";

function EditTour(props) {
  const { record, onReload } = props;
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  // File list cho thumbnail (single) và images (multiple)
  const [thumbnailFileList, setThumbnailFileList] = useState([]);
  const [imagesFileList, setImagesFileList] = useState([]);

  // State preview ảnh
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewSrc, setPreviewSrc] = useState("");

  // Fill dữ liệu cũ vào form khi mở modal
  useEffect(() => {
    if (showModal && record) {
      form.setFieldsValue({
        name: record.name,
        slug: record.slug || "",
        price: record.price ? Number(record.price) : undefined,
        quantity: record.quantity,
        sold: record.sold || 0,
        departurePlace: record.departurePlace,
        destination: record.destination,
        startDate: record.startDate ? dayjs(record.startDate) : undefined,
        endDate: record.endDate ? dayjs(record.endDate) : undefined,
        status: record.status,
        shortDesc: record.shortDesc,
        detailDesc: record.detailDesc,

        // Pre-fill thumbnail cũ
        thumbnail: record.thumbnail
          ? [
              {
                uid: "-1", // ID tự chế để Ant Design phân biệt các file ảnh với nhau
                name: record.thumbnail, // Tên file ảnh
                status: "done", // Trạng thái 'done' nghĩa là ảnh này đã tải lên thành công rồi
                url: `${IMAGE_URLS.TOURS}${record.thumbnail?.trim()}`, // Đường dẫn tuyệt đối để hiển thị ảnh lên màn hình
              },
            ]
          : [],

        // Pre-fill images cũ (nếu có)
        images:
          record.images && record.images.length > 0
            ? record.images.map((img, index) => ({
                uid: `-${index + 2}`,
                name: img,
                status: "done",
                url: `${IMAGE_URLS.TOURS}${img?.trim()}`,
              }))
            : [],
      });

      setThumbnailFileList(
        record.thumbnail
          ? [
              {
                uid: "-1",
                name: record.thumbnail,
                status: "done",
                url: `${IMAGE_URLS.TOURS}${record.thumbnail?.trim()}`,
              },
            ]
          : [],
      );

      setImagesFileList(
        record.images && record.images.length > 0
          ? record.images.map((img, index) => ({
              uid: `-${index + 2}`,
              name: img,
              status: "done",
              url: `${IMAGE_URLS.TOURS}${img?.trim()}`,
            }))
          : [],
      );
    }
  }, [showModal, record, form]);

  const handleShowModal = () => setShowModal(true);

  const handleCancel = () => {
    setShowModal(false);
    form.resetFields();
    setThumbnailFileList([]);
    setImagesFileList([]);
  };

  const handleThumbnailChange = ({ fileList }) => {
    setThumbnailFileList(fileList);
  };

  const handleImagesChange = ({ fileList }) => {
    setImagesFileList(fileList);
  };

  // Xem trước ảnh (dùng chung cho thumbnail và images)
  const handlePreview = (file) => {
    // TRƯỜNG HỢP 1: Ảnh đã có sẵn link trên mạng (Ảnh cũ lấy từ database/server)
    if (file.url) {
      setPreviewSrc(file.url);
      setPreviewOpen(true);
      return;
    }

    // TRƯỜNG HỢP 2: Ảnh mới chọn từ máy tính và ĐÃ ĐƯỢC ĐỌC TRƯỚC ĐÓ RỒI
    if (file.preview) {
      // Nếu có sẵn preview rồi thì mở luôn
      setPreviewSrc(file.preview);
      setPreviewOpen(true);
    } else {
      // Nếu chưa có thì
      // FileReader: công cụ có sẵn trong trình duyệt giúp đọc nội dung của các tệp (như file ảnh, văn bản).
      const reader = new FileReader();

      // Lệnh bắt đầu đọc tệp gốc trong máy tính và chuyển đổi nó thành một chuỗi mã hóa Base64
      reader.readAsDataURL(file.originFileObj);

      // Đăng ký sự kiện: Khi nào trình duyệt đọc file THÀNH CÔNG thì mới kích hoạt đoạn code bên dưới
      reader.onload = () => {
        file.preview = reader.result; // Lưu lại chuỗi Base64
        setPreviewSrc(file.preview); // Cập nhật state để hiển thị
        setPreviewOpen(true); // Mở popup
      };
    }
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      let res;

      // Chuyển đổi ngày
      const formattedStartDate = values.startDate
        ? values.startDate.toISOString()
        : "";
      const formattedEndDate = values.endDate
        ? values.endDate.toISOString()
        : "";

      // Kiểm tra có đổi ảnh mới không (thumbnail hoặc images)
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
        // TRƯỜNG HỢP 1: CÓ ĐỔI ẢNH -> Dùng FormData gửi multipart/form-data
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("slug", values.slug || "");
        formData.append("price", String(values.price));
        formData.append("quantity", String(values.quantity));
        formData.append("sold", String(values.sold || 0));
        formData.append("departurePlace", values.departurePlace || "");
        formData.append("destination", values.destination || "");
        formData.append("startDate", formattedStartDate);
        formData.append("endDate", formattedEndDate);
        formData.append("status", values.status || "ACTIVE");
        formData.append("shortDesc", values.shortDesc || "");
        formData.append("detailDesc", values.detailDesc || "");

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

          // THỦ THUẬT FIX LỖI VALIDATE ARRAY KHI CÓ ĐÚNG 1 ẢNH CŨ
          // if (oldImages.length === 1) {
          //   formData.append("images", oldImages[0]);
          // }

          // 3. THÊM ẢNH MỚI: Duyệt qua mảng ảnh mới (những ảnh CÓ originFileObj)
          const newFiles = values.images
            .filter((file) => file.originFileObj)
            .map((file) => file.originFileObj);
          newFiles.forEach((file) => {
            formData.append("images", file); // Gửi đối tượng File vật lý
          });
        }

        res = await updateTour(record.key, formData);
      } else {
        // TRƯỜNG HỢP 2: KHÔNG ĐỔI ẢNH -> Gửi JSON thuần
        const updateData = {
          name: values.name,
          slug: values.slug || "",
          price: String(values.price),
          quantity: values.quantity,
          sold: values.sold || 0,
          departurePlace: values.departurePlace || "",
          destination: values.destination || "",
          startDate: formattedStartDate,
          endDate: formattedEndDate,
          status: values.status || "ACTIVE",
          shortDesc: values.shortDesc || "",
          detailDesc: values.detailDesc || "",
          thumbnail:
            values.thumbnail && values.thumbnail.length > 0
              ? values.thumbnail[0].name
              : "",
          images: values.images
            ? values.images
                .filter((file) => !file.originFileObj)
                .map((file) => file.name)
            : [],
        };

        res = await patch(updateData, `tours/${record.key}`);
      }

      if (res && res.success) {
        messageApi.success("Cập nhật tour thành công!");
        setShowModal(false);
        onReload();
      } else {
        messageApi.error(
          res?.message || "Cập nhật không thành công từ máy chủ!",
        );
      }
    } catch (error) {
      messageApi.error("Lỗi kết nối hệ thống!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {contextHolder}

      {/* Image ẩn để kích hoạt preview lightbox - Đã bọc kiểm tra rỗng và đổi phương thức */}
      {previewSrc && (
        <Image
          style={{ display: "none" }}
          src={previewSrc}
          preview={{
            open: previewOpen,
            onOpenChange: (open) => setPreviewOpen(open),
          }}
        />
      )}

      <Button
        type="primary"
        icon={<EditOutlined />}
        onClick={handleShowModal}
      />

      <Modal
        title="Chỉnh sửa tour"
        open={showModal}
        onCancel={handleCancel}
        footer={null}
        destroyOnHidden={true}
        width={900}
      >
        <Form
          form={form}
          name="edit-tour"
          className="modern-tour-form"
          onFinish={handleSubmit}
          layout="vertical"
        >
          <div className="form-grid-layout">
            {/* Cột trái: các trường chính */}
            <FormMainInputs />

            {/* Cột phải: cấu hình + upload */}
            <FormSideConfigs
              thumbnailFileList={thumbnailFileList}
              imagesFileList={imagesFileList}
              onThumbnailChange={handleThumbnailChange}
              onImagesChange={handleImagesChange}
              onPreview={handlePreview}
            />
          </div>

          <div
            className="form-action-footer"
            style={{
              marginTop: "20px",
              display: "flex",
              justifyContent: "flex-end",
              gap: "10px",
            }}
          >
            <Button onClick={handleCancel} size="large">
              Hủy
            </Button>
            <Button
              loading={loading}
              type="primary"
              htmlType="submit"
              icon={<CheckOutlined />}
              size="large"
              className="btn-submit"
            >
              Cập nhật tour
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
}

export default EditTour;
