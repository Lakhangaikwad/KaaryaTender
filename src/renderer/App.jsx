import React, { useEffect, useState } from "react";

export default function App() {
  const [messageFromMain, setMessageFromMain] = useState(false);

  //callback funtion if message come from the main process
  const handleMessageFromMain = (payload) => {
    setMessageFromMain(
      payload?.ack ? "Message acknowledged" : "Message not acknowledged"
    );
  };
  useEffect(() => {
    window.MessageHandler.listenForMessage(handleMessageFromMain);
  }, []);

  const sendMessageToMain = (e) => {
    e.preventDefault();
    const message = e?.target?.message.value;
    window.MessageHandler.sendMessageToMain({ message });
    setMessageFromMain();
  };

  return (
    <div className="w-90 h-100 m-4 d-flex flex-column justify-content-center align-middle">
      <form onSubmit={(e) => sendMessageToMain(e)}>
        <div className="form-group">
          <input
            type="text"
            className="form-control"
            name="message"
            required
            placeholder="Type Message to send main "
          />
          <small className="form-text text-muted">
            When you send message, you will see native notification will appear
            and show the corresponding message.
          </small>
        </div>
        <button type="submit" className="btn btn-outline-primary my-2">
          Send
        </button>
      </form>
      <p className="mt-3 text">Response is: {messageFromMain}</p>
    </div>
  );
}
