import React, { useState, useLayoutEffect, useRef } from "react";

//https://www.npmjs.com/package/mathjax-react
// the reduced version tutorial:  https://gist.github.com/GiacoCorsiglia/1619828473f4b34d3d914a16fcbf10f3

export default function Math({ tex, display = false }) {
  const rootElementRef = useRef(null);
  const { __MathJax_State__, MathJax } = window;
  // Store this in local state so we can make the component re-render when
  // it's updated.
  const [isReady, setIsReady] = useState(__MathJax_State__.isReady);

  useLayoutEffect(() => {
    // Avoid running this script if the MathJax library hasn't loaded yet.
    if (!isReady) {
      // But trigger a re-render of this component once it is loaded.
      __MathJax_State__.promise.then(() => setIsReady(true));
      return;
    }

    // This element won't be null at this point.
    const mathElement = rootElementRef.current;

    // Remove previous typeset children.
    mathElement.innerHTML = "";

    // Reset equation numbers.
    MathJax.texReset();

    // Construct options.
    const options = MathJax.getMetricsFor(mathElement);
    options.display = display;

    // Potentially this could/should be switched to use the synchronous version
    // of this MathJax function, `MathJax.tex2svg()`.
    MathJax.tex2svgPromise(tex, options)
      .then(function (node) {
        // `mathElement.replaceWith(node)` would be nicer markup-wise, but that
        // seems to mess with React's diffing logic.
        mathElement.appendChild(node);
        // Update the global MathJax CSS to account for this new element.
        MathJax.startup.document.clear();
        MathJax.startup.document.updateDocument();
      })
      .catch(function (err) {
        console.error(err);
      });
  }, [tex, display, isReady]);

  return <span ref={rootElementRef}></span>;
}
