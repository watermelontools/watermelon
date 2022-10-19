import { useState, useEffect } from "react";
import { useRouter } from "next/router";

function Paymentsuccess() {
  const router = useRouter();

  const [numberOfSeats, setNumberOfSeats] = useState(4);

  let localEmailArray = [];

  useEffect(() => {
    const { seats } = router.query as { seats: string };
    const parsedSeats = parseInt(seats);
    setNumberOfSeats(parsedSeats);
  }, [router.query]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("localEmailArray", localEmailArray);
    // send local email array to DB here
    router.push("/billing/teammatesInvited");
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
      }}
    >
      <div className="d-flex flex-items-center flex-justify-center flex-column">
        <div
          className="Box d-flex flex-items-center flex-justify-center flex-column p-4 p-6 m-6"
          style={{ maxWidth: "80ch" }}
        >
          <h1 className="h3 mb-3 f4 text-normal">
            Add your team members to Watermelon by typing their email addresses
          </h1>
          {/* Add a for loop of length equal to seats*/}
          {/* Add input field for each iteratrion */}
          {/* Style using primer system */}
          <form onSubmit={(e) => handleSubmit(e)}>
            {Array.from(Array(numberOfSeats || 0).keys()).map((seatIndex) => (
              <div className="p-3" key={seatIndex}>
                {/* on change, add email to email */}
                <input
                  required
                  id={`email${seatIndex}`}
                  pattern="(?!^[.+&'_-]*@.*$)(^[_\w\d+&'-]+(\.[_\w\d+&'-]*)*@[\w\d-]+(\.[\w\d-]+)*\.(([\d]{1,3})|([\w]{2,}))$)"
                  type="email"
                  placeholder="Enter email"
                  className="form-control mb-2 mr-2"
                  onChange={(e) => {
                    localEmailArray[seatIndex] = e.target.value;
                  }}
                />
              </div>
            ))}
            <div className="d-flex flex-items-center flex-justify-center">
              <button
                className="btn btn-primary"
                id="checkout-and-portal-button"
                type="submit"
              >
                Invite Team Members
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Paymentsuccess;
