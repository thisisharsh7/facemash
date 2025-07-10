import { useEffect } from "react";

const PathInspector = () => {
  useEffect(() => {
    const tooltip = document.createElement("div");
    tooltip.style = `
      position: fixed;
      background: rgba(0, 0, 0, 0.8);
      color: #fff;
      font-size: 12px;
      padding: 6px 10px;
      border-radius: 6px;
      z-index: 99999;
      pointer-events: none;
      max-width: 500px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      display: none;
    `;
    document.body.appendChild(tooltip);

    const getElementPath = (el) => {
      if (!el || !el.tagName) return "";

      const path = [];
      while (el && el.nodeType === 1) {
        let name = el.tagName.toLowerCase();
        if (el.id) {
          name += `#${el.id}`;
        } else if (el.className) {
          const classes = el.className
            .toString()
            .split(" ")
            .filter(Boolean)
            .join(".");
          if (classes.length) name += `.${classes}`;
        }
        path.unshift(name);
        el = el.parentElement;
      }
      return path.join(" > ");
    };

    const handleMouseOver = (e) => {
      const el = e.target;
      const path = getElementPath(el);
      if (!path) return;

      tooltip.innerText = path;
      tooltip.style.display = "block";

      const rect = el.getBoundingClientRect();
      tooltip.style.top = `${rect.top - 30}px`;
      tooltip.style.left = `${rect.left}px`;

      el.style.outline = "2px dashed red";
      setTimeout(() => {
        el.style.outline = "";
      }, 1500);
    };

    const handleMouseMove = (e) => {
      tooltip.style.top = `${e.clientY - 40}px`;
      tooltip.style.left = `${e.clientX + 10}px`;
    };

    const handleMouseOut = () => {
      tooltip.style.display = "none";
    };

    const handleClick = (e) => {
      const path = getElementPath(e.target);
      if (path) {
        navigator.clipboard.writeText(path);
        tooltip.innerText = `📋 Copied: ${path}`;
      }
    };

    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseout", handleMouseOut);
    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseout", handleMouseOut);
      document.removeEventListener("click", handleClick);
      tooltip.remove();
    };
  }, []);

  return null; // This component only attaches event listeners
};

export default PathInspector;
