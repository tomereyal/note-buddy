import React from "react";
import Math from "./Math";
import MathEditor from "../../editor/MathEditor";
import TitleEditor from "../../editor/TitleEditor/TitleEditor";
export default function TestPage() {
  return (
    <div>
      <h1>Testing Page</h1>
      <div>
        <TitleEditor></TitleEditor>
      </div>
    </div>
  );
}

/**
 * const mathTex = String.raw`


  $$\lim_{x \to \infty} \exp(-x) = 0$$

  const expression = `       When $a \ne 0$, there are two solutions to (ax^2 + bx + c = 0) and they are`;
  const secondExpression = String.raw` $x = \frac{-b \pm \sqrt{b^2-4ac}}{2a}.$`;
 * 
 * 
 */
