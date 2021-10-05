import React, { Fragment } from 'react';
import mealsImg from "../../assests/food.jpg";
import classes from "./Header.module.css";
import HeaderCartButton from "./HeaderCartButton.js";

const Header = (props) => {
    return (
        <Fragment>
            <header className={classes.header}>
                <h1>ReactMeals</h1>
                <HeaderCartButton onClick={props.onShowCart} />
            </header>
            <div className={classes['main-image']}>
                <img src={mealsImg} alt="A table with full of delicious food!" />
            </div>
        </Fragment>
    )
}

export default Header;
