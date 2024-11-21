import React, { useState } from 'react';

export interface PaymentModalProps {
    children?: React.ReactNode;
    isOpen: boolean;
    onClose: () => void;
    onRegister: (
        receiverName: string,
        receiverPhone: string,
        deliveryAddr: string,
        detailedAddress: string,
        postCode: string, // 우편번호 추가
        request: string
    ) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, onRegister }) => {
    const [receiverName, setName] = useState(''); // 이름 상태
    const [receiverPhone, setPhone] = useState(''); // 연락처 상태
    const [deliveryAddr, setAddress] = useState(''); // 주소 상태
    const [deliveryDetailAddr, setDetailedAddress] = useState(''); // 상세 주소 상태
    const [postCode, setPostCode] = useState(''); // 우편번호 상태 추가
    const [request, setRequest] = useState(''); // 메모 상태

    const handleRegister = () => {
        console.log(receiverName, receiverPhone, deliveryAddr, deliveryDetailAddr, postCode, request);
        onRegister(receiverName, receiverPhone, deliveryAddr, deliveryDetailAddr, postCode, request);
        onClose(); // 모달 창 닫기
    };

    const handleAddressChange = () => {
        // 카카오 주소 API 호출
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="p-10 bg-white rounded-lg shadow-lg w-[500px]">
                <h2 className="mb-6 text-2xl font-bold text-gray-800">배송지 정보 등록</h2>

                {/* 입력 필드 */}
                <div className="mb-6 space-y-4">
                    <input
                        type="text"
                        placeholder="이름"
                        value={receiverName}
                        onChange={(e) => setName(e.target.value)} // 이름 입력 변경 핸들러
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="text"
                        placeholder="연락처"
                        value={receiverPhone}
                        onChange={(e) => setPhone(e.target.value)} // 연락처 입력 변경 핸들러
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    {/* 주소 변경 버튼 */}
                    <div className="flex justify-end">
                        <button
                            onClick={handleAddressChange} // 주소 변경 핸들러
                            className="px-4 py-2 text-xs font-semibold text-white transition bg-gradient-to-r from-pink-500 to-orange-400 "
                        >
                            주소 변경
                        </button>
                    </div>

                    {/* 주소와 우편번호 */}
                    <div className="flex items-center space-x-2">
                        <input
                            type="text"
                            placeholder="주소"
                            value={deliveryAddr}
                            onChange={(e) => setAddress(e.target.value)} // 주소 입력 변경 핸들러
                            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            type="text"
                            placeholder="우편번호"
                            name="postCode" // Name 설정
                            value={postCode}
                            onChange={(e) => setPostCode(e.target.value)} // 우편번호 입력 핸들러
                            className="w-40 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* 상세 주소 */}
                    <input
                        type="text"
                        placeholder="상세 주소를 입력하세요"
                        value={deliveryDetailAddr}
                        onChange={(e) => setDetailedAddress(e.target.value)} // 상세 주소 입력 변경 핸들러
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="text"
                        placeholder="요청사항"
                        value={request}
                        onChange={(e) => setRequest(e.target.value)} // 요청사항 입력 변경 핸들러
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* 하단 버튼 */}
                <div className="flex justify-between mt-6 space-x-4">
                    <button
                        onClick={handleRegister} // 등록 버튼 클릭 시 핸들러
                        className="w-1/2 p-3 text-white transition bg-gradient-to-r from-[#FF5FA2] to-[#FCC89B] rounded hover:shadow-lg"
                    >
                        저장하기
                    </button>
                    <button
                        onClick={onClose} // 취소 버튼 클릭 시 모달 닫기 핸들러
                        className="w-1/2 p-3 text-gray-700 transition rounded bg-gradient-to-r from-gray-300 to-gray-400 hover:bg-gray-400"
                    >
                        취소하기
                    </button>
                </div>
            </div>
        </div>
    );
};
