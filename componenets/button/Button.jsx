// Button.jsx
import React from "react";

const Button = React.memo(({ text, className, onClick }) => {
  return (
    <button className={className} onClick={onClick}>
      {text}
    </button>
  );
});

Button.displayName = "Button";

export default Button;
