import React from "react";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import "bootswatch/dist/united/bootstrap.min.css";
import "./App.css";

const stripePromise = loadStripe(
  "pk_test_51KTwQaHa7TlYYDW6BcxiDX7zr9Au07flPnd5ZIkGfa5uqf2pvOYfuNja3n9HhbfGqb2jMYGsu7VHUPFx7KJioEAT008kVPbBMt"
);

const CheckOutForm = () => {
  /* Conexión a Stripe */
  const stripe = useStripe();
  const elements = useElements();
  /* Imagen de carga hasta que este lista la página */
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      /* Captura de elementos en el formulario */
      card: elements.getElement(CardElement),
    });
    setLoading(true);

    if (!error) {
      const axios = require("axios");
      const { id } = paymentMethod;
      try {
        /* La cantidad en centavos */
        const { data } = await axios.post(
          "http://localhost:3001/api/checkout",
          {
            id,
            amount: 1000,
          }
        );

        console.log(data);
        /* Limpiar elementos  */
        elements.getElement(CardElement).clear();
      } catch (err) {
        console.log(err);
      }

      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card card-body">
      <img
        src="https://http2.mlstatic.com/D_NQ_NP_795488-MEC48694618207_122021-O.webp"
        alt="Ecografo Portatil Wifi Convexo"
        className="img-eco"
      />
      <h3 className="text-center ">Price: 100$</h3>
      <div className="form-group">
        <CardElement className="form-control" />
      </div>
      {/* TODO */}
      {/* El botón de comprar no se activa hasta que STRIPE este listo
      Esto se logra confimando si el objeto existe */}
      <button className="btn btn-lg btn-primary" disabled={!stripe}>
        {loading ? (
          <div class="spinner-grow" role="status">
            <span class="sr-only"/>
          </div>
        ) : (
          "Comprar"
        )}
      </button>
    </form>
  );
};

function App() {
  return (
    <Elements stripe={stripePromise}>
      <div className="container p-4">
        <div className="row">
          <div className="col-md-4 offset-md-4">
            <CheckOutForm />{" "}
          </div>
        </div>
      </div>
    </Elements>
  );
}

export default App;
