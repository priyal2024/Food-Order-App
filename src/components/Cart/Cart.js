import React, { Fragment, useContext, useState } from 'react';
import classes from "./Cart.module.css";
import Modal from "../UI/Modal";
import CartContext from "../../store/cart-context";
import CartItem from "./CartItem";
import Checkout from "./Checkout.js";

const Cart = (props) => {
    const [isCheckout, setIsCheckout] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [didSubmit, setDidSubmit] = useState(false);

    const cartCtx = useContext(CartContext);

    const totalAmount = `$${cartCtx.totalAmount.toFixed(2)}`;
    const hasItems = cartCtx.items.length > 0;

    const cartItemRemoveHAndler = (id) => {
        cartCtx.removeItem(id);
    };

    const orderHandler = () => {
        setIsCheckout(true);
    }

    const cartItemAddHandler = (item) => {
        cartCtx.addItem({ ...item, amount: 1 });
    };

    const cartItems = <ul className={classes["cart-items"]}>{cartCtx.items.map(item =>
        <CartItem
            key={item.id}
            name={item.name}
            amount={item.amount}
            price={item.price}
            onRemove={cartItemRemoveHAndler.bind(null, item.id)}
            onAdd={cartItemAddHandler.bind(null, item)}
        />
    )}</ul>;

    const modalActions = (
        <div className={classes.actions}>
            <button className={classes['button--alt']} onClick={props.onClose}>Close</button>
            {
                hasItems && <button className={classes.button} onClick={orderHandler}>Order</button>
            }
        </div>
    );

    const submitOrderHandler = async (userData) => {
        setIsSubmitting(true);
        await fetch("https://food-order-app-17b6b-default-rtdb.firebaseio.com/order.json", {
            method: 'POST',
            body: JSON.stringify({
                user: userData,
                orderedItems: cartCtx.items
            })
        });
        setIsSubmitting(false);
        setDidSubmit(true);
        cartCtx.clearCart();
    };

    const cartModalContent = <Fragment>
        {cartItems}
        <div className={classes.total}>
            <span>Total Amount:</span>
            <span>{totalAmount}</span>
        </div>
        {isCheckout && <Checkout onConfirm={submitOrderHandler} onCancel={props.onClose} />}
        {!isCheckout && modalActions}
    </Fragment>

    const isSubmittingOrderData = <p>Sending order data...</p>;
    const didSubmitModalContent = <Fragment>
        <p>Successfully sent the order!</p>
        <div className={classes.actions}>
            <button type='button' className={classes.button} onClick={props.onClose}>
                Close
            </button>
        </div>
    </Fragment>

    return (
        <Modal onClose={props.onClose}>
            {!isSubmitting && !didSubmit && cartModalContent}
            {isSubmitting && isSubmittingOrderData}
            {!isSubmitting && didSubmit && didSubmitModalContent}
        </Modal>
    )
}

export default Cart;
