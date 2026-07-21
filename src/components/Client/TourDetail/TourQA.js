import React from "react";
import { Input } from "antd";
import { MessageOutlined, ClockCircleOutlined } from "@ant-design/icons";
import "./TourQA.scss";

const { TextArea } = Input;

const DUMMY_QA = [
  {
    id: 1,
    user: "Ti Tu",
    question: "Tour này có đón khách ở sân bay không ạ?",
    time: "6 ngày trước",
    reply: "Dạ bên em có hỗ trợ xe đưa rước tại sân bay nhé.\nNhân viên sẽ liên hệ lại để chốt giờ đón cho mình nhé.\nCảm ơn mình đã quan tâm đến TravelApp.",
    replyTime: "6 ngày trước",
  },
  {
    id: 2,
    user: "Thanh Tuyen",
    question: "Chào bạn cho mình hỏi là nếu mình ăn chay thì có menu riêng không ạ?",
    time: "1 tháng trước",
    reply: "TravelApp xin chào chị Thanh Tuyen\nDạ có ạ, vui lòng báo trước lúc đặt vé để công ty chuẩn bị menu chay chuẩn cho bạn nhé.\nThân mến",
    replyTime: "1 tháng trước",
  },
];

const TourQA = () => {
  return (
    <div id="tour-qa" className="tour-qa-section">
      <h2 className="section-title">Hỏi đáp</h2>
      
      <div className="qa-form">
        <TextArea rows={3} placeholder="Mời bạn để lại bình luận..." />
        <button className="btn-submit-qa">GỬI CÂU HỎI</button>
      </div>

      <div className="qa-list">
        {DUMMY_QA.map((qa) => (
          <div key={qa.id} className="qa-item">
            {/* Câu hỏi */}
            <div className="qa-question">
              <div className="q-avatar">{qa.user.charAt(0)}</div>
              <div className="q-content">
                <div className="q-header">
                  <strong>{qa.user}</strong> 
                  <span className="q-time"><ClockCircleOutlined /> {qa.time}</span>
                </div>
                <p>{qa.question}</p>
                <div className="qa-action">
                  <span className="btn-reply"><MessageOutlined /> Phản hồi</span>
                </div>
              </div>
            </div>
            
            {/* Câu trả lời (Admin) */}
            {qa.reply && (
              <div className="qa-reply">
                <div className="r-avatar">S</div>
                <div className="r-content">
                  <div className="q-header">
                    <strong>Quản Trị Viên <span className="badge-qtv">QTV</span></strong> 
                    <span className="r-time"><ClockCircleOutlined /> {qa.replyTime}</span>
                  </div>
                  {qa.reply.split('\n').map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                  <div className="qa-action">
                    <span className="btn-reply"><MessageOutlined /> Phản hồi</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TourQA;
