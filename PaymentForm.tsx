import React, { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { orderInfoAtom } from '../atoms/orderAtom';
import axiosInstance from '../components/axiosInstance';
import { PaymentModal } from './PaymentModal';

export const PaymentForm = () => {
    // 전역 상태에서 주문 정보 가져오기
    const [orderInfo, setOrderInfo] = useAtom(orderInfoAtom);
    // 사용자가 입력한 포인트(할인 금액)
    const [discountAmount, setDiscountAmount] = useState(orderInfo.discountAmount || 0);
    // 배송 정보 등록 모달 상태
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    // 결제 방법 상태 (간편 결제/일반 결제)
    const [paymentMethod, setPaymentMethod] = useState(orderInfo.payMethod);
    // 총 결제 금액 상태
    const [totalAmount, setTotalAmount] = useState(orderInfo.totalAmount);

    // 배송 정보 입력 핸들러
    const handleReceiverInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        // 배송 정보 상태 업데이트
        setOrderInfo((prev) => ({
            ...prev,
            selectedProduct: {
                ...prev.selectedProduct,
                [name]: value,
            },
        }));
    };

    // 아임포트(PortOne) 초기화
    useEffect(() => {
        if (typeof window !== 'undefined' && window.IMP) {
            window.IMP.init('imp34716183'); // PortOne 계정 ID 설정
        } else {
            console.error('포트원 모듈이 로드되지 않았습니다.');
        }
    }, []);

    // 상품 가격 및 수량을 기반으로 총 결제 금액 계산
    useEffect(() => {
        const calculatedTotal = orderInfo.selectedProduct.price * orderInfo.selectedProduct.quantity;
        setTotalAmount(calculatedTotal); // 총 금액 업데이트
        console.log('상품 가격 및 수량 기준 총 결제 금액:', calculatedTotal);
    }, [orderInfo.selectedProduct]);

    // 포인트 적용 버튼 핸들러
    const handlePointsApply = () => {
        // 상품 가격에 따른 총 금액 계산
        const calculatedTotal = orderInfo.selectedProduct.price * orderInfo.selectedProduct.quantity;
        // 사용자가 입력한 포인트를 총 금액에서 차감
        const newTotal = calculatedTotal - discountAmount;
        setTotalAmount(newTotal > 0 ? newTotal : 0); // 음수 방지
        console.log('포인트 적용 후 총 금액:', newTotal > 0 ? newTotal : 0);
    };

    // 배송 정보 등록 모달 열기
    const openPaymentModal = () => setIsPaymentModalOpen(true);
    // 배송 정보 등록 모달 닫기
    const closePaymentModal = () => setIsPaymentModalOpen(false);

    // 배송 정보 등록 핸들러
    const handleRegister = (
        name: string,
        phone: string,
        address: string,
        detailAddr: string,
        postCode: string,
        memo: string
    ) => {
        // 입력된 배송 정보를 상태에 업데이트
        setOrderInfo({
            ...orderInfo,
            receiverName: name,
            receiverPhone: phone,
            deliveryAddr: address,
            deliveryDetailAddr: detailAddr,
            postCode: postCode,
            request: memo,
        });
        closePaymentModal(); // 모달 닫기
    };

    // 결제 버튼 클릭 핸들러
    const onClickPayment = async () => {
        try {
            // 서버에 결제 사전 등록 API 요청
            const response = await axiosInstance.post('/api/order/payment/pre-registration', {
                goods: orderInfo.selectedProduct.goods,
                quantity: orderInfo.selectedProduct.quantity,
                totalAmount: totalAmount,
                discountAmount: orderInfo.selectedProduct.discountAmount,
                deliveryAddr: orderInfo.deliveryAddr,
                deliveryDetailAddr: orderInfo.deliveryDetailAddr,
                receiverName: orderInfo.receiverName,
                receiverPhone: orderInfo.receiverPhone,
                payMethod: paymentMethod,
                request: orderInfo.request,
                postCode: orderInfo.postCode,
                user: orderInfo.user,
                orderStatus: orderInfo.selectedProduct.orderStatus,
            });
            console.log('서버 응답:', response.data);
        } catch (error) {
            console.error('Error completing order:', error);
        }

        // PortOne 결제 요청
        const { IMP } = window;
        if (IMP) {
            IMP.request_pay(
                {
                    pg: 'html5_inicis', // 결제 PG사
                    pay_method: paymentMethod, // 결제 방법
                    merchant_uid: `mid_${new Date().getTime()}`, // 고유 주문 번호
                    name: orderInfo.selectedProduct.goods_name, // 상품명
                    amount: totalAmount, // 결제 금액
                    buyer_name: orderInfo.receiverName, // 구매자 이름
                    buyer_tel: orderInfo.receiverPhone, // 구매자 전화번호
                    buyer_postcode: orderInfo.postCode, // 구매자 우편번호
                    buyer_addr: orderInfo.deliveryAddr, // 구매자 주소
                },
                (response) => {
                    if (response.success) {
                        alert('결제 성공');
                        console.log('결제 성공:', response);
                        window.location.href = '/payment-success'; // 결제 성공 페이지로 이동
                    } else {
                        alert(`결제 실패: ${response.error_msg}`);
                        console.log('결제 실패:', response.error_msg);
                    }
                }
                //결제 취소
            );
        } else {
            alert('결제 모듈 로딩에 실패했습니다.');
            console.error('포트원 모듈이 로드되지 않았습니다.');
        }
    };

    return (
        <div className="w-[498px] max-w-full border p-6 flex flex-col justify-center mx-auto bg-gray-300 space-y-6">
            {/* 주문 상품 정보 섹션 */}
            <div className="p-4 bg-white border rounded shadow-sm">
                <h2 className="mb-4 text-xl font-semibold">주문 상품 정보</h2>
                <div className="flex mt-4">
                    <img src="/path/to/product-image.jpg" alt="Product" className="w-[150px] h-[100px] mr-4" />
                    <div>
                        <div>주문상품: {orderInfo.selectedProduct.goods_name}</div>
                        <div>상품번호: {orderInfo.selectedProduct.goods}</div>
                        <div>가격: {orderInfo.selectedProduct.price.toLocaleString()}원</div>
                        {/* 수량 */}
                        <div>수량: {orderInfo.selectedProduct.quantity}</div>
                        {/* 총 결제 금액 */}
                        <div>
                            총 결제 금액:{' '}
                            {(orderInfo.selectedProduct.price * orderInfo.selectedProduct.quantity).toLocaleString()}원
                        </div>
                    </div>
                </div>
            </div>

            {/* 배송지 정보 섹션 */}
            <div className="w-full">
                <div className="p-4 bg-white border rounded shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold">배송 정보</h2>
                        <button
                            onClick={openPaymentModal}
                            className="px-3 py-1 text-white rounded bg-gradient-to-r from-pink-400 to-orange-400"
                        >
                            {orderInfo.receiverName ? '변경하기' : '등록하기'}
                        </button>
                    </div>

                    <div className="p-4 bg-white border rounded shadow-sm">
                        <div>{orderInfo.receiverName}</div>
                        <div>{orderInfo.receiverPhone}</div>
                        <div className="mb-2">
                            {orderInfo.deliveryAddr} {orderInfo.postCode ? `(${orderInfo.postCode})` : undefined}
                        </div>
                        <div>{orderInfo.deliveryDetailAddr}</div>
                        <div>{orderInfo.request}</div>
                    </div>
                </div>
            </div>

            {/* 포인트 입력 섹션 */}
            <div className="p-4 bg-white border">
                <h2 className="text-xl font-semibold">포인트</h2>
                <div className="flex">
                    <input
                        type="number"
                        placeholder="포인트 사용"
                        value={discountAmount}
                        onChange={(e) => setDiscountAmount(Number(e.target.value))}
                        className="w-2/3 p-2 border"
                    />
                    <button
                        onClick={handlePointsApply}
                        className="w-1/3 p-2 ml-2 text-white rounded bg-gradient-to-r from-pink-400 to-orange-400"
                    >
                        포인트 적용
                    </button>
                </div>
                <div className="mt-2">보유 포인트: {discountAmount.toLocaleString()}원</div>
            </div>

            {/* 결제 방법 선택 섹션 */}
            <div className="p-4 bg-white border rounded shadow-sm">
                <h2 className="mb-4 text-xl font-semibold">결제 방법</h2>
                <div>
                    <label className="block mb-2">
                        <input
                            type="radio"
                            name="paymentMethod"
                            value="easyPayment"
                            checked={paymentMethod === 'easyPayment'}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="mr-2"
                        />
                        간편 결제
                    </label>
                    <label className="block mb-2">
                        <input
                            type="radio"
                            name="paymentMethod"
                            value="generalPayment"
                            checked={paymentMethod === 'generalPayment'}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="mr-2"
                        />
                        일반 결제
                    </label>
                </div>
            </div>

            {/* 최종 결제 금액 표시 섹션 */}
            <div className="p-4 bg-white border rounded shadow-sm">
                <h2 className="mb-4 text-xl font-semibold">최종 결제 금액</h2>
                <div className="mt-4">
                    <div className="flex justify-between">
                        <span>상품가격</span>
                        <span>
                            {(orderInfo.selectedProduct.price * orderInfo.selectedProduct.quantity).toLocaleString()}원
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span>포인트 사용</span>
                        <span>-{discountAmount.toLocaleString()}원</span>
                    </div>
                    <div className="flex justify-between font-bold">
                        <span>총 결제 금액</span>
                        <span>{totalAmount.toLocaleString()}원</span>
                    </div>
                </div>
            </div>

            {/* 결제 버튼 */}
            {paymentMethod === 'generalPayment' && (
                <button
                    onClick={onClickPayment}
                    className="w-full p-4 font-bold text-white rounded bg-gradient-to-r from-pink-400 to-orange-400"
                >
                    결제하기
                </button>
            )}

            {/* 배송 정보 등록 모달 */}
            <PaymentModal isOpen={isPaymentModalOpen} onClose={closePaymentModal} onRegister={handleRegister} />
        </div>
    );
};
