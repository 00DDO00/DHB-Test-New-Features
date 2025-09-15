import React from "react";
import { Global, css } from "@emotion/react";

const GlobalStyle = (props: any) => (
  <Global
    {...props}
    styles={css`
      html,
      body,
      #root {
        height: 100%;
      }

      body {
        margin: 0;
      }

      /* WCAG: Ensure visible focus indicator for keyboard users */
      *:focus {
        outline: 2px solid #0a84ff;
        outline-offset: 2px;
      }

      /* Override focus styles for drag handles */
      [data-rbd-drag-handle-draggable-id]:focus,
      [data-rbd-drag-handle-draggable-id] *:focus {
        outline: none !important;
        box-shadow: none !important;
      }

      /* Prefer :focus-visible where supported for better UX */
      :focus-visible,
      .Mui-focusVisible {
        outline: 3px solid #ff9500;
        outline-offset: 3px;
      }

      /* Strengthen focus ring for common interactive elements (MUI + native) */
      a[href]:focus,
      button:focus,
      .MuiButtonBase-root:focus,
      .MuiButtonBase-root.Mui-focusVisible,
      input:focus,
      select:focus,
      textarea:focus,
      .MuiInputBase-input:focus,
      [role="button"]:focus,
      [tabindex]:not([tabindex="-1"]):focus {
        outline: 3px solid #0a84ff;
        outline-offset: 3px;
      }

      .MuiCardHeader-action .MuiIconButton-root {
        padding: 4px;
        width: 28px;
        height: 28px;
      }

      body > iframe {
        pointer-events: none;
      }
    `}
  />
);

export default GlobalStyle;
