import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_WHITELIST } from "../utils/queries";
import { SEND_MAGIC_LINK } from "../utils/mutations";

const LoginUser = () => {
  useEffect(() => {}, []);

  const [formState, setFormState] = useState({ email: "" });
  const { loading, error, data } = useQuery(GET_WHITELIST);
  const [sendMagicLink, { loading: sending, error: sendError, data: sendData }] =
    useMutation(SEND_MAGIC_LINK);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  // update state based on form input changes
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  // submit form
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    // Check if the email is in the whitelist
    const whitelistEmails = data.getUsers.map((user) => user.email);
    if (!whitelistEmails.includes(formState.email)) {
      alert("Email not found in whitelist");
      return; // Stop the process if email is not in the whitelist
    }

    // If the email is in the whitelist, proceed to send magic link
    try {
      await sendMagicLink({
        variables: { email: formState.email },
      });
      alert("Magic link sent!");
    } catch (e) {
      console.error("Error sending magic link:", e);
    }
  };
  return (
    <div className="login">
      <h3> User your email to access the INTAC network</h3>
      <form onSubmit={handleFormSubmit}>
        <input
          className="form-input"
          placeholder="Your email"
          name="email"
          type="email"
          value={formState.email}
          onChange={handleChange}
        />
        <button
          className="btn btn-block btn-primary"
          style={{ cursor: "pointer" }}
          type="submit"
          disabled={sending}
        >
          {sending ? "Sending..." : "Send Login Link"}
        </button>
      </form>
      <p>
        {" "}
        If your are having trouble login in please contact your Intac School professor or
        student point of contact
      </p>

      {sendError && <p>Error sending magic link: {sendError.message}</p>}
      {sendData && <p>{sendData.sendMagicLink}</p>}

      {/* <div>
        <h4>Whitelist Emails:</h4>
        <ol>
          {data.getUsers.map((user, index) => (
            <li key={index}>{user.email}</li>
          ))}
        </ol>
      </div> */}
    </div>
  );
};
export default LoginUser;
