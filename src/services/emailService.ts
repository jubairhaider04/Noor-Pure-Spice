interface EmailParams {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async (params: EmailParams) => {
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });
    
    if (!response.ok) {
      const error = await response.json();
      console.error('Email API Error:', error);
      return { success: false, error };
    }
    
    return { success: true };
  } catch (error) {
    console.error('Email Fetch Error:', error);
    return { success: false, error };
  }
};

export const getOrderConfirmationHtml = (order: any) => {
  return `
    <div style="font-family: sans-serif; padding: 20px; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 10px;">
      <h1 style="color: #BA0D15;">নূর গুঁড়া মসলা - অর্ডার কনফার্মেশন</h1>
      <p>প্রিয় ${order.customerInfo.name},</p>
      <p>আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে। আমাদের পণ্য পছন্দ করার জন্য আপনাকে ধন্যবাদ।</p>
      
      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0;">অর্ডার সারসংক্ষেপ:</h3>
        <p>অর্ডার নম্বর: <strong>#${order.id?.slice(-6).toUpperCase()}</strong></p>
        <p>মোট পরিমাণ: <strong>৳ ${order.totalAmount}</strong></p>
        <p>পেমেন্ট মেথড: <strong>ক্যাশ অন ডেলিভারি</strong></p>
      </div>
      
      <p>আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব এবং পণ্যটি ডেলিভারির ব্যবস্থা করব।</p>
      
      <div style="margin-top: 30px; border-top: 1px solid #eee; pt: 20px; font-size: 12px; color: #666;">
        <p>শুভেচ্ছান্তে,<br>নূর গুঁড়া মসলা টিম</p>
        <p>যোগাযোগ: ০১৮১১-১১১১১১</p>
      </div>
    </div>
  `;
};

export const getShippingUpdateHtml = (order: any, status: string) => {
  const statusMap: any = {
    'processing': 'প্রসেসিং করা হচ্ছে',
    'shipped': 'ডেলিভারির জন্য পাঠানো হয়েছে',
    'delivered': 'সফলভাবে ডেলিভারি করা হয়েছে',
    'cancelled': 'বাতিল করা হয়েছে'
  };

  return `
    <div style="font-family: sans-serif; padding: 20px; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 10px;">
      <h1 style="color: #BA0D15;">নূর গুঁড়া মসলা - ডেলিভারি আপডেট</h1>
      <p>প্রিয় ${order.customerInfo.name},</p>
      <p>আপনার অর্ডার (#${order.id?.slice(-6).toUpperCase()}) এর বর্তমান অবস্থা: <strong>${statusMap[status] || status}</strong></p>
      
      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
         <p>অর্ডার নম্বর: <strong>#${order.id?.slice(-6).toUpperCase()}</strong></p>
         <p>মোট পরিমাণ: <strong>৳ ${order.totalAmount}</strong></p>
      </div>
      
      ${status === 'shipped' ? '<p>আমাদের প্রতিনিধি খুব শীঘ্রই আপনার ঠিকানায় পৌঁছাবেন। দয়া করে ফোনটি সাথে রাখুন।</p>' : ''}
      
      <div style="margin-top: 30px; border-top: 1px solid #eee; pt: 20px; font-size: 12px; color: #666;">
        <p>শুভেচ্ছান্তে,<br>নূর গুঁড়া মসলা টিম</p>
      </div>
    </div>
  `;
};
