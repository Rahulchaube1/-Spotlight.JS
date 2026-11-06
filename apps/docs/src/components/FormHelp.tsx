import { useEffect } from "react";
import { spotlight, driver } from "spotlight.js";
import "spotlight.js/dist/spotlight.css";

export function FormHelp() {
  useEffect(() => {
    const driverObj = spotlight({
      popoverClass: "driverjs-theme",
      stagePadding: 0,
      onDestroyed: () => {
        (document?.activeElement as any)?.blur();
      }
    });

    const nameEl = document.getElementById("name");
    const educationEl = document.getElementById("education");
    const ageEl = document.getElementById("age");
    const addressEl = document.getElementById("address");
    const submitEl = document.getElementById("submit-btn");

    nameEl!.addEventListener("focus", () => {
      driverObj.highlight({
        element: nameEl!,
        popover: {
          title: "Name",
          description: "Enter your name here",
        },
      });
    });

    educationEl!.addEventListener("focus", () => {
      driverObj.highlight({
        element: educationEl!,
        popover: {
          title: "Education",
          description: "Enter your education here",
        },
      });
    });

    ageEl!.addEventListener("focus", () => {
      driverObj.highlight({
        element: ageEl!,
        popover: {
          title: "Age",
          description: "Enter your age here",
        },
      });
    });

    addressEl!.addEventListener("focus", () => {
      driverObj.highlight({
        element: addressEl!,
        popover: {
          title: "Address",
          description: "Enter your address here",
        },
      });
    });

    submitEl!.addEventListener("focus", (e) => {
      e.preventDefault();
      driverObj.destroy();
    });
  });

  return <></>;
}
