import { GoogleGenerativeAI } from '@google/genai';

let client: GoogleGenerativeAI | null = null;

function getAIClient() {
  if (!client) {
    const apiKey = import.meta.env.VITE_GOOGLE_AI_API_KEY;
    if (!apiKey) {
      throw new Error('VITE_GOOGLE_AI_API_KEY is not configured');
    }
    client = new GoogleGenerativeAI({ apiKey });
  }
  return client;
}

export interface AIGeneratedContent {
  productDescription?: string;
  productName?: string;
  couponText?: string;
  error?: string;
}

/**
 * Generate AI-powered product description
 */
export async function generateProductDescription(productName: string, category: string): Promise<string> {
  try {
    const ai = getAIClient();
    const model = ai.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `You are a product description writer for a Bengali spice shop called "Noor Pure Spice". 
Generate a compelling and professional product description in Bengali for the following:
Product Name: ${productName}
Category: ${category}

The description should be:
- 2-3 sentences
- Highlight quality and authenticity
- Include health benefits if applicable
- Use Bengali language
- Professional and persuasive tone
- Suitable for an e-commerce website

Provide only the description text, no additional commentary.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return text.trim();
  } catch (error) {
    console.error('Error generating product description:', error);
    throw error;
  }
}

/**
 * Generate AI-powered coupon promotional text
 */
export async function generateCouponText(couponCode: string, discount: number, discountType: string): Promise<string> {
  try {
    const ai = getAIClient();
    const model = ai.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const discountText = discountType === 'percentage' ? `${discount}%` : `৳${discount}`;

    const prompt = `You are a promotional copywriter for "Noor Pure Spice", a premium Bengali spice shop.
Generate an engaging promotional text for a discount coupon in Bengali.

Coupon Code: ${couponCode}
Discount: ${discountText}

The promotional text should:
- Be 1-2 sentences
- Encourage customers to use the coupon
- Be written in Bengali
- Include urgency or excitement
- Be suitable for social media and email marketing
- Mention "Noor Pure Spice" brand

Provide only the promotional text, no additional commentary.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return text.trim();
  } catch (error) {
    console.error('Error generating coupon text:', error);
    throw error;
  }
}

/**
 * Generate AI-powered order summary analysis
 */
export async function generateOrderAnalysis(totalOrders: number, totalRevenue: number, topProduct: string): Promise<string> {
  try {
    const ai = getAIClient();
    const model = ai.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `You are a business analyst for "Noor Pure Spice" e-commerce platform.
Analyze the following metrics and provide a brief business insight in Bengali:

Total Orders: ${totalOrders}
Total Revenue: ৳${totalRevenue}
Top Selling Product: ${topProduct}

Provide:
- A brief 2-3 sentence analysis
- In Bengali language
- Professional and actionable insights
- Suitable for admin dashboard display

Provide only the analysis text, no additional commentary.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return text.trim();
  } catch (error) {
    console.error('Error generating order analysis:', error);
    throw error;
  }
}

/**
 * Generate AI-powered customer support response suggestion
 */
export async function generateSupportResponse(customerMessage: string): Promise<string> {
  try {
    const ai = getAIClient();
    const model = ai.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `You are a customer service representative for "Noor Pure Spice".
A customer has sent the following message. Generate a helpful and professional response in Bengali.

Customer Message: "${customerMessage}"

The response should:
- Address the customer's concern
- Be written in Bengali
- Be professional and polite
- Include relevant information about products or services
- Be concise (2-3 sentences)
- Include a call to action if appropriate

Provide only the response text, no additional commentary.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return text.trim();
  } catch (error) {
    console.error('Error generating support response:', error);
    throw error;
  }
}
