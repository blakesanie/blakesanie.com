import React from "react";

export default function Copyright(props) {
  return (
    <p
      style={Object.assign(
        {
          color: `#999`,
          fontWeight: 400,
          fontSize: 13,
          width: `100%`,
          textAlign: "center",
          padding: `30px 0`,
          marginTop: 10,
        },
        props.style
      )}
    >
      {`Copyright © Blake Sanie ${new Date().getFullYear()} | All rights reserved | `}
      <a
        href="https://www.apache.org/licenses/LICENSE-2.0"
        target="_blank"
        style={{
          color: "inherit",
        }}
      >
        License
      </a>
      {` | `}
      <a
        href="https://github.com/blakesanie/blakesanie.com"
        target="_blank"
        style={{
          color: "inherit",
        }}
      >
        Source
      </a>
    </p>
  );
}
