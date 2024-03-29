import { Router } from "next/router";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import LogInBtn from "../../../components/login-btn";
import { useSession } from "next-auth/react";

const AdminDetails = () => {
  // Subscription details
  const [numberOfSeats, setNumberOfSeats] = useState(5);
  const [subscriptionPrice, setSubscriptionPrice] = useState(80);

  // Admin details
  const [adminFirstName, setAdminFirstName] = useState("");
  const [adminLastName, setAdminLastName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");

  const [errorMessage, setErrorMessage] = useState(null);

  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    const calculatedPrice = numberOfSeats * 16;
    setSubscriptionPrice(calculatedPrice);
  }, [numberOfSeats]);

  const handleSubmit = async (event) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    router.push({
      pathname: "/billing/cardDetails",
      query: {
        quantity: numberOfSeats,
        email: adminEmail,
      },
    });
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
      }}
    >
      {session ? (
        <div className="d-flex flex-items-center flex-justify-center flex-column">
          <div
            className="Box d-flex flex-items-center flex-justify-center flex-column p-4 p-6 m-6"
            style={{ maxWidth: "80ch" }}
          >
            <h1 className="h3 mb-3 f4 text-normal">
              Purchase your Watermelon subscription
            </h1>

            <form onSubmit={handleSubmit}>
              <label htmlFor="number-of-seats">Number of seats</label>
              <br />
              <input
                required
                type="number"
                className="form-control mb-2 mr-2"
                id="exampleFormControlSelect1"
                min="1"
                placeholder="Number of seats"
                value={numberOfSeats}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setNumberOfSeats(parseInt(e.target.value));
                }}
              />

              <input
                required
                type="email"
                className="form-control mb-2"
                id="exampleFormControlSelect2"
                placeholder="Admin Email"
                value={adminEmail}
                onChange={(e) => {
                  setAdminEmail(e.target.value);
                }}
              />

              <br />
              <p className="text-danger">
                Monthly subscription price: ${subscriptionPrice}
              </p>
              <input
                required
                type="text"
                className="form-control mb-2 mr-2"
                id="exampleFormControlSelect3"
                placeholder="Admin First Name"
                value={adminFirstName}
                onChange={(e) => {
                  setAdminFirstName(e.target.value);
                }}
              />
              <input
                required
                type="text"
                className="form-control mb-2"
                id="exampleFormControlSelect4"
                placeholder="Admin Last Name"
                value={adminLastName}
                onChange={(e) => {
                  setAdminLastName(e.target.value);
                }}
              />
              <br />

              <div className="d-flex flex-items-center flex-justify-center">
                <button
                  className="btn btn-primary"
                  id="checkout-and-portal-button"
                  type="submit"
                >
                  Enter Card Details
                </button>
              </div>
              {errorMessage && <div>{errorMessage}</div>}
            </form>
          </div>
        </div>
      ) : (
        <LogInBtn />
      )}
    </div>
  );
};

export default AdminDetails;
