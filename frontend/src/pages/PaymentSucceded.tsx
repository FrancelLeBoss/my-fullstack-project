import React from 'react'
import { useParams } from 'react-router-dom';

const PaymentSucceded = () => {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const { order_id } = useParams<{ order_id: string }>();
  return (
    <div>La commande {order_id} a été effectuée avec succès.</div>
  )
}

export default PaymentSucceded