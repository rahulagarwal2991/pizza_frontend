import React, { useState, useEffect } from 'react';

import api from '../../services/api';
import { brCurrency } from '../../services/util';

import {
  Wrapper,
  List,
  Product,
  EmptyList,
  Title,
  ProductName,
  ProductActions,
  CheckoutButton,
  Footer,
  RemoveProductButton,
  Payment,
  PaymentTotal,
  PaymentCharge,
  PaymentMethods,
  PaymentMethodsHeader,
  PaymentMethodsOptions,
  PaymentMethodOption,
  Input,
  TextArea,
  CheckoutField,
  CloseCheckoutButton,
  Header,
  OpenSideButton,
  CheckoutButtons,
  CheckoutFinishButton,
  CheckoutStandardButton,
  CheckoutGoButton,
  InvalidMessage,
  OrderMadeMask,
  OrderMaskContent
} from './styles';

const PAYMENT_METHODS = {
  cash: 'cash',
  creditCard: 'credit_card',
};

export default function Checkout({ products, afterCheckout, onClickRemoveProduct }) {
  const [loadingCheckout, setLoadingCheckout] = useState(false);
  const [total, setTotal] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS.cash);
  const [clientName, setClientName] = useState('');
  const [cash, setCash] = useState(0);
  const [showCashOptions, setShowCashOptions] = useState(true);
  const [charge, setCharge] = useState(0);
  const [observation, setObservation] = useState(null);
  const [onCheckout, setOnCheckout] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [validations, setValidations] = useState({ clientName: true });
  const [showMask, setShowMask] = useState(false);

  useEffect(() => {
    const newTotal = products.reduce(
      (prev, { price, checkout_quantity }) => prev + (price * checkout_quantity),
      0,
    );

    setTotal(newTotal);
  }, [products]);

  useEffect(() => {
    setShowCashOptions(paymentMethod === PAYMENT_METHODS.cash);
  }, [paymentMethod]);

  useEffect(() => {
    setCharge(cash > total && total > 0 ? cash - total : 0);
  }, [cash, total]);

  const onCheckoutClickHandler = async () => {
    const newValidations = { ...validations, clientName: clientName.trim() != '' };
    setValidations(newValidations);

    if (newValidations.clientName) {
      await triggerCheckout()
    }
  }

  const triggerCheckout = async () => {
    if (products.length) {
      setLoadingCheckout(true);

      const body = {
        client_name: clientName,
        observation,
        payment_method: paymentMethod,
        products: products.map(({ id, checkout_quantity: amount }) => ({ id, amount })),
      };

      api.post('/orders', body)
        .then(() => {
          setClientName('');
          setPaymentMethod(PAYMENT_METHODS.cash);
          setObservation('');
          setOnCheckout(false);

          afterCheckout();
          setLoadingCheckout(false);
          setShowMask(true);

          setTimeout(() => setShowMask(false), 3000);
        }).catch((err) => console.log(err));
    }
  };

  const chargeElement = onCheckout && showCashOptions ? (
    <PaymentCharge style={{ display: showCashOptions ? '' : 'none' }}>
      <div>
        <strong>Amount</strong>
      </div>
      <div>
        {brCurrency(charge)}
      </div>
    </PaymentCharge>
  ) : '';

  const payment = (
    <Payment>
      <PaymentTotal>
        <div>
          <strong>Total</strong>
        </div>
        <div>
          {brCurrency(total)}
        </div>
      </PaymentTotal>
      {chargeElement}
    </Payment>
  );

  const productsList = products.length ? (
    <List>
      {products.map((product) => (
        <Product key={product.id}>
          <ProductName>
            {`${product.name} (${product.checkout_quantity})`}
          </ProductName>
          <ProductActions>
            <RemoveProductButton onClick={() => onClickRemoveProduct(product.id)}>
              <i className="fas fa-times" />
            </RemoveProductButton>
          </ProductActions>
        </Product>
      ))}
    </List>
  ) : (<EmptyList>There are no products in the list.</EmptyList>);

  const checkoutFields = onCheckout ? (
    <>
      <CheckoutField>
        <label>
          <h3>Customer name</h3>
          <Input type="text" onChange={(e) => setClientName(e.target.value)} />
        </label>
        {!validations.clientName ? (
          <InvalidMessage>Please enter customer name.</InvalidMessage>
        ) : ''}
      </CheckoutField>

      <CheckoutField>
        <label>
          <h3>address</h3>
          <TextArea onChange={(e) => setObservation(e.target.value)} />
        </label>
      </CheckoutField>

      {payment}

      <CheckoutButtons>
        <CheckoutStandardButton style={{ marginRight: '5px' }} onClick={() => setOnCheckout(false)}>
          discard
        </CheckoutStandardButton>
        <CheckoutFinishButton disabled={!products.length} onClick={onCheckoutClickHandler}>
          { loadingCheckout ? (<i className="fas fa-circle-notch fa-spin" />) : 'confirm' }
        </CheckoutFinishButton>
      </CheckoutButtons>
      
    </>
  ) : (
    <>
      {payment}
      <CheckoutGoButton style={{ display: onCheckout ? 'none' : '' }} disabled={!products.length} onClick={() => setOnCheckout(true)}>
      Checkout
      </CheckoutGoButton>
    </>
  );

  return (
    <>
      <OpenSideButton
        onClick={() => setShowCheckout(!showCheckout)}
      >
        <i className="fas fa-shopping-cart" />

      </OpenSideButton>
      <Wrapper showCheckout={showCheckout}>
        {showMask ? (<OrderMadeMask>
          <OrderMaskContent>Order placed successfully!</OrderMaskContent>
        </OrderMadeMask>) : ''}
        <Header>
          <Title>Checkout</Title>
          <CloseCheckoutButton showCheckout={showCheckout} onClick={() => setShowCheckout(false)}>
            <i className="fas fa-times" />
          </CloseCheckoutButton>
        </Header>
        {!onCheckout ? productsList : ''}

        <Footer>
          {checkoutFields}
        </Footer>
      </Wrapper>
    </>
  );
}
