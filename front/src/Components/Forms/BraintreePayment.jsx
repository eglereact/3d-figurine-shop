import React, { useEffect, useRef, useState } from "react";
import dropin from "braintree-web-drop-in";
import useServerGet from "../../Hooks/useServerGet";
import useServerPost from "../../Hooks/useServerPost";
import * as l from "../../Constants/urls";

// Kepping for reference
const BraintreePayment = ({ total, setPaymentNonce }) => {
  const [dropinInstance, setDropinInstance] = useState(null);
  const dropinContainerRef = useRef(null);
  const { doAction: doGet, response: serverGetResponse } =
    useServerGet("clienttoken");
  const [clientToken, setClientToken] = useState(null);
  const [amount, setAmount] = useState(0); // Add state for amount
  const { doAction: doPost, response: serverPostResponse } =
    useServerPost("checkout");
  useEffect(() => {
    doGet();
  }, [doGet]);

  useEffect(() => {
    if (null === serverGetResponse) {
      return;
    }
    setClientToken(serverGetResponse.data.data ?? null);
  }, [serverGetResponse]);

  console.log(total);

  useEffect(() => {
    if (clientToken) {
      dropin.create(
        {
          authorization: clientToken,
          container: dropinContainerRef.current,
        },
        (err, instance) => {
          if (err) {
            console.error("Drop-in creation error:", err);
            return;
          }
          setDropinInstance(instance);
        }
      );
    }

    // Cleanup: Ensure that teardown is only called once
    return () => {
      if (dropinInstance && typeof dropinInstance.teardown === "function") {
        dropinInstance
          .teardown()
          .catch((err) => console.error("Teardown error:", err));
      }
    };
  }, [clientToken, dropinInstance]);

  useEffect(() => {
    if (null === serverPostResponse) {
      return;
    }
    // setButtonDisabled(false);
    if (serverPostResponse.type === "success") {
      setTimeout(() => {
        window.location.hash = l.SITE_CHECKOUT;
      }, 2000);
    } else {
      if (serverPostResponse.data?.response?.data?.errors) {
        // setServerErrors(serverPostResponse.data.response.data.errors);
      }
    }
  }, [serverPostResponse]);

  const handleSubmit = () => {
    if (!dropinInstance) return;

    dropinInstance.requestPaymentMethod((err, payload) => {
      if (err) {
        console.error("Payment method error:", err);
        return;
      }

      // Send nonce and amount to the server for processing
      const paymentData = {
        paymentMethodNonce: payload.nonce, // Ensure this matches your backend's key
        amount: total,
      };

      // POST to the server using doPost
      doPost(paymentData);
      setPaymentNonce(payload.nonce);
      console.log(payload.nonce);
    });
  };

  return (
    <div>
      <div ref={dropinContainerRef} id="dropin-container"></div>
      <button
        onClick={handleSubmit}
        className="button-dark active:scale-75 transition-transform bg-grey text-white p-4 cursor-pointer uppercase px-10 rounded button-animation"
      >
        Purchase
      </button>
    </div>
  );
};

export default BraintreePayment;
