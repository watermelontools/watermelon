import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import addEmailToGitHubQueryCountTable from "../../utils/db/github/addEmailToGitHubQueryCountTable";

function Paymentsuccess() {
  const router = useRouter();

  const [numberOfSeats, setNumberOfSeats] = useState(4);
  const [emailArray, setEmailArray] = useState([]);

  useEffect(() => {
    const { seats } = router.query as { seats: string };
    const parsedSeats = parseInt(seats);
    setNumberOfSeats(parsedSeats);
  }, [router.query]);

  const handleSubmit = (e) => {
    e.preventDefault();
    emailArray.forEach((email) => {
      // Add email to the list of paying users
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/payments/addEmails`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      });

      // Add email to github query count table
      addEmailToGitHubQueryCountTable(email);
    });

    // Send welcome to the team email
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/sendgrid/sendWelcome`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ emails: emailArray, sender: "info@watermelon.tools" }),
    });

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
                  type="email"
                  placeholder="Enter email"
                  className="form-control mb-2 mr-2"
                  onChange={(e) => {
                    setEmailArray([
                      ...emailArray.slice(0, seatIndex),
                      e.target.value,
                      ...emailArray.slice(seatIndex + 1),
                    ]);
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
