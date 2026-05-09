/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Product {
  id: string;
  name: string;
  nameBn: string;
  price: number;
  weight: string;
  weightBn: string;
  description: string;
  descriptionBn: string;
  image: string;
  category: string;
  categoryBn: string;
}

export interface CartItem extends Product {
  quantity: number;
}
