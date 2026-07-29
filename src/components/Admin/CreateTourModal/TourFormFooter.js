import { Button } from "antd";
import { CheckOutlined, RedoOutlined } from "@ant-design/icons";

function TourFormFooter({
  currentStep,
  loading,
  isEditMode,
  form,
  onCancel,
  onPrevStep,
  onNextStep,
  onResetAll,
}) {
  return (
    <div
      className="form-action-footer"
      style={{
        display: "flex",
        justifyContent: "flex-end", // Căn phải nếu là EditMode, nếu có onResetAll thì sẽ có margin tự nhiên hoặc dùng gap
        gap: "10px",
        borderTop: "none",
        paddingTop: 0,
        marginTop: 0,
        ...(onResetAll ? { justifyContent: "space-between" } : {}),
      }}
    >
      {onResetAll ? (
        <Button
          className="btn-reset"
          icon={<RedoOutlined />}
          onClick={onResetAll}
          size="large"
        >
          Làm mới form
        </Button>
      ) : (
        <Button onClick={onCancel} size="large">
          Hủy
        </Button>
      )}

      <div style={{ display: "flex", gap: "10px" }}>
        {currentStep > 0 && (
          <Button onClick={onPrevStep} size="large">
            Trở lại
          </Button>
        )}
        
        {currentStep < 2 && (
          <Button type="primary" onClick={onNextStep} size="large">
            Tiếp tục
          </Button>
        )}
        
        {currentStep === 2 && (
          <Button
            loading={loading}
            type="primary"
            onClick={() => form.submit()}
            icon={<CheckOutlined />}
            size="large"
            className="btn-submit"
          >
            {isEditMode ? "Cập nhật tour" : "Tạo tour"}
          </Button>
        )}
      </div>
    </div>
  );
}

export default TourFormFooter;
